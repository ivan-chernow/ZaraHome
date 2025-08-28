import { registerAs } from '@nestjs/config';

export const productionConfig = registerAs('production', () => ({
  // ========================================
  // PRODUCTION SPECIFIC CONFIGURATION
  // ========================================
  
  // Database
  database: {
    synchronize: false, // Никогда не включать в продакшене!
    logging: false,
    migrationsRun: true,
  },

  // Logging
  logging: {
    level: 'info',
    enableFileLogging: true,
  },

  // Security
  security: {
    bcryptRounds: 12, // Больше раундов для безопасности
    enableRateLimit: true,
  },

  // CORS
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['https://zarahome.com'],
    credentials: true,
  },

  // File Upload
  fileUpload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB для продакшена
    enableImageOptimization: true,
  },

  // Cache
  cache: {
    ttlDefault: 3600, // 1 час для продакшена
    maxKeys: 10000,
  },

  // Rate Limiting
  rateLimit: {
    ttl: 60000, // 1 минута
    maxRequests: 100, // Меньше запросов для безопасности
  },

  // Performance
  performance: {
    enableCompression: true,
    enableHelmet: true,
    enableCaching: true,
  },
}));

