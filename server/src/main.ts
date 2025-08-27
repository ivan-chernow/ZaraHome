import 'dotenv/config';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as fs from 'fs';
import helmet from 'helmet';
import * as compression from 'compression';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);
  
  // Create uploads directory if it doesn't exist
  const uploadsDir = join(__dirname, '..', 'uploads');
  const productsDir = join(uploadsDir, 'products');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
  }
  if (!fs.existsSync(productsDir)) {
    fs.mkdirSync(productsDir);
  }

  const corsOrigins = (config.get<string>('CORS_ORIGINS') || '').split(',').filter(Boolean);
  app.enableCors({
    origin: corsOrigins.length ? corsOrigins : ['http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['Set-Cookie'],
  });

  // Serve static files
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  app.use(helmet());
  app.use(compression());
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }));
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.use(cookieParser());
  app.use(json({ limit: '20mb' }));
  app.use(urlencoded({ limit: '20mb', extended: true }));

  // Swagger (API Documentation)
  const swaggerEnabled = (config.get<string>('SWAGGER_ENABLED') ?? process.env.NODE_ENV !== 'production') === 'true' || process.env.NODE_ENV !== 'production';
  if (swaggerEnabled) {
    const swaggerTitle = config.get<string>('SWAGGER_TITLE') || 'ZaraHome ECOM API';
    const swaggerDesc = config.get<string>('SWAGGER_DESCRIPTION') || 'API документация ZaraHome ECOM';
    const swaggerVersion = config.get<string>('SWAGGER_VERSION') || '1.0';
    const swaggerPath = config.get<string>('SWAGGER_PATH') || 'api-docs';

    const swaggerConfig = new DocumentBuilder()
      .setTitle(swaggerTitle)
      .setDescription(swaggerDesc)
      .setVersion(swaggerVersion)
      .addServer(`http://localhost:${config.get<number>('PORT') || 3001}`)
      .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
        name: 'Authorization',
        description: 'Введите JWT в формате: Bearer <token>',
      })
      .build();

    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig, { deepScanRoutes: true });
    SwaggerModule.setup(swaggerPath, app, swaggerDocument, {
      swaggerOptions: { persistAuthorization: true },
      customSiteTitle: `${swaggerTitle} — Swagger`,
    });

    // JSON спецификация для интеграций/SDK
    app.getHttpAdapter().get(`/api-docs-json`, (req, res) => {
      res.type('application/json').send(swaggerDocument);
    });

    Logger.log(`Swagger available at http://localhost:${config.get<number>('PORT') || 3001}/${swaggerPath}`);
  }

  const port = config.get<number>('PORT') || 3001;
  await app.listen(port);
  Logger.log(`Server started on http://localhost:${port}`);
  Logger.log(`Swagger available at http://localhost:${port}/${swaggerPath}`);
}
bootstrap();  
