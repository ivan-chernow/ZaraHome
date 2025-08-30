import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

const logger = new Logger('Bootstrap');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  // Получаем все необходимые конфигурации за один раз
  const config = {
    app: {
      nodeEnv: configService.get('app.nodeEnv'),
      port: configService.get('app.port'),
      isDevelopment: configService.get('app.isDevelopment'),
    },
    database: {
      host: configService.get('database.host'),
      port: configService.get('database.port'),
      database: configService.get('database.database'),
      synchronize: configService.get('database.synchronize'),
      logging: configService.get('database.logging'),
    },
    jwt: {
      secret: configService.get('jwt.secret'),
      accessExpiresIn: configService.get('jwt.accessExpiresIn'),
    },
    cors: {
      origin: configService.get('cors.origin'),
      credentials: configService.get('cors.credentials'),
    },
  };

  // Валидация критических настроек
  validateCriticalConfig(config);

  // Логирование конфигурации
  logServerConfig(config);

  // Настройка CORS
  app.enableCors(config.cors);

  // Настройка статических файлов
  app.useStaticAssets(join(__dirname, '..', '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Глобальная валидация
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger документация (только для development)
  if (config.app.isDevelopment) {
    setupSwagger(app);
  }

  // Запуск сервера
  await app.listen(config.app.port);
  
  logger.log(`🎉 Server is running on: http://localhost:${config.app.port}`);
  
  if (config.app.isDevelopment) {
    logDevelopmentInfo(config);
  }
}

// Валидация критических настроек
function validateCriticalConfig(config: any) {
  const errors: string[] = [];

  if (!config.jwt.secret || config.jwt.secret.length < 32) {
    errors.push('JWT secret must be at least 32 characters long');
  }

  if (!config.app.port) {
    errors.push('Port is required');
  }

  if (!config.database.host || !config.database.database) {
    errors.push('Database host and database name are required');
  }

  if (errors.length > 0) {
    logger.error('❌ Configuration validation failed:');
    errors.forEach(error => logger.error(`   - ${error}`));
    logger.error('Please check your .env file and required environment variables');
    process.exit(1);
  }

  logger.log('✅ Configuration validation passed');
}

// Логирование конфигурации сервера
function logServerConfig(config: any) {
  logger.log('🚀 Starting ZaraHome ECOM Server');
  logger.log(`🌍 Environment: ${config.app.nodeEnv}`);
  logger.log(`🌐 Port: ${config.app.port}`);
  logger.log(`🗄️ Database: ${config.database.host}:${config.database.port}/${config.database.database}`);
  logger.log(`🔐 JWT Expires In: ${config.jwt.accessExpiresIn}`);
}

// Настройка Swagger
function setupSwagger(app: NestExpressApplication) {
  const config = new DocumentBuilder()
    .setTitle('ZaraHome ECOM API')
    .setDescription('API документация для ZaraHome ECOM')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  
  logger.log('📚 Swagger documentation available at /docs');
}

// Логирование информации для development
function logDevelopmentInfo(config: any) {
  logger.log('🔍 Development mode enabled');
  logger.log(`📊 Database sync: ${config.database.synchronize ? 'ON' : 'OFF'}`);
  logger.log(`📝 Database logging: ${config.database.logging ? 'ON' : 'OFF'}`);
}

bootstrap().catch((error) => {
  logger.error('❌ Failed to start server:', error);
  process.exit(1);
});  
