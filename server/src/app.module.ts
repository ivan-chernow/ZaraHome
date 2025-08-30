import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { PromocodesModule } from './promocodes/promocodes.module';
import { DatabaseModule } from './database/database.module';
import { FavoritesModule } from './favorites/favorites.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { AppCacheModule } from './shared/cache/cache.module';
import { ConditionalThrottlerGuard } from './shared/guards/conditional-throttler.guard';
import { envValidationSchema, validationOptions } from '../config/env.validation';
import { 
  appConfig, 
  databaseConfig, 
  jwtConfig, 
  rateLimitConfig, 
  corsConfig,
  cacheConfig,
  fileUploadConfig,
  emailConfig 
} from '../config/env.config';

@Module({
  imports: [
    // Конфигурация
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      validationSchema: envValidationSchema,
      validationOptions,
      load: [
        appConfig,
        databaseConfig,
        jwtConfig,
        rateLimitConfig,
        corsConfig,
        cacheConfig,
        fileUploadConfig,
        emailConfig,
      ],
      cache: true,
    }),

    // База данных
    TypeOrmModule.forRootAsync({
      useFactory: (configService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        synchronize: configService.get('database.synchronize'),
        logging: configService.get('database.logging'),
        entities: configService.get('database.entities'),
      }),
      inject: [ConfigService],
    }),

    // JWT
    JwtModule.registerAsync({
      useFactory: (configService) => ({
        secret: configService.get('jwt.secret'),
        signOptions: {
          expiresIn: configService.get('jwt.accessExpiresIn'),
        },
      }),
      inject: [ConfigService],
    }),

    // Rate Limiting
    ThrottlerModule.forRootAsync({
      useFactory: (configService) => ({
        throttlers: [
          {
            ttl: configService.get('rateLimit.ttl'),
            limit: configService.get('rateLimit.maxRequests'),
          },
        ],
      }),
      inject: [ConfigService],
    }),

    // Модули приложения
    AuthModule,
    UsersModule,
    ProductsModule,
    PromocodesModule,
    DatabaseModule,
    FavoritesModule,
    CartModule,
    OrdersModule,
    AppCacheModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ConditionalThrottlerGuard,
    },
  ],
})
export class AppModule {}
