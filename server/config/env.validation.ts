import * as Joi from 'joi';

// ========================================
// ENVIRONMENT VALIDATION SCHEMA
// ========================================
export const envValidationSchema = Joi.object({
  // ========================================
  // APPLICATION
  // ========================================
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development')
    .description('Node environment'),

  PORT: Joi.number()
    .port()
    .default(3000)
    .description('Application port'),

  API_PREFIX: Joi.string()
    .default('api')
    .description('API prefix'),

  GLOBAL_PREFIX: Joi.string()
    .default('api')
    .description('Global API prefix'),

  // ========================================
  // DATABASE
  // ========================================
  DB_HOST: Joi.string()
    .hostname()
    .default('localhost')
    .description('Database host'),

  DB_PORT: Joi.number()
    .port()
    .default(5432)
    .description('Database port'),

  DB_USERNAME: Joi.string()
    .required()
    .description('Database username'),

  DB_PASSWORD: Joi.string()
    .required()
    .description('Database password'),

  DB_DATABASE: Joi.string()
    .required()
    .description('Database name'),

  DB_SYNCHRONIZE: Joi.boolean()
    .default(false)
    .description('Database synchronization (only for development)'),

  DB_LOGGING: Joi.boolean()
    .default(false)
    .description('Database logging'),

  DB_MIGRATIONS_RUN: Joi.boolean()
    .default(false)
    .description('Run database migrations'),

  // ========================================
  // JWT AUTHENTICATION
  // ========================================
  JWT_SECRET: Joi.string()
    .min(32)
    .required()
    .description('JWT secret key (min 32 characters)'),

  JWT_ACCESS_EXPIRES_IN: Joi.string()
    .default('15m')
    .description('JWT access token expiration'),

  JWT_REFRESH_EXPIRES_IN: Joi.string()
    .default('7d')
    .description('JWT refresh token expiration'),

  // ========================================
  // ADMIN USER
  // ========================================
  ADMIN_EMAIL: Joi.string()
    .email()
    .default('admin@zarahome.com')
    .description('Admin email'),

  ADMIN_PASSWORD: Joi.string()
    .min(8)
    .default('admin123')
    .description('Admin password (min 8 characters)'),

  // ========================================
  // EMAIL SERVICE
  // ========================================
  EMAIL_HOST: Joi.string()
    .default('smtp.gmail.com')
    .description('SMTP host'),

  EMAIL_PORT: Joi.number()
    .port()
    .default(587)
    .description('SMTP port'),

  EMAIL_USER: Joi.string()
    .email()
    .allow('')
    .default('')
    .description('SMTP user email'),

  EMAIL_PASS: Joi.string()
    .allow('')
    .default('')
    .description('SMTP password'),

  EMAIL_FROM: Joi.string()
    .email()
    .default('noreply@zarahome.com')
    .description('From email address'),

  // ========================================
  // FILE UPLOAD
  // ========================================
  MAX_FILE_SIZE: Joi.number()
    .min(1024 * 1024) // 1MB
    .max(50 * 1024 * 1024) // 50MB
    .default(10 * 1024 * 1024) // 10MB
    .description('Maximum file size in bytes'),

  ALLOWED_FILE_TYPES: Joi.string()
    .default('image/jpeg,image/png,image/webp')
    .description('Comma-separated allowed file types'),

  UPLOAD_PATH: Joi.string()
    .default('./uploads')
    .description('File upload path'),

  // ========================================
  // CACHE
  // ========================================
  CACHE_TTL_DEFAULT: Joi.number()
    .min(60) // 1 minute
    .max(86400) // 24 hours
    .default(3600) // 1 hour
    .description('Default cache TTL in seconds'),

  CACHE_MAX_KEYS: Joi.number()
    .min(100)
    .max(100000)
    .default(10000)
    .description('Maximum cache keys'),

  // ========================================
  // RATE LIMITING
  // ========================================
  RATE_LIMIT_TTL: Joi.number()
    .min(1000) // 1 second
    .max(300000) // 5 minutes
    .default(60000) // 1 minute
    .description('Rate limit TTL in milliseconds'),

  RATE_LIMIT_MAX_REQUESTS: Joi.number()
    .min(10)
    .max(1000)
    .default(120)
    .description('Maximum requests per TTL'),

  // ========================================
  // CORS
  // ========================================
  CORS_ORIGIN: Joi.string()
    .default('http://localhost:3001')
    .description('CORS allowed origins (comma-separated)'),

  CORS_CREDENTIALS: Joi.boolean()
    .default(true)
    .description('CORS credentials'),

  // ========================================
  // LOGGING
  // ========================================
  LOG_LEVEL: Joi.string()
    .valid('error', 'warn', 'info', 'debug')
    .default('debug')
    .description('Log level'),

  LOG_FILE_PATH: Joi.string()
    .default('./logs')
    .description('Log file path'),

  LOG_MAX_SIZE: Joi.string()
    .default('20m')
    .description('Log file max size'),

  LOG_MAX_FILES: Joi.string()
    .default('14d')
    .description('Log file retention'),

  // ========================================
  // SECURITY
  // ========================================
  BCRYPT_ROUNDS: Joi.number()
    .min(8)
    .max(16)
    .default(10)
    .description('BCrypt rounds'),

  SESSION_SECRET: Joi.string()
    .min(32)
    .default('fallback_session_secret_change_in_production')
    .description('Session secret (min 32 characters)'),
});

// ========================================
// VALIDATION OPTIONS
// ========================================
export const validationOptions = {
  allowUnknown: true, // Разрешаем неизвестные переменные
  abortEarly: false, // Показываем все ошибки сразу
  stripUnknown: true, // Убираем неизвестные переменные
};

