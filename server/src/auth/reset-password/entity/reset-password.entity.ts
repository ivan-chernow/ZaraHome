import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('reset_passwords')
@Index(['email'])
@Index(['token'], { unique: true })
@Index(['email', 'createdAt'])
export class ResetPassword {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 64, unique: true })
  token: string;

  @Column({ type: 'boolean', default: false })
  isVerified: boolean;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  isVerifiedAndNotExpired(): boolean {
    return this.isVerified && !this.isExpired();
  }
}
