import * as Joi from 'joi';


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
    .default('zarahome'),

  DB_SYNCHRONIZE: Joi.boolean()
    .default(true),

  DB_LOGGING: Joi.boolean()
    .default(true),

  // JWT
  JWT_SECRET: Joi.string()
    .default('jasdjasoij123128989fxcvmlkviodfgjjpodfgjopjfdogjdpof'),

  JWT_ACCESS_EXPIRES_IN: Joi.string()
    .default('15m'),

  JWT_REFRESH_EXPIRES_IN: Joi.string()
    .default('7d'),

  // EMAIL

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

  // ADMIN
  ADMIN_EMAIL: Joi.string()
    .email()
    .optional(),
  ADMIN_PASSWORD: Joi.string()
    .min(8)
    .optional(),

  // EMAIL / RESEND (для отправки писем через Resend)
  RESEND_API_KEY: Joi.string()
    .allow('')
    .optional(),
  MAIL_FROM: Joi.string()
    .email()
    .optional(),
  EMAIL_REDIRECT_TO: Joi.string()
    .email()
    .optional(),
});

export const validationOptions = {
  allowUnknown: true,
  abortEarly: false,
  stripUnknown: true,
};

