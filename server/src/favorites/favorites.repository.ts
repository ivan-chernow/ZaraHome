import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Favorite } from './entity/favorite.entity';
import { User } from '../users/user/entity/user.entity';
import { Product } from '../products/entity/products.entity';

@Injectable()
export class FavoritesRepository {
  private readonly favoriteRepository: Repository<Favorite>;
  private readonly userRepository: Repository<User>;
  private readonly productRepository: Repository<Product>;

  constructor(
    @InjectRepository(Favorite) favoriteRepository: Repository<Favorite>,
    @InjectRepository(User) userRepository: Repository<User>,
    @InjectRepository(Product) productRepository: Repository<Product>
  ) {
    this.favoriteRepository = favoriteRepository;
    this.userRepository = userRepository;
    this.productRepository = productRepository;
  }

  /**
   * Найти пользователя по ID
   */
  async findUserById(userId: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id: userId });
  }

  /**
   * Найти продукт по ID
   */
  async findProductById(productId: number): Promise<Product | null> {
    return this.productRepository.findOneBy({ id: productId });
  }

  /**
   * Найти избранное по пользователю и продукту
   */
  async findFavoriteByUserAndProduct(
    userId: number,
    productId: number
  ): Promise<Favorite | null> {
    return this.favoriteRepository.findOne({
      where: { user: { id: userId }, product: { id: productId } },
    });
  }

  /**
   * Найти все избранное пользователя
   */
  async findFavoritesByUser(userId: number): Promise<Favorite[]> {
    return this.favoriteRepository.find({
      where: { user: { id: userId } },
      relations: ['product'],
    });
  }

  /**
   * Найти избранное пользователя с полными деталями продукта
   */
  async findFavoritesByUserWithProductDetails(
    userId: number
  ): Promise<Favorite[]> {
    return this.favoriteRepository
      .createQueryBuilder('favorite')
      .leftJoinAndSelect('favorite.product', 'product')
      .leftJoinAndSelect('favorite.user', 'user')
      .where('favorite.user.id = :userId', { userId })
      .andWhere('product.id IS NOT NULL') // Исключаем записи с несуществующими продуктами
      .orderBy('favorite.id', 'DESC')
      .getMany();
  }

  /**
   * Очистить невалидные записи избранного (с несуществующими продуктами)
   */
  async cleanupInvalidFavorites(): Promise<void> {
    await this.favoriteRepository
      .createQueryBuilder()
      .delete()
      .where('productId NOT IN (SELECT id FROM products)')
      .execute();
  }

  /**
   * Найти избранное пользователя по списку ID продуктов
   */
  async findFavoritesByUserAndProducts(
    userId: number,
    productIds: number[]
  ): Promise<Favorite[]> {
    if (!productIds || productIds.length === 0) {
      return [];
    }
    return this.favoriteRepository.find({
      where: {
        user: { id: userId },
        product: { id: In(productIds) },
      },
      relations: ['product'],
    });
  }

  /**
   * Подсчитать количество избранного пользователя
   */
  async countByUser(userId: number): Promise<number> {
    return this.favoriteRepository.count({
      where: { user: { id: userId } },
    });
  }

  /**
   * Создать новую запись в избранном
   */
  async createFavorite(user: User, product: Product): Promise<Favorite> {
    const favorite = this.favoriteRepository.create({ user, product });
    return this.favoriteRepository.save(favorite);
  }

  /**
   * Создать несколько записей в избранном (batch операция)
   */
  async createMultiple(
    favoriteItems: Array<{ user: User; product: Product }>
  ): Promise<Favorite[]> {
    if (!favoriteItems || favoriteItems.length === 0) return [];

    const favorites = favoriteItems.map(item =>
      this.favoriteRepository.create(item)
    );
    return this.favoriteRepository.save(favorites);
  }

  /**
   * Удалить запись из избранного
   */
  async removeFavorite(favorite: Favorite): Promise<void> {
    await this.favoriteRepository.remove(favorite);
  }

  /**
   * Удалить несколько записей из избранного (batch операция)
   */
  async removeMultipleByUserAndProducts(
    userId: number,
    productIds: number[]
  ): Promise<void> {
    if (!productIds || productIds.length === 0) return;

    const favorites = await this.findFavoritesByUserAndProducts(
      userId,
      productIds
    );
    if (favorites.length > 0) {
      await this.favoriteRepository.remove(favorites);
    }
  }

  /**
   * Очистить избранное пользователя
   */
  async removeByUser(userId: number): Promise<void> {
    const favorites = await this.findFavoritesByUser(userId);
    if (favorites.length > 0) {
      await this.favoriteRepository.remove(favorites);
    }
  }

  /**
   * Проверить, есть ли товар в избранном пользователя
   */
  async existsByUserAndProduct(
    userId: number,
    productId: number
  ): Promise<boolean> {
    const count = await this.favoriteRepository.count({
      where: { user: { id: userId }, product: { id: productId } },
    });
    return count > 0;
  }

  /**
   * Получить статистику избранного пользователя
   */
  async getFavoritesStats(
    userId: number
  ): Promise<{ totalItems: number; totalProducts: number }> {
    const [totalItems, totalProducts] = await Promise.all([
      this.countByUser(userId),
      this.favoriteRepository
        .createQueryBuilder('favorite')
        .where('favorite.user.id = :userId', { userId })
        .getCount(),
    ]);

    return { totalItems, totalProducts };
  }
}
