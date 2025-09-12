import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/user/entity/user.entity';
import { Product } from '../../products/entity/products.entity';

@Entity('cart')
@Index(['user', 'product'], { unique: true }) // Уникальный индекс для предотвращения дублирования
@Index(['user']) // Индекс для быстрого поиска по пользователю
@Index(['product']) // Индекс для быстрого поиска по продукту
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.cart, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Product, product => product.cart, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
