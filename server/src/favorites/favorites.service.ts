import { Injectable, NotFoundException } from '@nestjs/common';
import { Favorite } from './entity/favorite.entity';
import { Product } from '../products/entity/products.entity';
import { FavoritesRepository } from './favorites.repository';
import { IFavoritesService } from 'src/common/interfaces/service.interface';
import { CacheService } from '../shared/cache/cache.service';
import { CACHE_TTL, CACHE_PREFIXES } from '../shared/cache/cache.constants';

@Injectable()
export class FavoritesService implements IFavoritesService {
  constructor(
    private readonly favoritesRepository: FavoritesRepository,
    private readonly cacheService: CacheService,
  ) {}

  async add(userId: number, productId: number): Promise<Favorite> {
    const user = await this.favoritesRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const product = await this.favoritesRepository.findProductById(productId);
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const existingFavorite = await this.favoritesRepository.findFavoriteByUserAndProduct(userId, productId);
    if (existingFavorite) {
      return existingFavorite; // Уже в избранном
    }

    const favorite = await this.favoritesRepository.createFavorite(user, product);
    
    // Инвалидируем кеш избранного пользователя
    await this.invalidateUserFavoritesCache(userId);
    
    return favorite;
  }

  async remove(userId: number, productId: number): Promise<void> {
    const favorite = await this.favoritesRepository.findFavoriteByUserAndProduct(userId, productId);

    if (!favorite) {
      throw new NotFoundException('Favorite entry not found');
    }

    await this.favoritesRepository.removeFavorite(favorite);
    
    // Инвалидируем кеш избранного пользователя
    await this.invalidateUserFavoritesCache(userId);
  }

  async findAll(userId: number): Promise<Product[]> {
    const cacheKey = `user:${userId}`;
    
    return this.cacheService.getOrSet(
      cacheKey,
      async () => {
        const favorites = await this.favoritesRepository.findFavoritesByUser(userId);
        return favorites.map((fav) => fav.product);
      },
      { 
        ttl: CACHE_TTL.USER_FAVORITES, 
        prefix: CACHE_PREFIXES.USER_FAVORITES 
      }
    );
  }

  async getFavoriteStatus(userId: number, productIds: number[]): Promise<Record<number, boolean>> {
    if (!productIds.length) {
      return {};
    }
    const favorites = await this.favoritesRepository.findFavoritesByUserAndProducts(userId, productIds);
    const favoriteMap = favorites.reduce((acc, fav) => {
      acc[fav.product.id] = true;
      return acc;
    }, {} as Record<number, boolean>);

    productIds.forEach((id) => {
      if (!favoriteMap[id]) {
        favoriteMap[id] = false;
      }
    });

    return favoriteMap;
  }

  /**
   * Инвалидировать кеш избранного пользователя
   */
  private async invalidateUserFavoritesCache(userId: number): Promise<void> {
    const cacheKey = `user:${userId}`;
    await this.cacheService.delete(cacheKey, CACHE_PREFIXES.USER_FAVORITES);
  }
}
