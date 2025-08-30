import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Index } from 'typeorm';
import { User } from '../../../users/user/entity/user.entity';

@Entity('refresh_tokens')
@Index(['token'], { unique: true })
@Index(['user', 'expiresAt'])
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', unique: true })
  token: string;

  @ManyToOne(() => User, user => user.refreshTokens, { 
    onDelete: 'CASCADE',
    nullable: false 
  })
  user: User;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }
}
