import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoritesService } from './favorites.service';
import { FavoritesRepository } from './favorites.repository';
import { FavoritesController } from './favorites.controller';
import { Favorite } from './entity/favorite.entity';
import { User } from '../users/user/entity/user.entity';
import { Product } from '../products/entity/products.entity';
import { SharedModule } from '../shared/modules/shared.module';
import { AppCacheModule } from '../shared/cache/cache.module';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Favorite, User, Product]), 
    SharedModule,
    AppCacheModule,
    UsersModule,
    ProductsModule
  ],
  controllers: [FavoritesController],
  providers: [FavoritesService, FavoritesRepository],
  exports: [FavoritesService],
})
export class FavoritesModule {}
