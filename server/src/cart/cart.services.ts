import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CartRepository } from './cart.repository';
import { UserService } from '../users/user/user.service';
import { ProductsService } from '../products/products.service';
import { CartItem, CartItemWithProduct } from '../shared/shared.interfaces';
import { CacheService } from '../shared/cache/cache.service';
import { CACHE_TTL, CACHE_PREFIXES } from '../shared/cache/cache.constants';
import { CART_CONSTANTS } from './cart.constants';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly userService: UserService,
    private readonly productService: ProductsService,
    private readonly cacheService: CacheService,
  ) {}

  /**
   * Добавить товар в корзину
   */
  async addToCart(userId: number, productId: number): Promise<CartItem> {
    // Валидация входных данных
    if (!userId || !productId) {
      throw new BadRequestException(CART_CONSTANTS.ERRORS.INVALID_USER_ID);
    }

    // Проверяем существование пользователя и продукта параллельно
    const [user, product] = await Promise.all([
      this.userService.findOne(userId),
      this.productService.findOne(productId)
    ]);

    if (!user) {
      throw new NotFoundException(CART_CONSTANTS.ERRORS.USER_NOT_FOUND);
    }

    if (!product) {
      throw new NotFoundException(CART_CONSTANTS.ERRORS.PRODUCT_NOT_FOUND);
    }

    // Проверяем, есть ли уже в корзине
    const existingCart = await this.cartRepository.findByUserAndProduct(userId, productId);
    if (existingCart) {
      return {
        id: existingCart.id,
        userId: existingCart.user.id,
        productId: existingCart.product.id,
        createdAt: existingCart.createdAt
      };
    }

    // Создаем новую запись в корзине
    const newCart = await this.cartRepository.create(user, product);
    
    // Инвалидируем кеш корзины пользователя
    await this.invalidateUserCartCache(userId);
    
    return {
      id: newCart.id,
      userId: newCart.user.id,
      productId: newCart.product.id,
      createdAt: newCart.createdAt
    };
  }

  /**
   * Удалить товар из корзины
   */
  async removeFromCart(userId: number, productId: number): Promise<void> {
    if (!userId || !productId) {
      throw new BadRequestException(CART_CONSTANTS.ERRORS.INVALID_USER_ID);
    }

    const cartItem = await this.cartRepository.findByUserAndProduct(userId, productId);
    if (!cartItem) {
      throw new NotFoundException(CART_CONSTANTS.ERRORS.CART_ITEM_NOT_FOUND);
    }

    await this.cartRepository.removeByUserAndProduct(userId, productId);
    
    // Инвалидируем кеш корзины пользователя
    await this.invalidateUserCartCache(userId);
  }

  /**
   * Получить корзину пользователя с кешированием
   */
  async getUserCart(userId: number): Promise<CartItemWithProduct[]> {
    if (!userId) {
      throw new BadRequestException(CART_CONSTANTS.ERRORS.INVALID_USER_ID);
    }

    const cacheKey = CART_CONSTANTS.CACHE_KEYS.USER_CART(userId);
    
    return this.cacheService.getOrSet(
      cacheKey,
      async () => {
        const cartItems = await this.cartRepository.findByUserWithProductDetails(userId);
        // Фильтруем битые элементы без продукта или пользователя (могли быть удалены)
        const safeItems = (cartItems ?? []).filter(
          (item) => item && item.product && item.product.id && item.user && item.user.id,
        );

        return safeItems.map(item => ({
          id: item.id,
          userId: item.user?.id ?? userId,
          productId: item.product.id,
          createdAt: item.createdAt,
          product: {
            id: item.product.id,
            name_eng: item.product.name_eng,
            name_ru: item.product.name_ru,
            img: item.product.img,
            colors: item.product.colors,
            size: item.product.size,
            deliveryDate: item.product.deliveryDate,
            description: item.product.description,
            isNew: item.product.isNew,
            discount: item.product.discount,
            isAvailable: item.product.isAvailable,
            createdAt: item.product.createdAt,
            updatedAt: item.product.updatedAt
          }
        }));
      },
      { 
        ttl: CACHE_TTL.USER_CART, 
        prefix: CACHE_PREFIXES.USER_CART 
      }
    );
  }

  /**
   * Очистить корзину пользователя
   */
  async clearCart(userId: number): Promise<void> {
    if (!userId) {
      throw new BadRequestException(CART_CONSTANTS.ERRORS.INVALID_USER_ID);
    }

    const cartItems = await this.cartRepository.findByUser(userId);
    if (cartItems.length === 0) {
      return; // Корзина уже пуста
    }

    await this.cartRepository.removeByUser(userId);
    
    // Инвалидируем кеш корзины пользователя
    await this.invalidateUserCartCache(userId);
  }

  /**
   * Получить статус товаров в корзине (batch операция)
   */
  async getCartStatus(userId: number, productIds: number[]): Promise<Record<number, boolean>> {
    if (!userId) {
      throw new BadRequestException(CART_CONSTANTS.ERRORS.INVALID_USER_ID);
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
    
    const cartItems = await this.cartRepository.findByUserAndProducts(userId, uniqueProductIds);
    const cartProductIds = new Set(cartItems.map(item => item.product.id));
    
    return uniqueProductIds.reduce<Record<number, boolean>>((acc, id) => {
      acc[id] = cartProductIds.has(id);
      return acc;
    }, {});
  }

  /**
   * Добавить несколько товаров в корзину (batch операция)
   */
  async addMultipleToCart(userId: number, productIds: number[]): Promise<CartItem[]> {
    if (!userId || !productIds || productIds.length === 0) {
      throw new BadRequestException(CART_CONSTANTS.ERRORS.INVALID_PRODUCT_IDS);
    }

    // Валидация и дедупликация
    const validProductIds = [...new Set(productIds.filter(id => Number.isInteger(id) && id > 0))];
    
    if (validProductIds.length === 0) {
      throw new BadRequestException(CART_CONSTANTS.ERRORS.NO_VALID_PRODUCTS);
    }

    // Проверяем существование пользователя
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException(CART_CONSTANTS.ERRORS.USER_NOT_FOUND);
    }

    // Проверяем существование продуктов
    const products = await Promise.all(
      validProductIds.map(id => this.productService.findOne(id))
    );

    const existingProducts = products.filter(Boolean);
    if (existingProducts.length === 0) {
      throw new NotFoundException(CART_CONSTANTS.ERRORS.NO_VALID_PRODUCTS);
    }

    // Получаем существующие товары в корзине
    const existingCartItems = await this.cartRepository.findByUserAndProducts(
      userId, 
      existingProducts.map(p => p!.id)
    );
    const existingProductIds = new Set(existingCartItems.map(item => item.product.id));

    // Добавляем только новые товары
    const newProducts = existingProducts.filter(product => product && !existingProductIds.has(product.id));
    
    if (newProducts.length === 0) {
      // Все товары уже в корзине
      return existingCartItems.map(item => ({
        id: item.id,
        userId: item.user.id,
        productId: item.product.id,
        createdAt: item.createdAt
      }));
    }

    // Создаем новые записи в корзине
    const newCartItems = await Promise.all(
      newProducts.map(product => this.cartRepository.create(user, product))
    );

    // Инвалидируем кеш корзины пользователя
    await this.invalidateUserCartCache(userId);

    // Возвращаем все товары в корзине
    const allCartItems = [...existingCartItems, ...newCartItems];
    return allCartItems.map(item => ({
      id: item.id,
      userId: item.user.id,
      productId: item.product.id,
      createdAt: item.createdAt
    }));
  }

  /**
   * Удалить несколько товаров из корзины (batch операция)
   */
  async removeMultipleFromCart(userId: number, productIds: number[]): Promise<void> {
    if (!userId || !productIds || productIds.length === 0) {
      throw new BadRequestException(CART_CONSTANTS.ERRORS.INVALID_PRODUCT_IDS);
    }

    const validProductIds = [...new Set(productIds.filter(id => Number.isInteger(id) && id > 0))];
    
    if (validProductIds.length === 0) {
      return; // Нет валидных ID для удаления
    }

    await this.cartRepository.removeMultipleByUserAndProducts(userId, validProductIds);
    
    // Инвалидируем кеш корзины пользователя
    await this.invalidateUserCartCache(userId);
  }

  /**
   * Получить количество товаров в корзине
   */
  async getCartItemCount(userId: number): Promise<number> {
    if (!userId) {
      throw new BadRequestException(CART_CONSTANTS.ERRORS.INVALID_USER_ID);
    }

    const cacheKey = CART_CONSTANTS.CACHE_KEYS.USER_CART_COUNT(userId);
    
    return this.cacheService.getOrSet(
      cacheKey,
      async () => {
        return this.cartRepository.countByUser(userId);
      },
      { 
        ttl: CACHE_TTL.USER_CART, 
        prefix: CACHE_PREFIXES.USER_CART 
      }
    );
  }

  /**
   * Инвалидировать кеш корзины пользователя
   */
  private async invalidateUserCartCache(userId: number): Promise<void> {
    const cartCacheKey = CART_CONSTANTS.CACHE_KEYS.USER_CART(userId);
    const countCacheKey = CART_CONSTANTS.CACHE_KEYS.USER_CART_COUNT(userId);
    
    await Promise.all([
      this.cacheService.delete(cartCacheKey, CACHE_PREFIXES.USER_CART),
      this.cacheService.delete(countCacheKey, CACHE_PREFIXES.USER_CART)
    ]);
  }
}
