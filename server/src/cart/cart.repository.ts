import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Cart } from './entity/cart.entity';

@Injectable()
export class CartRepository {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
  ) {}

  /**
   * Найти корзину по ID с отношениями
   */
  async findById(id: number): Promise<Cart | null> {
    return this.cartRepository.findOne({
      where: { id },
      relations: ['user', 'product']
    });
  }

  /**
   * Найти товар в корзине пользователя
   */
  async findByUserAndProduct(userId: number, productId: number): Promise<Cart | null> {
    return this.cartRepository.findOne({
      where: { user: { id: userId }, product: { id: productId } },
      relations: ['user', 'product'],
    });
  }

  /**
   * Найти все товары в корзине пользователя
   */
  async findByUser(userId: number): Promise<Cart[]> {
    return this.cartRepository.find({ 
      where: { user: { id: userId } }, 
      relations: ['product'] 
    });
  }

  /**
   * Найти товары в корзине пользователя с полными деталями продукта
   */
  async findByUserWithProductDetails(userId: number): Promise<Cart[]> {
    return this.cartRepository.find({ 
      where: { user: { id: userId } }, 
      relations: ['product'],
      order: { id: 'DESC' } // Сортировка по дате добавления (новые сначала)
    });
  }

  /**
   * Найти товары в корзине пользователя по списку ID продуктов
   */
  async findByUserAndProducts(userId: number, productIds: number[]): Promise<Cart[]> {
    if (!productIds || productIds.length === 0) return [];
    
    return this.cartRepository.find({
      where: { user: { id: userId }, product: { id: In(productIds) } },
      relations: ['product'],
    });
  }

  /**
   * Подсчитать количество товаров в корзине пользователя
   */
  async countByUser(userId: number): Promise<number> {
    return this.cartRepository.count({
      where: { user: { id: userId } }
    });
  }

  /**
   * Создать новую запись в корзине
   */
  async create(user: any, product: any): Promise<Cart> {
    const cart = this.cartRepository.create({ user, product });
    return this.cartRepository.save(cart);
  }

  /**
   * Создать несколько записей в корзине (batch операция)
   */
  async createMultiple(cartItems: Array<{ user: any; product: any }>): Promise<Cart[]> {
    if (!cartItems || cartItems.length === 0) return [];

    const carts = cartItems.map(item => this.cartRepository.create(item));
    return this.cartRepository.save(carts);
  }

  /**
   * Обновить запись в корзине
   */
  async update(id: number, data: Partial<Cart>): Promise<Cart | null> {
    await this.cartRepository.update(id, data);
    return this.findById(id);
  }

  /**
   * Удалить запись по ID
   */
  async remove(id: number): Promise<void> {
    const cart = await this.findById(id);
    if (cart) {
      await this.cartRepository.remove(cart);
    }
  }

  /**
   * Удалить товар из корзины пользователя
   */
  async removeByUserAndProduct(userId: number, productId: number): Promise<void> {
    const cart = await this.findByUserAndProduct(userId, productId);
    if (cart) {
      await this.cartRepository.remove(cart);
    }
  }

  /**
   * Удалить несколько товаров из корзины пользователя (batch операция)
   */
  async removeMultipleByUserAndProducts(userId: number, productIds: number[]): Promise<void> {
    if (!productIds || productIds.length === 0) return;

    const cartItems = await this.findByUserAndProducts(userId, productIds);
    if (cartItems.length > 0) {
      await this.cartRepository.remove(cartItems);
    }
  }

  /**
   * Очистить корзину пользователя
   */
  async removeByUser(userId: number): Promise<void> {
    const cartItems = await this.findByUser(userId);
    if (cartItems.length > 0) {
      await this.cartRepository.remove(cartItems);
    }
  }

  /**
   * Проверить, есть ли товар в корзине пользователя
   */
  async existsByUserAndProduct(userId: number, productId: number): Promise<boolean> {
    const count = await this.cartRepository.count({
      where: { user: { id: userId }, product: { id: productId } }
    });
    return count > 0;
  }

  /**
   * Получить статистику корзины пользователя
   */
  async getCartStats(userId: number): Promise<{ totalItems: number; totalProducts: number }> {
    const [totalItems, totalProducts] = await Promise.all([
      this.countByUser(userId),
      this.cartRepository
        .createQueryBuilder('cart')
        .where('cart.user.id = :userId', { userId })
        .getCount()
    ]);

    return { totalItems, totalProducts };
  }
}
