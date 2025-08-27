import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { join } from 'path';
import * as fs from 'fs/promises';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';

export interface ImageProcessingOptions {
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
  format?: 'webp' | 'jpeg' | 'png';
  generateThumbnail?: boolean;
  thumbnailSize?: number;
}

@Injectable()
export class ImageOptimizationService {
  private readonly outputDir = join(__dirname, '..', '..', '..', 'uploads', 'products');
  private readonly thumbnailsDir = join(this.outputDir, 'thumbnails');

  async ensureOutputDir(): Promise<void> {
    try {
      await fs.mkdir(this.outputDir, { recursive: true });
      await fs.mkdir(this.thumbnailsDir, { recursive: true });
    } catch (error) {
      throw new InternalServerErrorException('Не удалось создать директории для загрузки');
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
  private async validateImage(buffer: Buffer): Promise<void> {
    try {
      const metadata = await sharp(buffer).metadata();
      
      if (!metadata.width || !metadata.height) {
        throw new BadRequestException('Некорректное изображение');
      }

      // Проверяем минимальные размеры
      if (metadata.width < 50 || metadata.height < 50) {
        throw new BadRequestException('Изображение слишком маленькое. Минимальный размер: 50x50 пикселей');
      }

      // Проверяем максимальные размеры
      if (metadata.width > 8000 || metadata.height > 8000) {
        throw new BadRequestException('Изображение слишком большое. Максимальный размер: 8000x8000 пикселей');
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Некорректный формат изображения');
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
        quality = 78,
        maxWidth = 1600,
        maxHeight = 1600,
        format = 'webp',
        generateThumbnail = false,
        thumbnailSize = 300
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

      // Создаем pipeline для основного изображения
      let pipeline = image
        .rotate() // Автоматический поворот по EXIF
        .resize({ 
          width: width || maxWidth, 
          height: height || maxHeight, 
          withoutEnlargement: true,
          fit: 'inside'
        });

      // Применяем формат и качество
      switch (format) {
        case 'webp':
          pipeline = pipeline.webp({ quality, effort: 4 });
          break;
        case 'jpeg':
          pipeline = pipeline.jpeg({ quality });
          break;
        case 'png':
          pipeline = pipeline.png({ quality });
          break;
        default:
          pipeline = pipeline.webp({ quality, effort: 4 });
      }

      await pipeline.toFile(outputPath);

      let thumbnailPath: string | undefined;

      // Создаем миниатюру если требуется
      if (generateThumbnail) {
        const thumbnailFileName = `thumb-${fileName}`;
        const thumbnailOutputPath = join(this.thumbnailsDir, thumbnailFileName);

        await sharp(buffer)
          .rotate()
          .resize(thumbnailSize, thumbnailSize, {
            fit: 'cover',
            position: 'center'
          })
          .webp({ quality: 70, effort: 4 })
          .toFile(thumbnailOutputPath);

        thumbnailPath = `/uploads/products/thumbnails/${thumbnailFileName}`;
      }

      return {
        mainPath: `/uploads/products/${fileName}`,
        thumbnailPath
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Ошибка обработки изображения: ' + error.message);
    }
  }

  async processMany(
    files: Express.Multer.File[], 
    options: ImageProcessingOptions = {}
  ): Promise<string[]> {
    try {
      const tasks = files.map(async (file) => {
        const result = await this.processAndSave(file.buffer, file.originalname, options);
        return result.mainPath;
      });

      return await Promise.all(tasks);
    } catch (error) {
      throw new InternalServerErrorException('Ошибка обработки изображений: ' + error.message);
    }
  }

  // Удаление файлов
  async deleteFile(filePath: string): Promise<void> {
    try {
      const fullPath = join(__dirname, '..', '..', '..', filePath.replace(/^\//, ''));
      await fs.unlink(fullPath);
    } catch (error) {
      // Игнорируем ошибки если файл не существует
      console.warn(`Не удалось удалить файл ${filePath}:`, error.message);
    }
  }

  // Удаление нескольких файлов
  async deleteFiles(filePaths: string[]): Promise<void> {
    const deletePromises = filePaths.map(path => this.deleteFile(path));
    await Promise.allSettled(deletePromises);
  }

  // Получение информации о файле
  async getFileInfo(filePath: string): Promise<{ size: number; exists: boolean }> {
    try {
      const fullPath = join(__dirname, '..', '..', '..', filePath.replace(/^\//, ''));
      const stats = await fs.stat(fullPath);
      return { size: stats.size, exists: true };
    } catch (error) {
      return { size: 0, exists: false };
    }
  }
}
