import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { FileUploadErrorHandlerService } from '../services/file-upload-error-handler.service';

@Injectable()
export class UploadErrorMiddleware implements NestMiddleware {
  private readonly logger = new Logger(UploadErrorMiddleware.name);

  constructor(
    private readonly errorHandlerService: FileUploadErrorHandlerService,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    // Сохраняем оригинальный метод send
    const originalSend = res.send;

    // Перехватываем ошибки загрузки
    res.send = function(body) {
      try {
        // Если есть ошибки загрузки в request
        if (req.uploadErrors && Array.isArray(req.uploadErrors)) {
          this.logger.warn(`Upload errors detected: ${req.uploadErrors.length} errors`);
          
          // Логируем ошибки
          req.uploadErrors.forEach((error: any) => {
            this.logger.error(`Upload error: ${error.message}`, error.stack);
          });

          // Если есть неполные файлы, удаляем их
          if (req.uploadedFiles && Array.isArray(req.uploadedFiles)) {
            this.errorHandlerService.cleanupPartialUploads(req.uploadedFiles);
          }
        }

        // Вызываем оригинальный send
        return originalSend.call(this, body);
      } catch (error) {
        this.logger.error('Error in upload error middleware:', error);
        return originalSend.call(this, body);
      }
    }.bind(this);

    next();
  }
}

