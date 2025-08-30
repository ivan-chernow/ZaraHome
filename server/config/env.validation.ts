import * as Joi from 'joi';

// ========================================
// SIMPLIFIED VALIDATION FOR STUDENT PROJECT
// ========================================
export const envValidationSchema = Joi.object({
  // APPLICATION
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  PORT: Joi.number()
    .port()
    .default(3001),

  GLOBAL_PREFIX: Joi.string()
    .allow('')
    .default('api'),

  // DATABASE
  DB_HOST: Joi.string()
    .default('localhost'),

  DB_PORT: Joi.number()
    .port()
    .default(5432),

  DB_USERNAME: Joi.string()
    .default('postgres'),

  DB_PASSWORD: Joi.string()
    .default('postgres'),

  DB_DATABASE: Joi.string()
    .default('zarahome_ecom'),

  DB_SYNCHRONIZE: Joi.boolean()
    .default(true),

  DB_LOGGING: Joi.boolean()
    .default(true),

  // JWT
  JWT_SECRET: Joi.string()
    .default('dev_secret_key_change_in_production_123'),

  JWT_ACCESS_EXPIRES_IN: Joi.string()
    .default('15m'),

  JWT_REFRESH_EXPIRES_IN: Joi.string()
    .default('7d'),

  // EMAIL
  EMAIL_HOST: Joi.string()
    .default('smtp.gmail.com'),

  EMAIL_PORT: Joi.number()
    .port()
    .default(587),

  EMAIL_USER: Joi.string()
    .allow('')
    .default(''),

  EMAIL_PASS: Joi.string()
    .allow('')
    .default(''),

  EMAIL_FROM: Joi.string()
    .default('noreply@zarahome.com'),

  // FILE UPLOAD
  MAX_FILE_SIZE: Joi.number()
    .default(5242880), // 5MB

  UPLOAD_PATH: Joi.string()
    .default('uploads'),

  // CACHE
  CACHE_TTL: Joi.number()
    .default(300),

  CACHE_MAX_KEYS: Joi.number()
    .default(1000),

  // RATE LIMITING
  RATE_LIMIT_TTL: Joi.number()
    .default(60000),

  RATE_LIMIT_MAX: Joi.number()
    .default(100),

  // CORS
  CORS_ORIGIN: Joi.string()
    .default('http://localhost:3000'),

  CORS_CREDENTIALS: Joi.boolean()
    .default(true),
});

export const validationOptions = {
  allowUnknown: true,
  abortEarly: false,
  stripUnknown: true,
};

