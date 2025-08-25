import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoritesService } from './favorites.service';
import { FavoritesRepository } from './favorites.repository';
import { FavoritesController } from './favorites.controller';
import { Favorite } from './entity/favorite.entity';
import { User } from '../users/user/entity/user.entity';
import { Product } from '../products/entity/products.entity';
import { SharedModule } from '../shared/modules/shared.module';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite, User, Product]), SharedModule],
  controllers: [FavoritesController],
  providers: [FavoritesService, FavoritesRepository],
})
export class FavoritesModule {}
