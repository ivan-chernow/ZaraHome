import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, Index } from 'typeorm';
import { Promocode } from './promocode.entity';

@Entity('promocode_usage')
@Index(['promocodeId'])
@Index(['userId'])
@Index(['usedAt'])
@Index(['promocodeId', 'userId'])
@Index(['promocodeId', 'usedAt'])
export class PromocodeUsage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'promocode_id' })
  promocodeId: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'order_amount', type: 'decimal', precision: 10, scale: 2 })
  orderAmount: number;

  @Column({ name: 'discount_applied', type: 'decimal', precision: 10, scale: 2 })
  discountApplied: number;

  @CreateDateColumn({ name: 'used_at' })
  usedAt: Date;

  @ManyToOne(() => Promocode, promocode => promocode.id)
  @JoinColumn({ name: 'promocode_id' })
  promocode: Promocode;
}
