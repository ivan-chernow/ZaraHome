import { Module } from '@nestjs/common';
import { CartService } from './cart.services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entity/cart.entity';
import { User } from 'src/users/user/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, User])],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
