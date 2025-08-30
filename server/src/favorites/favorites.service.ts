import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Favorite } from './entity/favorite.entity';
import { Product } from '../products/entity/products.entity';
import { FavoritesRepository } from './favorites.repository';
import { UserService } from '../users/user/user.service';
import { ProductsService } from '../products/products.service';
import { IFavoriteItem, IFavoriteItemWithProduct } from '../common/interfaces/cart-favorites.interface';
import { CacheService } from '../shared/cache/cache.service';
import { CACHE_TTL, CACHE_PREFIXES } from '../shared/cache/cache.constants';
import { FAVORITES_CONSTANTS } from './favorites.constants';

@Injectable()
export class FavoritesService {
  constructor(
    private readonly favoritesRepository: FavoritesRepository,
    private readonly userService: UserService,
    private readonly productService: ProductsService,
    private readonly cacheService: CacheService,
  ) {}

  /**
   * Добавить товар в избранное
   */
  async add(userId: number, productId: number): Promise<IFavoriteItem> {
    // Валидация входных данных
    if (!userId || !productId) {
      throw new BadRequestException(FAVORITES_CONSTANTS.ERRORS.INVALID_USER_ID);
    }

    // Проверяем существование пользователя и продукта параллельно
    const [user, product] = await Promise.all([
      this.userService.findOne(userId),
      this.productService.findOne(productId)
    ]);

    if (!user) {
      throw new NotFoundException(FAVORITES_CONSTANTS.ERRORS.USER_NOT_FOUND);
    }

    if (!product) {
      throw new NotFoundException(FAVORITES_CONSTANTS.ERRORS.PRODUCT_NOT_FOUND);
    }

    // Проверяем, есть ли уже в избранном
    const existingFavorite = await this.favoritesRepository.findFavoriteByUserAndProduct(userId, productId);
    if (existingFavorite) {
      return {
        id: existingFavorite.id,
        userId: existingFavorite.user.id,
        productId: existingFavorite.product.id
      };
    }

    // Создаем новую запись в избранном
    const favorite = await this.favoritesRepository.createFavorite(user, product);
    
    // Инвалидируем кеш избранного пользователя
    await this.invalidateUserFavoritesCache(userId);
    
    return {
      id: favorite.id,
      userId: favorite.user.id,
      productId: favorite.product.id
    };
  }

  /**
   * Удалить товар из избранного
   */
  async remove(userId: number, productId: number): Promise<void> {
    if (!userId || !productId) {
      throw new BadRequestException(FAVORITES_CONSTANTS.ERRORS.INVALID_USER_ID);
    }

    const favorite = await this.favoritesRepository.findFavoriteByUserAndProduct(userId, productId);
    if (!favorite) {
      throw new NotFoundException(FAVORITES_CONSTANTS.ERRORS.FAVORITE_ITEM_NOT_FOUND);
    }

    await this.favoritesRepository.removeFavorite(favorite);
    
    // Инвалидируем кеш избранного пользователя
    await this.invalidateUserFavoritesCache(userId);
  }

  /**
   * Получить избранное пользователя с кешированием
   */
  async findAll(userId: number): Promise<IFavoriteItemWithProduct[]> {
    if (!userId) {
      throw new BadRequestException(FAVORITES_CONSTANTS.ERRORS.INVALID_USER_ID);
    }

    const cacheKey = FAVORITES_CONSTANTS.CACHE_KEYS.USER_FAVORITES(userId);
    
    return this.cacheService.getOrSet(
      cacheKey,
      async () => {
        const favorites = await this.favoritesRepository.findFavoritesByUserWithProductDetails(userId);
        
        return favorites.map(fav => ({
          id: fav.id,
          userId: fav.user.id,
          productId: fav.product.id,
          product: {
            id: fav.product.id,
            name_eng: fav.product.name_eng,
            name_ru: fav.product.name_ru,
            img: fav.product.img,
            colors: fav.product.colors,
            size: fav.product.size,
            deliveryDate: fav.product.deliveryDate,
            description: fav.product.description,
            isNew: fav.product.isNew,
            discount: fav.product.discount,
            isAvailable: fav.product.isAvailable
          }
        }));
      },
      { 
        ttl: CACHE_TTL.USER_FAVORITES, 
        prefix: CACHE_PREFIXES.USER_FAVORITES 
      }
    );
  }

  /**
   * Очистить избранное пользователя
   */
  async clearFavorites(userId: number): Promise<void> {
    if (!userId) {
      throw new BadRequestException(FAVORITES_CONSTANTS.ERRORS.INVALID_USER_ID);
    }

    const favorites = await this.favoritesRepository.findFavoritesByUser(userId);
    if (favorites.length === 0) {
      return; // Избранное уже пусто
    }

    await this.favoritesRepository.removeByUser(userId);
    
    // Инвалидируем кеш избранного пользователя
    await this.invalidateUserFavoritesCache(userId);
  }

  /**
   * Получить статус товаров в избранном (batch операция)
   */
  async getFavoriteStatus(userId: number, productIds: number[]): Promise<Record<number, boolean>> {
    if (!userId) {
      throw new BadRequestException(FAVORITES_CONSTANTS.ERRORS.INVALID_USER_ID);
    }

    if (!productIds || productIds.length === 0) {
      return {};
    }

    // Валидация productIds
    const validProductIds = productIds.filter(id => Number.isInteger(id) && id > 0);
    if (validProductIds.length === 0) {
      return {};
    }

    // Удаляем дубликаты
    const uniqueProductIds = [...new Set(validProductIds)];
    
    const favorites = await this.favoritesRepository.findFavoritesByUserAndProducts(userId, uniqueProductIds);
    const favoriteProductIds = new Set(favorites.map(fav => fav.product.id));
    
    return uniqueProductIds.reduce<Record<number, boolean>>((acc, id) => {
      acc[id] = favoriteProductIds.has(id);
      return acc;
    }, {});
  }

  /**
   * Добавить несколько товаров в избранное (batch операция)
   */
  async addMultiple(userId: number, productIds: number[]): Promise<IFavoriteItem[]> {
    if (!userId || !productIds || productIds.length === 0) {
      throw new BadRequestException(FAVORITES_CONSTANTS.ERRORS.INVALID_PRODUCT_IDS);
    }

    // Валидация и дедупликация
    const validProductIds = [...new Set(productIds.filter(id => Number.isInteger(id) && id > 0))];
    
    if (validProductIds.length === 0) {
      throw new BadRequestException(FAVORITES_CONSTANTS.ERRORS.NO_VALID_PRODUCTS);
    }

    // Проверяем существование пользователя
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException(FAVORITES_CONSTANTS.ERRORS.USER_NOT_FOUND);
    }

    // Проверяем существование продуктов
    const products = await Promise.all(
      validProductIds.map(id => this.productService.findOne(id))
    );

    const existingProducts = products.filter(Boolean);
    if (existingProducts.length === 0) {
      throw new NotFoundException(FAVORITES_CONSTANTS.ERRORS.NO_VALID_PRODUCTS);
    }

    // Получаем существующие товары в избранном
    const existingFavorites = await this.favoritesRepository.findFavoritesByUserAndProducts(
      userId, 
      existingProducts.map(p => p!.id)
    );
    const existingProductIds = new Set(existingFavorites.map(fav => fav.product.id));

    // Добавляем только новые товары
    const newProducts = existingProducts.filter(product => product && !existingProductIds.has(product.id));
    
    if (newProducts.length === 0) {
      // Все товары уже в избранном
      return existingFavorites.map(fav => ({
        id: fav.id,
        userId: fav.user.id,
        productId: fav.product.id
      }));
    }

    // Создаем новые записи в избранном
    const newFavorites = await Promise.all(
      newProducts.map(product => this.favoritesRepository.createFavorite(user, product!))
    );

    // Инвалидируем кеш избранного пользователя
    await this.invalidateUserFavoritesCache(userId);

    // Возвращаем все товары в избранном
    const allFavorites = [...existingFavorites, ...newFavorites];
    return allFavorites.map(fav => ({
      id: fav.id,
      userId: fav.user.id,
      productId: fav.product.id
    }));
  }

  /**
   * Удалить несколько товаров из избранного (batch операция)
   */
  async removeMultiple(userId: number, productIds: number[]): Promise<void> {
    if (!userId || !productIds || productIds.length === 0) {
      throw new BadRequestException(FAVORITES_CONSTANTS.ERRORS.INVALID_PRODUCT_IDS);
    }

    const validProductIds = [...new Set(productIds.filter(id => Number.isInteger(id) && id > 0))];
    
    if (validProductIds.length === 0) {
      return; // Нет валидных ID для удаления
    }

    await this.favoritesRepository.removeMultipleByUserAndProducts(userId, validProductIds);
    
    // Инвалидируем кеш избранного пользователя
    await this.invalidateUserFavoritesCache(userId);
  }

  /**
   * Получить количество товаров в избранном
   */
  async getFavoritesCount(userId: number): Promise<number> {
    if (!userId) {
      throw new BadRequestException(FAVORITES_CONSTANTS.ERRORS.INVALID_USER_ID);
    }

    const cacheKey = FAVORITES_CONSTANTS.CACHE_KEYS.USER_FAVORITES_COUNT(userId);
    
    return this.cacheService.getOrSet(
      cacheKey,
      async () => {
        return this.favoritesRepository.countByUser(userId);
      },
      { 
        ttl: CACHE_TTL.USER_FAVORITES, 
        prefix: CACHE_PREFIXES.USER_FAVORITES 
      }
    );
  }

  /**
   * Инвалидировать кеш избранного пользователя
   */
  private async invalidateUserFavoritesCache(userId: number): Promise<void> {
    const favoritesCacheKey = FAVORITES_CONSTANTS.CACHE_KEYS.USER_FAVORITES(userId);
    const countCacheKey = FAVORITES_CONSTANTS.CACHE_KEYS.USER_FAVORITES_COUNT(userId);
    
    await Promise.all([
      this.cacheService.delete(favoritesCacheKey, CACHE_PREFIXES.USER_FAVORITES),
      this.cacheService.delete(countCacheKey, CACHE_PREFIXES.USER_FAVORITES)
    ]);
  }
}
