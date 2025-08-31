import { Injectable, Logger, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { join } from 'path';
import * as fs from 'fs/promises';
import { ImageOptimizationService } from './image-optimization.service';

export interface UploadError {
  file: Express.Multer.File;
  error: Error;
  stage: 'validation' | 'processing' | 'saving';
}

export interface UploadResult {
  success: boolean;
  filePath?: string;
  error?: string;
  originalName: string;
}

@Injectable()
export class FileUploadErrorHandlerService {
  private readonly logger = new Logger(FileUploadErrorHandlerService.name);

  constructor(
    private readonly imageOptimizationService: ImageOptimizationService,
  ) {}

  /**
   * Обработка ошибок загрузки с graceful fallback
   */
  async handleUploadErrors(
    files: Express.Multer.File[],
    uploadFunction: (file: Express.Multer.File) => Promise<string>
  ): Promise<UploadResult[]> {
    const results: UploadResult[] = [];
    const uploadedFiles: string[] = [];

    for (const file of files) {
      try {
        this.logger.log(`Начинаем обработку файла: ${file.originalname}`);
        
        const filePath = await uploadFunction(file);
        uploadedFiles.push(filePath);
        
        results.push({
          success: true,
          filePath,
          originalName: file.originalname,
        });

        this.logger.log(`Файл успешно обработан: ${file.originalname} -> ${filePath}`);
      } catch (error) {
        this.logger.error(`Ошибка обработки файла ${file.originalname}:`, error.message);
        
        // Graceful fallback - продолжаем обработку других файлов
        results.push({
          success: false,
          error: error.message,
          originalName: file.originalname,
        });

        // Удаляем неполные файлы, если они были созданы
        await this.cleanupPartialUploads(uploadedFiles);
      }
    }

    return results;
  }

  /**
   * Обработка ошибок с откатом всех изменений при критической ошибке
   */
  async handleUploadWithRollback(
    files: Express.Multer.File[],
    uploadFunction: (file: Express.Multer.File) => Promise<string>,
    criticalErrorThreshold: number = 0.5 // 50% файлов должны быть успешно обработаны
  ): Promise<{ success: boolean; results: UploadResult[]; error?: string }> {
    const results: UploadResult[] = [];
    const uploadedFiles: string[] = [];

    try {
      for (const file of files) {
        try {
          this.logger.log(`Обработка файла: ${file.originalname}`);
          
          const filePath = await uploadFunction(file);
          uploadedFiles.push(filePath);
          
          results.push({
            success: true,
            filePath,
            originalName: file.originalname,
          });
        } catch (error) {
          this.logger.error(`Ошибка обработки файла ${file.originalname}:`, error.message);
          
          results.push({
            success: false,
            error: error.message,
            originalName: file.originalname,
          });
        }
      }

      // Проверяем процент успешных загрузок
      const successCount = results.filter(r => r.success).length;
      const successRate = successCount / files.length;

      if (successRate < criticalErrorThreshold) {
        // Критическая ошибка - удаляем все загруженные файлы
        this.logger.warn(`Критическая ошибка: только ${Math.round(successRate * 100)}% файлов обработано успешно`);
        await this.cleanupPartialUploads(uploadedFiles);
        
        return {
          success: false,
          results,
          error: `Критическая ошибка загрузки. Успешно обработано только ${successCount} из ${files.length} файлов.`
        };
      }

      return {
        success: true,
        results,
      };
    } catch (error) {
      // Общая ошибка - удаляем все файлы
      this.logger.error('Общая ошибка при загрузке файлов:', error.message);
      await this.cleanupPartialUploads(uploadedFiles);
      
      return {
        success: false,
        results,
        error: `Общая ошибка загрузки: ${error.message}`
      };
    }
  }

  /**
   * Удаление неполных файлов при ошибках
   */
  async cleanupPartialUploads(filePaths: string[]): Promise<void> {
    if (filePaths.length === 0) {
      return;
    }

    this.logger.log(`Начинаем очистку ${filePaths.length} неполных файлов`);

    const cleanupPromises = filePaths.map(async (filePath) => {
      try {
        await this.imageOptimizationService.deleteImage(filePath);
        this.logger.log(`Удален неполный файл: ${filePath}`);
      } catch (error) {
        this.logger.warn(`Не удалось удалить файл ${filePath}:`, error.message);
      }
    });

    await Promise.allSettled(cleanupPromises);
    this.logger.log('Очистка неполных файлов завершена');
  }

  /**
   * Валидация файла с graceful fallback
   */
  async validateFileWithFallback(file: Express.Multer.File): Promise<{ valid: boolean; error?: string }> {
    try {
      // Проверяем размер файла
      if (file.size === 0) {
        return { valid: false, error: 'Файл пустой' };
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB
        return { valid: false, error: 'Файл слишком большой (максимум 10MB)' };
      }

      // Проверяем MIME тип
      const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedMimeTypes.includes(file.mimetype)) {
        return { valid: false, error: 'Неподдерживаемый тип файла' };
      }

      // Проверяем расширение
      const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
      const extension = file.originalname.split('.').pop()?.toLowerCase();
      if (!extension || !allowedExtensions.includes(extension)) {
        return { valid: false, error: 'Неподдерживаемое расширение файла' };
      }

      return { valid: true };
    } catch (error) {
      this.logger.error(`Ошибка валидации файла ${file.originalname}:`, error.message);
      return { valid: false, error: 'Ошибка валидации файла' };
    }
  }

  /**
   * Обработка ошибок с повторными попытками
   */
  async processWithRetry(
    file: Express.Multer.File,
    processFunction: (file: Express.Multer.File) => Promise<string>,
    maxRetries: number = 3
  ): Promise<UploadResult> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        this.logger.log(`Попытка ${attempt}/${maxRetries} обработки файла: ${file.originalname}`);
        
        const filePath = await processFunction(file);
        
        return {
          success: true,
          filePath,
          originalName: file.originalname,
        };
      } catch (error) {
        lastError = error as Error;
        this.logger.warn(`Попытка ${attempt} не удалась для файла ${file.originalname}:`, error.message);
        
        if (attempt < maxRetries) {
          // Ждем перед следующей попыткой (экспоненциальная задержка)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }

    return {
      success: false,
      error: `Все попытки обработки не удались: ${lastError?.message || 'Неизвестная ошибка'}`,
      originalName: file.originalname,
    };
  }

  /**
   * Получение статистики загрузки
   */
  getUploadStatistics(results: UploadResult[]): {
    total: number;
    successful: number;
    failed: number;
    successRate: number;
    errors: string[];
  } {
    const total = results.length;
    const successful = results.filter(r => r.success).length;
    const failed = total - successful;
    const successRate = total > 0 ? successful / total : 0;
    const errors = results.filter(r => !r.success).map(r => r.error).filter((error): error is string => Boolean(error));

    return {
      total,
      successful,
      failed,
      successRate,
      errors,
    };
  }
}
