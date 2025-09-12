import { Module } from '@nestjs/common';
import { CartService } from './cart.services';
import { CartRepository } from './cart.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entity/cart.entity';
import { CartController } from './cart.controller';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from '../products/products.module';
import { SharedModule } from '../shared/modules/shared.module';
import { AppCacheModule } from '../shared/cache/cache.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart]),
    UsersModule,
    ProductsModule,
    SharedModule,
    AppCacheModule,
  ],
  providers: [CartService, CartRepository],
  controllers: [CartController],
  exports: [CartService],
})
export class CartModule {}
