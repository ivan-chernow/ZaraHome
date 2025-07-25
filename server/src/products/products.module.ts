import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entity/products.entity';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Category } from './entity/category.entity';
import { SubCategory } from './entity/sub-category.entity';
import { Type } from './entity/type.entity';
import { Favorite } from 'src/favorites/entity/favorite.entity';
import { Cart } from 'src/cart/entity/cart.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category, SubCategory, Type, Cart, Favorite])],
  providers: [ProductsService],
  controllers: [ProductsController],
  exports: [ProductsService],
})
export class ProductsModule {}
