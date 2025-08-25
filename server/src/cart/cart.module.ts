import { Module } from '@nestjs/common';
import { CartService } from './cart.services';
import { CartRepository } from './cart.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entity/cart.entity';
import { CartController } from './cart.controller';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart]),
    UsersModule,
    ProductsModule
  ],
  providers: [CartService, CartRepository],
  controllers: [CartController],
  exports: [CartService],
})
export class CartModule {}
