import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { PromocodesModule } from './promocodes/promocodes.module';
import { DatabaseModule } from './database/database.module';
import { FavoritesModule } from './favorites/favorites.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { AppCacheModule } from './shared/cache/cache.module';
import { ConfigModule } from '../config/config.module';
import { DatabaseConfigModule } from '../config/database/database-config.module';
import { JwtConfigModule } from '../config/jwt/jwt-config.module';
import { RateLimitConfigModule } from '../config/rate-limit/rate-limit-config.module';

@Module({
    imports: [
        ConfigModule,
        DatabaseConfigModule,
        JwtConfigModule,
        RateLimitConfigModule,
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
