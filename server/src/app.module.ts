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
  emailConfig,
  getDatabaseConfig,
  getJwtConfig,
  getRateLimitConfig
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

    // База данных - используем функцию-помощник
    TypeOrmModule.forRootAsync({
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),

    // JWT - используем функцию-помощник
    JwtModule.registerAsync({
      useFactory: getJwtConfig,
      inject: [ConfigService],
    }),

    // Rate Limiting - используем функцию-помощник
    ThrottlerModule.forRootAsync({
      useFactory: getRateLimitConfig,
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
