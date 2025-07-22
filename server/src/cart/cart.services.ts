import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entity/cart.entity';
import { User } from 'src/users/user/entity/user.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async addToCart(userId: number, productId: number): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId }, product: { id: productId } },
    });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    return cart;
  }

  async removeFromCart(userId: number, productId: number): Promise<void> {
    const cart = await this.cartRepository.findOne({ where: { user: { id: userId }, product: { id: productId } } });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    await this.cartRepository.remove(cart);
  }
}
