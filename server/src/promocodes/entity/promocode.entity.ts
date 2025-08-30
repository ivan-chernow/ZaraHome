import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, OneToMany } from "typeorm";
import { PromocodeUsage } from "./promocode-usage.entity";

@Entity('promocodes')
@Index(['code'], { unique: true })
@Index(['isActive'])
@Index(['discount'])
@Index(['createdAt'])
@Index(['expiresAt'])
@Index(['isActive', 'expiresAt'])
@Index(['isActive', 'discount'])
export class Promocode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 20 })
  code: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  discount: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ name: 'max_usage', nullable: true })
  maxUsage: number | null;

  @Column({ name: 'current_usage', default: 0 })
  currentUsage: number;

  @Column({ name: 'min_order_amount', type: 'decimal', precision: 10, scale: 2, default: 0 })
  minOrderAmount: number;

  @Column({ name: 'expires_at', nullable: true })
  expiresAt: Date | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => PromocodeUsage, usage => usage.promocode)
  usageHistory: PromocodeUsage[];
}