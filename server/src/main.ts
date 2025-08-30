import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Получаем сервис конфигурации
  const configService = app.get(ConfigService);

  // Проверяем обязательные переменные
  try {
    // Дополнительная защита: длина JWT секретного ключа
    const jwtSecret = configService.get('jwt.secret');
    if (!jwtSecret || jwtSecret.length < 32) {
      throw new Error('JWT secret must be at least 32 characters long');
    }
    console.log('✅ Configuration validation passed');
  } catch (error) {
    console.error('❌ Configuration validation failed:', error.message);
    console.error('Please check your .env file and required environment variables');
    process.exit(1);
  }

  // Логируем конфигурацию
  console.log(`🚀 Starting ZaraHome ECOM Server`);
  console.log(`🌍 Environment: ${configService.get('app.nodeEnv')}`);
  console.log(`🌐 Port: ${configService.get('app.port')}`);
  console.log(`🗄️ Database: ${configService.get('database.host')}:${configService.get('database.port')}/${configService.get('database.database')}`);
  console.log(`🔐 JWT Expires In: ${configService.get('jwt.accessExpiresIn')}`);

  // Настройка CORS
  app.enableCors({
    origin: configService.get('cors.origin'),
    credentials: configService.get('cors.credentials'),
  });

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
  if (configService.get('app.isDevelopment')) {
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
  const port = configService.get('app.port');
  await app.listen(port);
  
  console.log(`🎉 Server is running on: http://localhost:${port}`);
  
  if (configService.get('app.isDevelopment')) {
    console.log(`🔍 Development mode enabled`);
    console.log(`📊 Database sync: ${configService.get('database.synchronize') ? 'ON' : 'OFF'}`);
    console.log(`📝 Database logging: ${configService.get('database.logging') ? 'ON' : 'OFF'}`);
  }
}

bootstrap().catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});  
