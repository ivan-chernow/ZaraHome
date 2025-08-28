import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '../config/config.service';
import { getCorsConfig } from '../config/cors.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Получаем сервис конфигурации
  const configService = app.get(ConfigService);

  // Проверяем обязательные переменные
  try {
    configService.validateRequired(['JWT_SECRET', 'DB_USERNAME', 'DB_PASSWORD', 'DB_DATABASE']);
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

  // Глобальный префикс API
  app.setGlobalPrefix(configService.globalPrefix);

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
    SwaggerModule.setup('api/docs', app, document);
    
    console.log('📚 Swagger documentation available at /api/docs');
  }

  // Запуск сервера
  await app.listen(configService.port);
  
  console.log(`🎉 Server is running on: http://localhost:${configService.port}/${configService.apiPrefix}`);
  
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
