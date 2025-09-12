import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SHARED_CONSTANTS } from '../shared.constants';

export interface RateLimitOptions {
  windowMs: number;
  maxRequests: number;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  keyGenerator?: (context: ExecutionContext) => string;
  handler?: (context: ExecutionContext) => void;
}

@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly requestCounts = new Map<
    string,
    { count: number; resetTime: number }
  >();

  constructor(private readonly _reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const options = this.getRateLimitOptions(context);
    if (!options) {
      return true; // Нет ограничений
    }

    const key = this.generateKey(context, options);
    const now = Date.now();

    // Получаем текущие данные о запросах
    let requestData = this.requestCounts.get(key);

    // Если окно времени истекло, сбрасываем счетчик
    if (!requestData || now > requestData.resetTime) {
      requestData = {
        count: 0,
        resetTime: now + options.windowMs,
      };
    }

    // Проверяем лимит
    if (requestData.count >= options.maxRequests) {
      const resetTime = new Date(requestData.resetTime);
      const retryAfter = Math.ceil((requestData.resetTime - now) / 1000);

      throw new HttpException(
        {
          message: 'Превышен лимит запросов',
          error: 'Too Many Requests',
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          retryAfter,
          resetTime: resetTime.toISOString(),
        },
        HttpStatus.TOO_MANY_REQUESTS
      );
    }

    // Увеличиваем счетчик
    requestData.count++;
    this.requestCounts.set(key, requestData);

    return true;
  }

  private getRateLimitOptions(
    context: ExecutionContext
  ): RateLimitOptions | null {
    // Получаем опции из декоратора или используем значения по умолчанию
    const options = this._reflector.get<RateLimitOptions>(
      'rateLimit',
      context.getHandler()
    );

    if (!options) {
      return null;
    }

    return {
      windowMs: options.windowMs || SHARED_CONSTANTS.SECURITY.RATE_LIMIT_WINDOW,
      maxRequests:
        options.maxRequests ||
        SHARED_CONSTANTS.SECURITY.RATE_LIMIT_MAX_REQUESTS,
      skipSuccessfulRequests: options.skipSuccessfulRequests || false,
      skipFailedRequests: options.skipFailedRequests || false,
      keyGenerator: options.keyGenerator,
      handler: options.handler,
    };
  }

  private generateKey(
    context: ExecutionContext,
    options: RateLimitOptions
  ): string {
    if (options.keyGenerator) {
      return options.keyGenerator(context);
    }

    const request = context.switchToHttp().getRequest();
    const ip = this.getClientIp(request);
    const route = request.route?.path || 'unknown';
    const method = request.method;

    return `${ip}:${method}:${route}`;
  }

  private getClientIp(request: {
    ip?: string;
    connection?: {
      remoteAddress?: string;
      socket?: { remoteAddress?: string };
    };
    socket?: { remoteAddress?: string };
  }): string {
    // Получаем IP адрес клиента
    return (
      request.ip ||
      request.connection?.remoteAddress ||
      request.socket?.remoteAddress ||
      request.connection?.socket?.remoteAddress ||
      'unknown'
    );
  }

  // Методы для управления rate limiting
  getRequestCount(key: string): number {
    const data = this.requestCounts.get(key);
    return data ? data.count : 0;
  }

  getResetTime(key: string): number | null {
    const data = this.requestCounts.get(key);
    return data ? data.resetTime : null;
  }

  resetRequestCount(key: string): void {
    this.requestCounts.delete(key);
  }

  clearAllCounts(): void {
    this.requestCounts.clear();
  }

  getStats(): Record<string, unknown> {
    const now = Date.now();
    const activeKeys = Array.from(this.requestCounts.entries())
      .filter(([_, data]) => now <= data.resetTime)
      .map(([key, data]) => ({
        key,
        count: data.count,
        resetTime: new Date(data.resetTime).toISOString(),
        remaining: Math.max(
          0,
          SHARED_CONSTANTS.SECURITY.RATE_LIMIT_MAX_REQUESTS - data.count
        ),
      }));

    return {
      totalKeys: this.requestCounts.size,
      activeKeys: activeKeys.length,
      activeRequests: activeKeys.reduce((sum, item) => sum + item.count, 0),
      details: activeKeys,
    };
  }
}

// Декоратор для настройки rate limiting
export const RateLimit = (options: RateLimitOptions) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata('rateLimit', options, descriptor.value);
    return descriptor;
  };
};

// Предустановленные конфигурации
export const RateLimitConfigs = {
  // Строгий лимит для аутентификации
  STRICT: {
    windowMs: 15 * 60 * 1000, // 15 минут
    maxRequests: 5,
  },

  // Умеренный лимит для API
  MODERATE: {
    windowMs: 60 * 1000, // 1 минута
    maxRequests: 30,
  },

  // Либеральный лимит для публичных эндпоинтов
  LIBERAL: {
    windowMs: 60 * 1000, // 1 минута
    maxRequests: 100,
  },

  // Лимит для загрузки файлов
  UPLOAD: {
    windowMs: 60 * 1000, // 1 минута
    maxRequests: 10,
  },

  // Лимит для поиска
  SEARCH: {
    windowMs: 60 * 1000, // 1 минута
    maxRequests: 50,
  },
};
