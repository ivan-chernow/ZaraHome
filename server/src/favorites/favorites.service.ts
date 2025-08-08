import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Favorite } from './entity/favorite.entity';
import { User } from '../users/user/entity/user.entity';
import { Product } from '../products/entity/products.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async add(userId: number, productId: number): Promise<Favorite> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const product = await this.productRepository.findOneBy({ id: productId });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const existingFavorite = await this.favoriteRepository.findOne({ where: { user: { id: userId }, product: { id: productId } } });
    if (existingFavorite) {
      return existingFavorite; // Уже в избранном
    }

    const favorite = this.favoriteRepository.create({ user, product });
    return this.favoriteRepository.save(favorite);
  }

  async remove(userId: number, productId: number): Promise<void> {
    const favorite = await this.favoriteRepository.findOne({
      where: { user: { id: userId }, product: { id: productId } },
    });

    if (!favorite) {
      throw new NotFoundException('Favorite entry not found');
    }

    await this.favoriteRepository.remove(favorite);
  }

  async findAll(userId: number): Promise<Product[]> {
    const favorites = await this.favoriteRepository.find({
      where: { user: { id: userId } },
      relations: ['product'],
    });
    return favorites.map((fav) => fav.product);
  }

  async getFavoriteStatus(userId: number, productIds: number[]): Promise<Record<number, boolean>> {
    if (!productIds.length) {
      return {};
    }
    const favorites = await this.favoriteRepository.find({
      where: {
        user: { id: userId },
        product: { id: In(productIds) },
      },
      relations: ['product'],
    });
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
