import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import helmet from 'helmet';
import compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

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
      accessExpiresIn: configService.get('jwt.accessExpiresIn') || '24h',
    },
    cors: {
      origin: configService.get('cors.origin'),
      credentials: configService.get('cors.credentials'),
    },
  };

  validateCriticalConfig(config);
  logServerConfig(config);

  // Security middleware
  app.use(helmet());
  app.use(compression());

  app.enableCors(config.cors);

  app.useStaticAssets(join(__dirname, '..', '..', 'uploads'), {
    prefix: '/uploads/',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  if (config.app.isDevelopment) {
    setupSwagger(app);
  }

  // Health check endpoint
  setupHealthCheck(app);

  await app.listen(config.app.port);

  console.log(`🎉 Server is running on: http://localhost:${config.app.port}`);

  if (config.app.isDevelopment) {
    logDevelopmentInfo(config);
  }
}

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
    console.error('❌ Configuration validation failed:');
    errors.forEach(error => console.error(`   - ${error}`));
    console.error(
      'Please check your .env file and required environment variables'
    );
    process.exit(1);
  }

  console.log('✅ Configuration validation passed');
}

function logServerConfig(config: any) {
  console.log('🚀 Starting ZaraHome ECOM Server');
  console.log(`🌍 Environment: ${config.app.nodeEnv}`);
  console.log(`🌐 Port: ${config.app.port}`);
  console.log(
    `🗄️ Database: ${config.database.host}:${config.database.port}/${config.database.database}`
  );
  console.log(`🔐 JWT Expires In: ${config.jwt.accessExpiresIn}`);
}

function setupSwagger(app: NestExpressApplication) {
  const config = new DocumentBuilder()
    .setTitle('ZaraHome ECOM API')
    .setDescription('API документация для ZaraHome ECOM')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  console.log('📚 Swagger documentation available at /docs');
}

function logDevelopmentInfo(config: any) {
  console.log('🔍 Development mode enabled');
  console.log(
    `📊 Database sync: ${config.database.synchronize ? 'ON' : 'OFF'}`
  );
  console.log(`📝 Database logging: ${config.database.logging ? 'ON' : 'OFF'}`);
}

function setupHealthCheck(app: NestExpressApplication) {
  app.use('/health', (req, res) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
    });
  });
}

bootstrap().catch(error => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});
