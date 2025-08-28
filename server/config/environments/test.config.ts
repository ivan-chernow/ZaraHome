import { registerAs } from '@nestjs/config';

export const testConfig = registerAs('test', () => ({
  // ========================================
  // TEST SPECIFIC CONFIGURATION
  // ========================================
  
  // Database
  database: {
    synchronize: true,
    logging: false,
    migrationsRun: false,
    database: 'zarahome_ecom_test', // Отдельная тестовая БД
  },

  // Logging
  logging: {
    level: 'error', // Только ошибки в тестах
    enableFileLogging: false,
  },

  // Security
  security: {
    bcryptRounds: 4, // Минимум раундов для быстрых тестов
    enableRateLimit: false,
  },

  // CORS
  cors: {
    origin: ['http://localhost:3001'],
    credentials: true,
  },

  // File Upload
  fileUpload: {
    maxFileSize: 1 * 1024 * 1024, // 1MB для тестов
    enableImageOptimization: false,
    uploadPath: './uploads/test',
  },

  // Cache
  cache: {
    ttlDefault: 60, // 1 минута для тестов
    maxKeys: 100,
  },

  // Rate Limiting
  rateLimit: {
    ttl: 1000, // 1 секунда для тестов
    maxRequests: 1000,
  },

  // Test specific
  test: {
    timeout: 10000, // 10 секунд таймаут для тестов
    enableMocking: true,
    cleanupAfterEach: true,
  },
}));

