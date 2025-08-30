import { registerAs } from '@nestjs/config';

// ========================================
// SIMPLIFIED CONFIG FOR STUDENT PROJECT
// ========================================

export const appConfig = registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3001', 10),
  globalPrefix: process.env.GLOBAL_PREFIX || 'api',
  isDevelopment: process.env.NODE_ENV === 'development',
}));

export const databaseConfig = registerAs('database', () => ({
  type: 'postgres' as const,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'zarahome_ecom',
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  logging: process.env.DB_LOGGING === 'true',
  entities: ['dist/**/*.entity{.ts,.js}'],
}));

export const jwtConfig = registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'dev_secret_key_change_in_production_123',
  accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
}));

export const emailConfig = registerAs('email', () => ({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587', 10),
  user: process.env.EMAIL_USER || '',
  pass: process.env.EMAIL_PASS || '',
  from: process.env.EMAIL_FROM || 'noreply@zarahome.com',
  secure: process.env.EMAIL_SECURE === 'true',
}));

export const fileUploadConfig = registerAs('fileUpload', () => ({
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10), // 5MB
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  uploadPath: process.env.UPLOAD_PATH || 'uploads',
}));

export const cacheConfig = registerAs('cache', () => ({
  ttl: parseInt(process.env.CACHE_TTL || '300', 10), // 5 минут
  maxKeys: parseInt(process.env.CACHE_MAX_KEYS || '1000', 10),
}));

export const rateLimitConfig = registerAs('rateLimit', () => ({
  ttl: parseInt(process.env.RATE_LIMIT_TTL || '60000', 10), // 1 минута
  maxRequests: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
}));

export const corsConfig = registerAs('cors', () => ({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:3000'],
  credentials: process.env.CORS_CREDENTIALS === 'true',
}));

