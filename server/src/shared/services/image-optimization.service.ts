import { Injectable, InternalServerErrorException, BadRequestException, Logger } from '@nestjs/common';
import { join } from 'path';
import * as fs from 'fs/promises';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';
import { SHARED_CONSTANTS } from '../shared.constants';
import { IImageOptimizationService, ImageProcessingOptions } from '../shared.interfaces';

@Injectable()
export class ImageOptimizationService implements IImageOptimizationService {
  private readonly logger = new Logger(ImageOptimizationService.name);
  private readonly outputDir = join(__dirname, '..', '..', '..', 'uploads', 'products');
  private readonly thumbnailsDir = join(this.outputDir, 'thumbnails');

  async ensureOutputDir(): Promise<void> {
    try {
      await fs.mkdir(this.outputDir, { recursive: true });
      await fs.mkdir(this.thumbnailsDir, { recursive: true });
    } catch (error) {
      this.logger.error('Ошибка создания директорий для загрузки', error);
      throw new InternalServerErrorException(SHARED_CONSTANTS.ERRORS.GENERAL.DIRECTORY_CREATION_FAILED);
    }
  }

  // Генерация уникального имени файла
  private generateUniqueFileName(originalName: string, format: string): string {
    const timestamp = Date.now();
    const randomId = uuidv4().replace(/-/g, '').substring(0, 8);
    const hash = crypto.createHash('md5').update(`${originalName}${timestamp}${randomId}`).digest('hex').substring(0, 8);
    
    return `${timestamp}-${randomId}-${hash}.${format}`;
  }

  // Валидация изображения
  async validateImage(buffer: Buffer): Promise<void> {
    try {
      const metadata = await sharp(buffer).metadata();
      
      if (!metadata.width || !metadata.height) {
        throw new BadRequestException(SHARED_CONSTANTS.ERRORS.GENERAL.INVALID_IMAGE);
      }

      // Проверяем минимальные размеры
      if (metadata.width < SHARED_CONSTANTS.IMAGES.MIN_DIMENSIONS || metadata.height < SHARED_CONSTANTS.IMAGES.MIN_DIMENSIONS) {
        throw new BadRequestException(
          `Изображение слишком маленькое. Минимальный размер: ${SHARED_CONSTANTS.IMAGES.MIN_DIMENSIONS}x${SHARED_CONSTANTS.IMAGES.MIN_DIMENSIONS} пикселей`
        );
      }

      // Проверяем максимальные размеры
      if (metadata.width > SHARED_CONSTANTS.IMAGES.MAX_DIMENSIONS || metadata.height > SHARED_CONSTANTS.IMAGES.MAX_DIMENSIONS) {
        throw new BadRequestException(
          `Изображение слишком большое. Максимальный размер: ${SHARED_CONSTANTS.IMAGES.MAX_DIMENSIONS}x${SHARED_CONSTANTS.IMAGES.MAX_DIMENSIONS} пикселей`
        );
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
              throw new BadRequestException(SHARED_CONSTANTS.ERRORS.GENERAL.INVALID_IMAGE_FORMAT);
    }
  }

  async processAndSave(
    buffer: Buffer, 
    originalName: string, 
    options: ImageProcessingOptions = {}
  ): Promise<{ mainPath: string; thumbnailPath?: string }> {
    try {
      await this.ensureOutputDir();
      
      // Валидируем изображение
      await this.validateImage(buffer);

      const {
        quality = SHARED_CONSTANTS.IMAGES.DEFAULT_QUALITY,
        maxWidth = SHARED_CONSTANTS.IMAGES.DEFAULT_MAX_WIDTH,
        maxHeight = SHARED_CONSTANTS.IMAGES.DEFAULT_MAX_HEIGHT,
        format = 'webp',
        generateThumbnail = false,
        thumbnailSize = SHARED_CONSTANTS.IMAGES.DEFAULT_THUMBNAIL_SIZE
      } = options;

      // Генерируем уникальное имя файла
      const fileName = this.generateUniqueFileName(originalName, format);
      const outputPath = join(this.outputDir, fileName);

      // Обрабатываем основное изображение
      const image = sharp(buffer, { failOnError: false });
      const metadata = await image.metadata();

      // Вычисляем новые размеры с сохранением пропорций
      let { width, height } = metadata;
      
      if (width && height) {
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
      }

      // Применяем изменения
      const processedImage = image
        .resize(width, height, { 
          fit: 'inside', 
          withoutEnlargement: true 
        })
        .webp({ 
          quality: Math.min(quality, SHARED_CONSTANTS.IMAGES.MAX_QUALITY),
          effort: SHARED_CONSTANTS.IMAGES.COMPRESSION_EFFORT
        });

      // Сохраняем основное изображение
      await processedImage.toFile(outputPath);

      let thumbnailPath: string | undefined;

      // Генерируем миниатюру если требуется
      if (generateThumbnail) {
        const thumbnailFileName = `thumb-${fileName}`;
        const thumbnailOutputPath = join(this.thumbnailsDir, thumbnailFileName);
        
        const thumbnail = sharp(buffer)
          .resize(thumbnailSize, thumbnailSize, { 
            fit: 'cover', 
            position: 'center' 
          })
          .webp({ 
            quality: Math.min(quality, SHARED_CONSTANTS.IMAGES.MAX_QUALITY),
            effort: SHARED_CONSTANTS.IMAGES.COMPRESSION_EFFORT
          });

        await thumbnail.toFile(thumbnailOutputPath);
        thumbnailPath = thumbnailOutputPath;
      }

      this.logger.log(`Изображение успешно обработано: ${fileName}`);
      
      return {
        mainPath: outputPath,
        thumbnailPath
      };
    } catch (error) {
      this.logger.error('Ошибка обработки изображения', error);
      throw new InternalServerErrorException(SHARED_CONSTANTS.ERRORS.GENERAL.IMAGE_PROCESSING_FAILED);
    }
  }

  async generateThumbnail(
    imagePath: string, 
    size: number = SHARED_CONSTANTS.IMAGES.DEFAULT_THUMBNAIL_SIZE
  ): Promise<string> {
    try {
      const fileName = `thumb-${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;
      const outputPath = join(this.thumbnailsDir, fileName);

      await sharp(imagePath)
        .resize(size, size, { fit: 'cover', position: 'center' })
        .webp({ 
          quality: SHARED_CONSTANTS.IMAGES.DEFAULT_QUALITY,
          effort: SHARED_CONSTANTS.IMAGES.COMPRESSION_EFFORT
        })
        .toFile(outputPath);

      this.logger.log(`Миниатюра создана: ${fileName}`);
      return outputPath;
    } catch (error) {
      this.logger.error('Ошибка создания миниатюры', error);
      throw new InternalServerErrorException(SHARED_CONSTANTS.ERRORS.GENERAL.OPERATION_FAILED);
    }
  }

  async compressImage(
    imagePath: string, 
    quality: number = SHARED_CONSTANTS.IMAGES.DEFAULT_QUALITY
  ): Promise<string> {
    try {
      const fileName = `compressed-${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;
      const outputPath = join(this.outputDir, fileName);

      await sharp(imagePath)
        .webp({ 
          quality: Math.min(quality, SHARED_CONSTANTS.IMAGES.MAX_QUALITY),
          effort: SHARED_CONSTANTS.IMAGES.COMPRESSION_EFFORT
        })
        .toFile(outputPath);

      this.logger.log(`Изображение сжато: ${fileName}`);
      return outputPath;
    } catch (error) {
      this.logger.error('Ошибка сжатия изображения', error);
      throw new InternalServerErrorException(SHARED_CONSTANTS.ERRORS.GENERAL.OPERATION_FAILED);
    }
  }

  async resizeImage(
    imagePath: string, 
    width: number, 
    height: number
  ): Promise<string> {
    try {
      const fileName = `resized-${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;
      const outputPath = join(this.outputDir, fileName);

      await sharp(imagePath)
        .resize(width, height, { fit: 'inside', withoutEnlargement: true })
        .webp({ 
          quality: SHARED_CONSTANTS.IMAGES.DEFAULT_QUALITY,
          effort: SHARED_CONSTANTS.IMAGES.COMPRESSION_EFFORT
        })
        .toFile(outputPath);

      this.logger.log(`Изображение изменено: ${fileName}`);
      return outputPath;
    } catch (error) {
      this.logger.error('Ошибка изменения размера изображения', error);
      throw new InternalServerErrorException(SHARED_CONSTANTS.ERRORS.GENERAL.OPERATION_FAILED);
    }
  }

  async convertFormat(
    imagePath: string, 
    format: 'webp' | 'jpeg' | 'png' = 'webp'
  ): Promise<string> {
    try {
      const fileName = `converted-${Date.now()}-${Math.random().toString(36).substring(7)}.${format}`;
      const outputPath = join(this.outputDir, fileName);

      let processedImage = sharp(imagePath);

      switch (format) {
        case 'webp':
          processedImage = processedImage.webp({ 
            quality: SHARED_CONSTANTS.IMAGES.DEFAULT_QUALITY,
            effort: SHARED_CONSTANTS.IMAGES.COMPRESSION_EFFORT
          });
          break;
        case 'jpeg':
          processedImage = processedImage.jpeg({ 
            quality: SHARED_CONSTANTS.IMAGES.DEFAULT_QUALITY,
            progressive: true
          });
          break;
        case 'png':
          processedImage = processedImage.png({ 
            compressionLevel: SHARED_CONSTANTS.IMAGES.PNG_COMPRESSION_LEVEL,
            progressive: true
          });
          break;
      }

      await processedImage.toFile(outputPath);

      this.logger.log(`Формат изменен на ${format}: ${fileName}`);
      return outputPath;
    } catch (error) {
      this.logger.error('Ошибка изменения формата изображения', error);
      throw new InternalServerErrorException(SHARED_CONSTANTS.ERRORS.GENERAL.OPERATION_FAILED);
    }
  }

  async getImageMetadata(imagePath: string): Promise<{
    width: number;
    height: number;
    format: string;
    size: number;
    channels: number;
    space: string;
  }> {
    try {
      const metadata = await sharp(imagePath).metadata();
      const stats = await fs.stat(imagePath);

      return {
        width: metadata.width || 0,
        height: metadata.height || 0,
        format: metadata.format || 'unknown',
        size: stats.size,
        channels: metadata.channels || 0,
        space: metadata.space || 'unknown'
      };
    } catch (error) {
      this.logger.error('Ошибка получения метаданных изображения', error);
      throw new InternalServerErrorException(SHARED_CONSTANTS.ERRORS.GENERAL.OPERATION_FAILED);
    }
  }

  async deleteImage(imagePath: string): Promise<void> {
    try {
      await fs.unlink(imagePath);
      this.logger.log(`Изображение удалено: ${imagePath}`);
    } catch (error) {
      this.logger.error('Ошибка удаления изображения', error);
      throw new InternalServerErrorException(SHARED_CONSTANTS.ERRORS.GENERAL.OPERATION_FAILED);
    }
  }

  async cleanupOldImages(maxAge: number = SHARED_CONSTANTS.IMAGES.DEFAULT_CLEANUP_AGE): Promise<number> {
    try {
      const files = await fs.readdir(this.outputDir);
      const now = Date.now();
      let deletedCount = 0;

      for (const file of files) {
        if (file === 'thumbnails') continue; // Пропускаем папку с миниатюрами
        
        const filePath = join(this.outputDir, file);
        const stats = await fs.stat(filePath);
        const fileAge = now - stats.mtime.getTime();

        if (fileAge > maxAge) {
          await fs.unlink(filePath);
          deletedCount++;
        }
      }

      this.logger.log(`Удалено ${deletedCount} старых изображений`);
      return deletedCount;
    } catch (error) {
      this.logger.error('Ошибка очистки старых изображений', error);
      throw new InternalServerErrorException(SHARED_CONSTANTS.ERRORS.GENERAL.OPERATION_FAILED);
    }
  }
}
