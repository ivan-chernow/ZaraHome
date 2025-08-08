import { Module } from '@nestjs/common';
import { CartService } from './cart.services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entity/cart.entity';
import { User } from 'src/users/user/entity/user.entity';
import { Product } from 'src/products/entity/products.entity';
import { CartController } from './cart.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, User, Product])],
  providers: [CartService],
  controllers: [CartController],
  exports: [CartService],
})
export class CartModule {}
