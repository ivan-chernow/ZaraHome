import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Cart } from './entity/cart.entity';
import { User } from 'src/users/user/entity/user.entity';
import { Product } from 'src/products/entity/products.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async addToCart(userId: number, productId: number): Promise<Cart> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) throw new NotFoundException('Product not found');

    let cart = await this.cartRepository.findOne({
      where: { user: { id: userId }, product: { id: productId } },
      relations: ['user', 'product'],
    });

    if (cart) return cart; // idempotent

    cart = this.cartRepository.create({ user, product });
    return this.cartRepository.save(cart);
  }

  async removeFromCart(userId: number, productId: number): Promise<void> {
    const cart = await this.cartRepository.findOne({ where: { user: { id: userId }, product: { id: productId } } });
    if (!cart) return; // idempotent
    await this.cartRepository.remove(cart);
  }

  async findAll(userId: number): Promise<Product[]> {
    const rows = await this.cartRepository.find({ where: { user: { id: userId } }, relations: ['product'] });
    return rows.map((r) => r.product);
  }

  async getCartStatus(userId: number, productIds: number[]): Promise<Record<number, boolean>> {
    if (!productIds || productIds.length === 0) return {};
    const rows = await this.cartRepository.find({
      where: { user: { id: userId }, product: { id: In(productIds) } },
      relations: ['product'],
    });
    const set = new Set(rows.map((r) => r.product.id));
    return productIds.reduce<Record<number, boolean>>((acc, id) => {
      acc[id] = set.has(id);
      return acc;
    }, {});
  }
}
