import { Injectable, NotFoundException } from '@nestjs/common';
import { CartRepository } from './cart.repository';
import { UserService } from '../users/user/user.service';
import { ProductsService } from '../products/products.service';
import { 
  ICartService, 
  ICartItem, 
  ICartItemWithProduct
} from '../common/interfaces';
import { CacheService } from '../shared/cache/cache.service';
import { CACHE_TTL, CACHE_PREFIXES } from '../shared/cache/cache.constants';

@Injectable()
export class CartService implements ICartService {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly userService: UserService,
    private readonly productService: ProductsService,
    private readonly cacheService: CacheService,
  ) {}

  async create(data: any): Promise<ICartItem> {
    const { userId, productId } = data;
    return this.addToCart(userId, productId);
  }

  async findAll(): Promise<ICartItem[]> {
    // Метод не используется. Возвращаем пустой массив, чтобы не выбрасывать Error
    return [];
  }

  async findOne(id: number): Promise<ICartItem | null> {
    const cart = await this.cartRepository.findById(id);
    if (!cart) return null;
    
    return {
      id: cart.id,
      userId: cart.user.id,
      productId: cart.product.id
    };
  }

  async update(id: number, data: any): Promise<ICartItem> {
    const cart = await this.cartRepository.findById(id);
    if (!cart) {
      throw new NotFoundException('Cart item not found');
    }
    
    const updatedCart = await this.cartRepository.update(id, data);
    if (!updatedCart) {
      throw new NotFoundException('Failed to update cart item');
    }
    
    return {
      id: updatedCart.id,
      userId: updatedCart.user.id,
      productId: updatedCart.product.id
    };
  }

  async delete(id: number): Promise<void> {
    await this.cartRepository.remove(id);
  }

  async addToCart(userId: number, productId: number): Promise<ICartItem> {
    // Проверяем существование пользователя и продукта
    await this.userService.findOne(userId);
    await this.productService.findOne(productId);

    // Проверяем, есть ли уже в корзине
    const existingCart = await this.cartRepository.findByUserAndProduct(userId, productId);
    if (existingCart) return {
      id: existingCart.id,
      userId: existingCart.user.id,
      productId: existingCart.product.id
    }; // idempotent

    // Создаем новую запись в корзине
    const user = await this.userService.findOne(userId);
    const product = await this.productService.findOne(productId);
    
    const newCart = await this.cartRepository.create(user, product);
    
    // Инвалидируем кеш корзины пользователя
    await this.invalidateUserCartCache(userId);
    
    return {
      id: newCart.id,
      userId: newCart.user.id,
      productId: newCart.product.id
    };
  }

  async removeFromCart(userId: number, productId: number): Promise<void> {
    await this.cartRepository.removeByUserAndProduct(userId, productId);
    
    // Инвалидируем кеш корзины пользователя
    await this.invalidateUserCartCache(userId);
  }

  async getUserCart(userId: number): Promise<ICartItem[]> {
    const cacheKey = `user:${userId}`;
    
    return this.cacheService.getOrSet(
      cacheKey,
      async () => {
        const cartItems = await this.cartRepository.findByUser(userId);
        
        return cartItems.map(item => ({
          id: item.id,
          userId: item.user.id,
          productId: item.product.id,
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
            isAvailable: item.product.isAvailable
          }
        }));
      },
      { 
        ttl: CACHE_TTL.USER_CART, 
        prefix: CACHE_PREFIXES.USER_CART 
      }
    );
  }

  async clearCart(userId: number): Promise<void> {
    await this.cartRepository.removeByUser(userId);
    
    // Инвалидируем кеш корзины пользователя
    await this.invalidateUserCartCache(userId);
  }

  async getCartStatus(userId: number, productIds: number[]): Promise<Record<number, boolean>> {
    if (!productIds || productIds.length === 0) return {};
    
    const rows = await this.cartRepository.findByUserAndProducts(userId, productIds);
    const set = new Set(rows.map((r) => r.product.id));
    
    return productIds.reduce<Record<number, boolean>>((acc, id) => {
      acc[id] = set.has(id);
      return acc;
    }, {});
  }

  /**
   * Инвалидировать кеш корзины пользователя
   */
  private async invalidateUserCartCache(userId: number): Promise<void> {
    const cacheKey = `user:${userId}`;
    await this.cacheService.delete(cacheKey, CACHE_PREFIXES.USER_CART);
  }
}
