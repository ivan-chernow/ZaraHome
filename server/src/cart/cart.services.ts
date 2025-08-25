import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Cart } from './entity/cart.entity';
import { User } from 'src/users/user/entity/user.entity';
import { Product } from 'src/products/entity/products.entity';
import { 
  ICartService, 
  ICartItem, 
  ICartItemWithProduct,
  IProduct,
  IUser
} from '../common/interfaces';

@Injectable()
export class CartService implements ICartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(data: any): Promise<ICartItem> {
    const { userId, productId } = data;
    return this.addToCart(userId, productId);
  }

  async findAll(): Promise<ICartItem[]> {
    throw new Error('Method not implemented. Use getUserCart(userId) instead.');
  }

  async findOne(id: number): Promise<ICartItem | null> {
    return this.cartRepository.findOne({
      where: { id },
      relations: ['user', 'product']
    });
  }

  async update(id: number, data: any): Promise<ICartItem> {
    const cart = await this.cartRepository.findOneBy({ id });
    if (!cart) {
      throw new NotFoundException('Cart item not found');
    }
    
    Object.assign(cart, data);
    return this.cartRepository.save(cart);
  }

  async delete(id: number): Promise<void> {
    const cart = await this.cartRepository.findOneBy({ id });
    if (!cart) {
      throw new NotFoundException('Cart item not found');
    }
    await this.cartRepository.remove(cart);
  }

  async addToCart(userId: number, productId: number): Promise<ICartItem> {
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

  async getUserCart(userId: number): Promise<ICartItemWithProduct[]> {
    const cartItems = await this.cartRepository.find({ 
      where: { user: { id: userId } }, 
      relations: ['product'] 
    });
    
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
  }

  async clearCart(userId: number): Promise<void> {
    const cartItems = await this.cartRepository.find({ where: { user: { id: userId } } });
    await this.cartRepository.remove(cartItems);
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
