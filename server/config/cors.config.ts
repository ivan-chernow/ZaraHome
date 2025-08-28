import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from './config.service';

export const getCorsConfig = (configService: ConfigService): CorsOptions => {
  const corsConfig = configService.cors;
  
  return {
    origin: corsConfig.origin,
    credentials: corsConfig.credentials,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'X-API-Key',
    ],
    exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
    maxAge: 86400, // 24 hours
  };
};

