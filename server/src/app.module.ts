import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { PromocodesModule } from './promocodes/promocodes.module';
import { DatabaseModule } from './database/database.module';
import * as entities from './database/entities';
import { FavoritesModule } from './favorites/favorites.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { envValidationSchema } from './config/env.validation';
import { AppCacheModule } from './shared/cache/cache.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: envValidationSchema,
        }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                type: 'postgres',
                host: config.get<string>('DB_HOST'),
                port: config.get<number>('DB_PORT'),
                username: config.get<string>('DB_USERNAME'),
                password: config.get<string>('DB_PASSWORD'),
                database: config.get<string>('DB_DATABASE'),
                entities: Object.values(entities),
                synchronize: config.get<string>('NODE_ENV') !== 'production',
                dropSchema: false,
                autoLoadEntities: false,
                // Отключаем миграции для разработки
                migrations: [],
                migrationsRun: false,
            }),
        }),
        // Смягчаем глобальный rate limit, чтобы UI мог безопасно рефетчить данные
        ThrottlerModule.forRoot([{
            ttl: 60000, // 1 минута
            limit: 120, // 120 запросов в минуту на IP
        }]),
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
            useClass: ThrottlerGuard
        }
    ],
})
export class AppModule { }
