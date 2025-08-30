import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('email_verification')
@Index(['email', 'isVerified']) // Индекс для поиска по email и статусу
@Index(['token']) // Индекс для поиска по токену
@Index(['code']) // Индекс для поиска по коду
@Index(['expiresAt']) // Индекс для поиска по дате истечения
@Index(['email', 'expiresAt']) // Составной индекс для активных верификаций
export class EmailVerification {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 254, nullable: true })
    email: string;

    @Column({ length: 10, nullable: true })
    code: string;

    @Column({ length: 255, unique: true, nullable: true })
    token: string;

    @Column({ nullable: true })
    expiresAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ default: false })
    isVerified: boolean;
}