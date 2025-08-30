import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '../config/config.service';
import { getCorsConfig } from '../config/cors.config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Получаем сервис конфигурации
  const configService = app.get(ConfigService);

  // Проверяем обязательные переменные
  try {
    // Проверяем обязательные ключи конфигурации (namespaced ключи из registerAs)
    configService.validateRequired([
      'jwt.secret',
      'database.username',
      'database.password',
      'database.database',
    ]);

    // Дополнительная защита: длина JWT секретного ключа
    const jwtSecret = configService.jwt.secret;
    if (!jwtSecret || jwtSecret.length < 32) {
      throw new Error('JWT secret must be at least 32 characters long');
    }

    // Защита для production: запрет dev-настроек
    if (configService.isProduction) {
      if (configService.database.synchronize) {
        throw new Error('Database synchronize must be disabled in production');
      }
      if (configService.nodeEnv !== 'production') {
        throw new Error('NODE_ENV must be "production" for production builds');
      }
    }
    console.log('✅ Configuration validation passed');
  } catch (error) {
    console.error('❌ Configuration validation failed:', error.message);
    console.error('Please check your .env file and required environment variables');
    process.exit(1);
  }

  // Логируем конфигурацию
  console.log(`🚀 Starting ZaraHome ECOM Server`);
  console.log(`🌍 Environment: ${configService.nodeEnv}`);
  console.log(`🌐 Port: ${configService.port}`);
  console.log(`🗄️ Database: ${configService.database.host}:${configService.database.port}/${configService.database.database}`);
  console.log(`🔐 JWT Expires In: ${configService.jwt.accessExpiresIn}`);

  // Настройка CORS
  const corsConfig = getCorsConfig(configService);
  app.enableCors(corsConfig);

  // Настройка статических файлов для раздачи изображений
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
  if (configService.isDevelopment) {
    const config = new DocumentBuilder()
      .setTitle('ZaraHome ECOM API')
      .setDescription('API документация для ZaraHome ECOM')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    
    const document = SwaggerModule.createDocument(app, config);
    // Страница документации будет по /api/docs (один раз префикс)
    SwaggerModule.setup('docs', app, document);

    console.log('📚 Swagger documentation available at /docs');
  }

  // Запуск сервера
  await app.listen(configService.port);
  
  console.log(`🎉 Server is running on: http://localhost:${configService.port}`);
  
  if (configService.isDevelopment) {
    console.log(`🔍 Development mode enabled`);
    console.log(`📊 Database sync: ${configService.database.synchronize ? 'ON' : 'OFF'}`);
    console.log(`📝 Database logging: ${configService.database.logging ? 'ON' : 'OFF'}`);
  }
}

bootstrap().catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});  
