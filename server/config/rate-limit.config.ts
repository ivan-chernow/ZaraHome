import { ThrottlerModuleOptions } from '@nestjs/throttler';
import { ConfigService } from './config.service';

export const getRateLimitConfig = (configService: ConfigService): ThrottlerModuleOptions => {
  const rateLimitConfig = configService.rateLimit;
  
  return [
    {
      ttl: rateLimitConfig.ttl,
      limit: rateLimitConfig.maxRequests,
    },
    // Дополнительные правила для разных эндпоинтов
    {
      name: 'auth',
      ttl: 60000, // 1 минута
      limit: 5, // 5 попыток входа в минуту
    },
    {
      name: 'upload',
      ttl: 60000, // 1 минута
      limit: 10, // 10 загрузок в минуту
    },
    {
      name: 'api',
      ttl: 60000, // 1 минута
      limit: 100, // 100 API запросов в минуту
    },
  ];
};

