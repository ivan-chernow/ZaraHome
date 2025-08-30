import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn, Index } from "typeorm";
import { User } from "../../users/user/entity/user.entity";
import { OrderItem } from "src/common/interfaces/order-item.interface";
import { OrderStatus } from "src/common/enums/order-status.enum";

@Entity('order')
@Index(['user', 'status']) // Индекс для поиска заказов пользователя по статусу
@Index(['status']) // Индекс для поиска заказов по статусу
@Index(['createdAt']) // Индекс для сортировки по дате создания
@Index(['user', 'createdAt']) // Составной индекс для заказов пользователя
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.orders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('jsonb', { comment: 'Товары в заказе' })
  items: OrderItem[];

  @Column('decimal', { 
    precision: 10, 
    scale: 2, 
    comment: 'Общая стоимость заказа',
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value)
    }
  })
  totalPrice: number;

  @Column('int', { comment: 'Общее количество товаров' })
  totalCount: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
    comment: 'Статус заказа'
  })
  status: OrderStatus;

  @Column({ 
    nullable: true, 
    length: 500,
    comment: 'Адрес доставки'
  })
  address: string;

  @Column({ 
    nullable: true, 
    length: 20,
    comment: 'Номер телефона'
  })
  phone: string;

  @Column({ 
    nullable: true, 
    type: 'text',
    comment: 'Комментарий к заказу'
  })
  comment: string;

  @Column({ 
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    comment: 'Скидка по промокоду',
    default: 0
  })
  discount: number;

  @Column({ 
    nullable: true,
    type: 'varchar',
    length: 50,
    comment: 'Использованный промокод'
  })
  promocode: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
