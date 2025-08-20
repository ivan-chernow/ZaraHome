import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
    NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
    PORT: Joi.number().port().default(3001),

    // Database
    DB_HOST: Joi.string().default('localhost'),
    DB_PORT: Joi.number().default(5432),
    DB_USERNAME: Joi.string().default('postgres'),
    DB_PASSWORD: Joi.string().allow('').default('postgres'),
    DB_DATABASE: Joi.string().default('zarahome'),

    // Security
    JWT_SECRET: Joi.string().min(24).required(),

    // Mail / Resend
    RESEND_API_KEY: Joi.string().required(),
    MAIL_FROM: Joi.string().email().default('onboarding@resend.dev'),

    // Admin bootstrap (optional)
    ADMIN_EMAIL: Joi.string().email().optional(),
    ADMIN_PASSWORD: Joi.string().min(12).optional(),

    // CORS
    CORS_ORIGINS: Joi.string().allow('').default('http://localhost:3000'),
});


