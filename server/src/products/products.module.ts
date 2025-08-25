import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entity/products.entity';
import { ProductsService } from './products.service';
import { ProductsRepository } from './products.repository';
import { ProductsController } from './products.controller';
import { Category } from './entity/category.entity';
import { SubCategory } from './entity/sub-category.entity';
import { Type } from './entity/type.entity';
import { Favorite } from 'src/favorites/entity/favorite.entity';
import { Cart } from 'src/cart/entity/cart.entity';
import { SharedModule } from 'src/shared/modules/shared.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category, SubCategory, Type, Cart, Favorite]), SharedModule],
  providers: [ProductsService, ProductsRepository],
  controllers: [ProductsController],
  exports: [ProductsService],
})
export class ProductsModule {}
