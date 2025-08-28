import { registerAs } from '@nestjs/config';

export const developmentConfig = registerAs('development', () => ({
  // ========================================
  // DEVELOPMENT SPECIFIC CONFIGURATION
  // ========================================
  
  // Database
  database: {
    synchronize: true,
    logging: true,
    migrationsRun: false,
  },

  // Logging
  logging: {
    level: 'debug',
    enableFileLogging: false,
  },

  // Security
  security: {
    bcryptRounds: 8, // Меньше раундов для быстрой разработки
    enableRateLimit: false, // Отключаем rate limiting для разработки
  },

  // CORS
  cors: {
    origin: ['http://localhost:3001', 'http://localhost:3000'],
    credentials: true,
  },

  // File Upload
  fileUpload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB для разработки
    enableImageOptimization: false, // Отключаем для быстрой разработки
  },

  // Cache
  cache: {
    ttlDefault: 300, // 5 минут для разработки
    maxKeys: 1000,
  },

  // Rate Limiting
  rateLimit: {
    ttl: 60000, // 1 минута
    maxRequests: 1000, // Больше запросов для разработки
  },
}));

