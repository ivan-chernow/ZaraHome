import { RefreshToken } from "src/auth/login/entity/refresh-token.entity";
import { Product } from "src/products/entity/products.entity";
import { Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn } from "typeorm";
import { Favorite } from "src/favorites/entities/favorite.entity";

import { Column } from "typeorm";
import { DeliveryAddress } from "./delivery-address.entity";

export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
}

@Entity()
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
}
