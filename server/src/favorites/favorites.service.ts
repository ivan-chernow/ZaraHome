import { Injectable, NotFoundException } from '@nestjs/common';
import { Favorite } from './entity/favorite.entity';
import { Product } from '../products/entity/products.entity';
import { FavoritesRepository } from './favorites.repository';

@Injectable()
export class FavoritesService {
  constructor(
    private readonly favoritesRepository: FavoritesRepository,
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

    return this.favoritesRepository.createFavorite(user, product);
  }

  async remove(userId: number, productId: number): Promise<void> {
    const favorite = await this.favoritesRepository.findFavoriteByUserAndProduct(userId, productId);

    if (!favorite) {
      throw new NotFoundException('Favorite entry not found');
    }

    await this.favoritesRepository.removeFavorite(favorite);
  }

  async findAll(userId: number): Promise<Product[]> {
    const favorites = await this.favoritesRepository.findFavoritesByUser(userId);
    return favorites.map((fav) => fav.product);
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
}
