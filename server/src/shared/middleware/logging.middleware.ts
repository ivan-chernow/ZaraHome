import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { SHARED_CONSTANTS } from '../shared.constants';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggingMiddleware.name);

  use(req: Request, res: Response, next: NextFunction): void {
    if (!SHARED_CONSTANTS.LOGGING.ENABLE_REQUEST_LOGGING) {
      return next();
    }

    const startTime = Date.now();
    const { method, originalUrl, ip, headers } = req;
    const userAgent = headers['user-agent'] || 'unknown';
    const requestId = this.generateRequestId();

    // Добавляем requestId к запросу для отслеживания
    (req as any).requestId = requestId;

    // Логируем входящий запрос
    this.logger.log(
      `[${requestId}] ${method} ${originalUrl} - IP: ${ip} - User-Agent: ${userAgent}`
    );

    // Перехватываем ответ
    const originalSend = res.send;
    res.send = function(body: any) {
      const responseTime = Date.now() - startTime;
      const statusCode = res.statusCode;
      
      // Логируем исходящий ответ
      const logLevel = statusCode >= 400 ? 'error' : 'log';
      const message = `[${requestId}] ${method} ${originalUrl} - ${statusCode} - ${responseTime}ms`;
      
      if (logLevel === 'error') {
        Logger.error(message);
      } else {
        Logger.log(message);
      }

      // Вызываем оригинальный метод send
      return originalSend.call(this, body);
    };

    // Логируем ошибки
    res.on('error', (error) => {
      const responseTime = Date.now() - startTime;
      this.logger.error(
        `[${requestId}] ${method} ${originalUrl} - Error: ${error.message} - ${responseTime}ms`
      );
    });

    next();
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Middleware для логирования производительности
@Injectable()
export class PerformanceLoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger(PerformanceLoggingMiddleware.name);

  use(req: Request, res: Response, next: NextFunction): void {
    if (!SHARED_CONSTANTS.LOGGING.ENABLE_PERFORMANCE_LOGGING) {
      return next();
    }

    const startTime = process.hrtime.bigint();
    const { method, originalUrl } = req;
    const requestId = (req as any).requestId || 'unknown';

    // Перехватываем ответ для измерения производительности
    const originalSend = res.send;
    res.send = function(body: any) {
      const endTime = process.hrtime.bigint();
      const duration = Number(endTime - startTime) / 1000000; // в миллисекундах
      
      // Логируем медленные запросы
      if (duration > 1000) { // больше 1 секунды
        Logger.warn(
          `[${requestId}] SLOW REQUEST: ${method} ${originalUrl} - ${duration.toFixed(2)}ms`
        );
      }
      
      // Логируем очень медленные запросы
      if (duration > 5000) { // больше 5 секунд
        Logger.error(
          `[${requestId}] VERY SLOW REQUEST: ${method} ${originalUrl} - ${duration.toFixed(2)}ms`
        );
      }

      return originalSend.call(this, body);
    };

    next();
  }
}

// Middleware для логирования тела запроса (только для отладки)
@Injectable()
export class RequestBodyLoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RequestBodyLoggingMiddleware.name);

  use(req: Request, res: Response, next: NextFunction): void {
    // Включаем только в development режиме
    if (process.env.NODE_ENV !== 'development') {
      return next();
    }

    const { method, originalUrl, body, query, params } = req;
    const requestId = (req as any).requestId || 'unknown';

    // Логируем параметры запроса
    if (Object.keys(query).length > 0) {
      this.logger.debug(`[${requestId}] Query params: ${JSON.stringify(query)}`);
    }

    if (Object.keys(params).length > 0) {
      this.logger.debug(`[${requestId}] Route params: ${JSON.stringify(params)}`);
    }

    // Логируем тело запроса (только для POST/PUT/PATCH)
    if (['POST', 'PUT', 'PATCH'].includes(method) && body && Object.keys(body).length > 0) {
      // Маскируем чувствительные данные
      const maskedBody = this.maskSensitiveData(body);
      this.logger.debug(`[${requestId}] Request body: ${JSON.stringify(maskedBody)}`);
    }

    next();
  }

  private maskSensitiveData(data: any): any {
    if (typeof data !== 'object' || data === null) {
      return data;
    }

    const sensitiveFields = ['password', 'token', 'secret', 'key', 'authorization'];
    const maskedData = { ...data };

    for (const field of sensitiveFields) {
      if (maskedData[field]) {
        maskedData[field] = '***MASKED***';
      }
    }

    return maskedData;
  }
}

// Middleware для логирования заголовков (только для отладки)
@Injectable()
export class HeadersLoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger(HeadersLoggingMiddleware.name);

  use(req: Request, res: Response, next: NextFunction): void {
    // Включаем только в development режиме
    if (process.env.NODE_ENV !== 'development') {
      return next();
    }

    const { method, originalUrl, headers } = req;
    const requestId = (req as any).requestId || 'unknown';

    // Логируем важные заголовки
    const importantHeaders = {
      'content-type': headers['content-type'],
      'authorization': headers['authorization'] ? '***MASKED***' : undefined,
      'user-agent': headers['user-agent'],
      'accept': headers['accept'],
      'content-length': headers['content-length']
    };

    // Убираем undefined значения
    const filteredHeaders = Object.fromEntries(
      Object.entries(importantHeaders).filter(([_, value]) => value !== undefined)
    );

    if (Object.keys(filteredHeaders).length > 0) {
      this.logger.debug(`[${requestId}] Headers: ${JSON.stringify(filteredHeaders)}`);
    }

    next();
  }
}
