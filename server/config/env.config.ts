import { registerAs } from '@nestjs/config';

// ========================================
// APPLICATION CONFIG
// ========================================
export interface AppConfig {
  nodeEnv: string;
  port: number;
  apiPrefix: string;
  globalPrefix: string;
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
}

export const appConfig = registerAs('app', (): AppConfig => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  apiPrefix: process.env.API_PREFIX || 'api',
  globalPrefix: process.env.GLOBAL_PREFIX || 'api',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
}));

// ========================================
// DATABASE CONFIG
// ========================================
export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
  logging: boolean;
  migrationsRun: boolean;
  entities: string[];
  migrations: string[];
}

export const databaseConfig = registerAs('database', (): DatabaseConfig => ({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'zarahome_ecom',
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  logging: process.env.DB_LOGGING === 'true',
  migrationsRun: process.env.DB_MIGRATIONS_RUN === 'true',
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/database/migrations/*{.ts,.js}'],
}));

// ========================================
// JWT CONFIG
// ========================================
export interface JwtConfig {
  secret: string;
  accessExpiresIn: string;
  refreshExpiresIn: string;
}

export const jwtConfig = registerAs('jwt', (): JwtConfig => ({
  secret: process.env.JWT_SECRET || 'fallback_secret_key_change_in_production',
  accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
}));

// ========================================
// ADMIN CONFIG
// ========================================
export interface AdminConfig {
  email: string;
  password: string;
}

export const adminConfig = registerAs('admin', (): AdminConfig => ({
  email: process.env.ADMIN_EMAIL || 'admin@zarahome.com',
  password: process.env.ADMIN_PASSWORD || 'admin123',
}));

// ========================================
// EMAIL CONFIG
// ========================================
export interface EmailConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
  secure: boolean;
}

export const emailConfig = registerAs('email', (): EmailConfig => ({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587', 10),
  user: process.env.EMAIL_USER || '',
  pass: process.env.EMAIL_PASS || '',
  from: process.env.EMAIL_FROM || 'noreply@zarahome.com',
  secure: process.env.EMAIL_PORT === '465',
}));

// ========================================
// FILE UPLOAD CONFIG
// ========================================
export interface FileUploadConfig {
  maxFileSize: number;
  allowedFileTypes: string[];
  uploadPath: string;
}

export const fileUploadConfig = registerAs('fileUpload', (): FileUploadConfig => ({
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10), // 10MB
  allowedFileTypes: (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/webp').split(','),
  uploadPath: process.env.UPLOAD_PATH || './uploads',
}));

// ========================================
// CACHE CONFIG
// ========================================
export interface CacheConfig {
  ttlDefault: number;
  maxKeys: number;
}

export const cacheConfig = registerAs('cache', (): CacheConfig => ({
  ttlDefault: parseInt(process.env.CACHE_TTL_DEFAULT || '3600', 10),
  maxKeys: parseInt(process.env.CACHE_MAX_KEYS || '10000', 10),
}));

// ========================================
// RATE LIMITING CONFIG
// ========================================
export interface RateLimitConfig {
  ttl: number;
  maxRequests: number;
}

export const rateLimitConfig = registerAs('rateLimit', (): RateLimitConfig => ({
  ttl: parseInt(process.env.RATE_LIMIT_TTL || '60000', 10),
  maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '120', 10),
}));

// ========================================
// CORS CONFIG
// ========================================
export interface CorsConfig {
  origin: string | string[];
  credentials: boolean;
}

export const corsConfig = registerAs('cors', (): CorsConfig => ({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:3001'],
  credentials: process.env.CORS_CREDENTIALS === 'true',
}));

// ========================================
// LOGGING CONFIG
// ========================================
export interface LoggingConfig {
  level: string;
  filePath: string;
  maxSize: string;
  maxFiles: string;
}

export const loggingConfig = registerAs('logging', (): LoggingConfig => ({
  level: process.env.LOG_LEVEL || 'debug',
  filePath: process.env.LOG_FILE_PATH || './logs',
  maxSize: process.env.LOG_MAX_SIZE || '20m',
  maxFiles: process.env.LOG_MAX_FILES || '14d',
}));

// ========================================
// SECURITY CONFIG
// ========================================
export interface SecurityConfig {
  bcryptRounds: number;
  sessionSecret: string;
}

export const securityConfig = registerAs('security', (): SecurityConfig => ({
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '10', 10),
  sessionSecret: process.env.SESSION_SECRET || 'fallback_session_secret_change_in_production',
}));

