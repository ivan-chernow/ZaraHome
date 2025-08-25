import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Favorite } from './entity/favorite.entity';
import { User } from '../users/user/entity/user.entity';
import { Product } from '../products/entity/products.entity';

@Injectable()
export class FavoritesRepository {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findUserById(userId: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id: userId });
  }

  async findProductById(productId: number): Promise<Product | null> {
    return this.productRepository.findOneBy({ id: productId });
  }

  async findFavoriteByUserAndProduct(userId: number, productId: number): Promise<Favorite | null> {
    return this.favoriteRepository.findOne({ 
      where: { user: { id: userId }, product: { id: productId } } 
    });
  }

  async findFavoritesByUser(userId: number): Promise<Favorite[]> {
    return this.favoriteRepository.find({
      where: { user: { id: userId } },
      relations: ['product'],
    });
  }

  async findFavoritesByUserAndProducts(userId: number, productIds: number[]): Promise<Favorite[]> {
    if (!productIds.length) {
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

  async createFavorite(user: User, product: Product): Promise<Favorite> {
    const favorite = this.favoriteRepository.create({ user, product });
    return this.favoriteRepository.save(favorite);
  }

  async removeFavorite(favorite: Favorite): Promise<void> {
    await this.favoriteRepository.remove(favorite);
  }
}
