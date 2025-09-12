import { registerAs, ConfigService } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV,
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : undefined,
  globalPrefix: process.env.GLOBAL_PREFIX,
  isDevelopment: process.env.NODE_ENV === 'development',
}));

export const databaseConfig = registerAs('database', () => ({
  type: 'postgres' as const,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  logging: process.env.DB_LOGGING === 'true',
  entities: ['dist/**/*.entity{.ts,.js}'],
}));

export const jwtConfig = registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
}));

export const emailConfig = registerAs('email', () => ({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT
    ? parseInt(process.env.EMAIL_PORT, 10)
    : undefined,
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS,
  from: process.env.EMAIL_FROM,
  secure: process.env.EMAIL_SECURE === 'true',
}));

export const fileUploadConfig = registerAs('fileUpload', () => ({
  maxFileSize: process.env.MAX_FILE_SIZE
    ? parseInt(process.env.MAX_FILE_SIZE, 10)
    : undefined,
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  uploadPath: process.env.UPLOAD_PATH,
}));

export const cacheConfig = registerAs('cache', () => ({
  ttl: process.env.CACHE_TTL ? parseInt(process.env.CACHE_TTL, 10) : undefined,
  maxKeys: process.env.CACHE_MAX_KEYS
    ? parseInt(process.env.CACHE_MAX_KEYS, 10)
    : undefined,
}));

export const rateLimitConfig = registerAs('rateLimit', () => ({
  ttl: process.env.RATE_LIMIT_TTL
    ? parseInt(process.env.RATE_LIMIT_TTL, 10)
    : undefined,
  maxRequests: process.env.RATE_LIMIT_MAX
    ? parseInt(process.env.RATE_LIMIT_MAX, 10)
    : undefined,
}));

export const corsConfig = registerAs('cors', () => ({
  origin: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',')
    : ['http://localhost:3000'],
  credentials: process.env.CORS_CREDENTIALS === 'true',
}));

// Функции-помощники для создания конфигурации модулей
export const getDatabaseConfig = (configService: ConfigService) => ({
  type: 'postgres' as const,
  host: configService.get('database.host'),
  port: configService.get('database.port'),
  username: configService.get('database.username'),
  password: configService.get('database.password'),
  database: configService.get('database.database'),
  synchronize: configService.get('database.synchronize'),
  logging: configService.get('database.logging'),
  entities: configService.get('database.entities'),
});

export const getJwtConfig = (configService: ConfigService) => ({
  secret: configService.get('jwt.secret'),
  signOptions: {
    expiresIn: configService.get('jwt.accessExpiresIn'),
  },
});

export const getRateLimitConfig = (configService: ConfigService) => ({
  throttlers: [
    {
      ttl: configService.get('rateLimit.ttl'),
      limit: configService.get('rateLimit.maxRequests'),
    },
  ],
});
