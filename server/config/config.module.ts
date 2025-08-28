import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { envValidationSchema, validationOptions } from './env.validation';
import { appConfig } from './env.config';
import { databaseConfig } from './env.config';
import { jwtConfig } from './env.config';
import { adminConfig } from './env.config';
import { emailConfig } from './env.config';
import { fileUploadConfig } from './env.config';
import { cacheConfig } from './env.config';
import { rateLimitConfig } from './env.config';
import { corsConfig } from './env.config';
import { loggingConfig } from './env.config';
import { securityConfig } from './env.config';
import { developmentConfig } from './environments/development.config';
import { productionConfig } from './environments/production.config';
import { testConfig } from './environments/test.config';
import { ConfigService } from './config.service';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        // Local overrides for specific environments (highest priority)
        '.env.development.local',
        '.env.production.local',
        '.env.test.local',
        // Fallback local overrides
        '.env.local',
        // Environment defaults
        '.env.development',
        '.env.production',
        '.env.test',
        // Base defaults (lowest priority)
        '.env',
      ],
      validationSchema: envValidationSchema,
      validationOptions,
      load: [
        appConfig,
        databaseConfig,
        jwtConfig,
        adminConfig,
        emailConfig,
        fileUploadConfig,
        cacheConfig,
        rateLimitConfig,
        corsConfig,
        loggingConfig,
        securityConfig,
        developmentConfig,
        productionConfig,
        testConfig,
      ],
      cache: true,
      expandVariables: true,
    }),
  ],
  providers: [ConfigService],
  exports: [NestConfigModule, ConfigService],
})
export class ConfigModule {}
