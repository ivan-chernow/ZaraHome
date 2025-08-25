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

  async findById(id: number): Promise<Cart | null> {
    return this.cartRepository.findOne({
      where: { id },
      relations: ['user', 'product']
    });
  }

  async findByUserAndProduct(userId: number, productId: number): Promise<Cart | null> {
    return this.cartRepository.findOne({
      where: { user: { id: userId }, product: { id: productId } },
      relations: ['user', 'product'],
    });
  }

  async findByUser(userId: number): Promise<Cart[]> {
    return this.cartRepository.find({ 
      where: { user: { id: userId } }, 
      relations: ['product'] 
    });
  }

  async findByUserAndProducts(userId: number, productIds: number[]): Promise<Cart[]> {
    if (!productIds || productIds.length === 0) return [];
    
    return this.cartRepository.find({
      where: { user: { id: userId }, product: { id: In(productIds) } },
      relations: ['product'],
    });
  }

  async create(user: any, product: any): Promise<Cart> {
    const cart = this.cartRepository.create({ user, product });
    return this.cartRepository.save(cart);
  }

  async update(id: number, data: Partial<Cart>): Promise<Cart | null> {
    await this.cartRepository.update(id, data);
    return this.findById(id);
  }

  async remove(id: number): Promise<void> {
    const cart = await this.findById(id);
    if (cart) {
      await this.cartRepository.remove(cart);
    }
  }

  async removeByUserAndProduct(userId: number, productId: number): Promise<void> {
    const cart = await this.findByUserAndProduct(userId, productId);
    if (cart) {
      await this.cartRepository.remove(cart);
    }
  }

  async removeByUser(userId: number): Promise<void> {
    const cartItems = await this.findByUser(userId);
    if (cartItems.length > 0) {
      await this.cartRepository.remove(cartItems);
    }
  }
}
