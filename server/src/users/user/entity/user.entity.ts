import { RefreshToken } from "src/auth/login/entity/refresh-token.entity";
import { Product } from "src/products/entity/products.entity";
import { Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn, Column, Index } from "typeorm";
import { Favorite } from "src/favorites/entity/favorite.entity";
import { DeliveryAddress } from "./delivery-address.entity";
import { Cart } from "src/cart/entity/cart.entity";
import { Order } from "src/orders/entity/order.entity";
import { UserRole } from "src/shared/shared.interfaces";

@Entity('users')
@Index(['email'], { unique: true })
@Index(['role'])
@Index(['isEmailVerified'])
@Index(['status'])
@Index(['createdAt'])
@Index(['updatedAt'])
@Index(['role', 'status'])
@Index(['email', 'status'])
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
    role: UserRole;

    @Column({ default: false })
    isEmailVerified: boolean;

    @Column({ 
        type: 'varchar', 
        length: 100, 
        nullable: true,
        comment: 'Имя пользователя'
    })
    firstName: string | null;

    @Column({ 
        type: 'varchar', 
        length: 100, 
        nullable: true,
        comment: 'Фамилия пользователя'
    })
    lastName: string | null;

    @Column({ 
        type: 'varchar', 
        length: 20, 
        nullable: true,
        comment: 'Номер телефона'
    })
    phone: string | null;

    @Column({ 
        type: 'varchar', 
        length: 500, 
        nullable: true,
        comment: 'Основной адрес доставки'
    })
    defaultAddress: string | null;

    @Column({ 
        type: 'enum', 
        enum: ['active', 'inactive', 'suspended', 'pending_verification'],
        default: 'active',
        comment: 'Статус пользователя'
    })
    status: string;

    @Column({ 
        type: 'int', 
        default: 0,
        comment: 'Количество неудачных попыток входа'
    })
    loginAttempts: number;

    @Column({ 
        type: 'timestamp', 
        nullable: true,
        comment: 'Время блокировки аккаунта'
    })
    lockedUntil: Date | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => RefreshToken, token => token.user)
    refreshTokens: RefreshToken[];

    @OneToMany(() => DeliveryAddress, address => address.user)
    deliveryAddresses: DeliveryAddress[];

    @OneToMany(() => Product, product => product.user)
    products: Product[];

    @OneToMany(() => Favorite, favorite => favorite.user)
    favorites: Favorite[];

    @OneToMany(() => Cart, cart => cart.user)
    cart: Cart[];

    @OneToMany(() => Order, order => order.user)
    orders: Order[];
}
