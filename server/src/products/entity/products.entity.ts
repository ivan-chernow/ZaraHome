import { User } from "../../users/user/entity/user.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Category } from "./category.entity";
import { SubCategory } from "./sub-category.entity";
import { Type } from "./type.entity";
import { Favorite } from "src/favorites/entity/favorite.entity";
import { Cart } from "src/cart/entity/cart.entity";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    name_eng: string;

    @Column()
    name_ru: string;

    @Column('simple-array')
    img: string[];

    @Column('jsonb')
    colors: string[];

    @Column('jsonb')
    size: { size: string; price: number }[];

    @Column()
    deliveryDate: string;

    @Column('text')
    description: string;

    @Column({ default: false })
    isNew?: boolean;

    @Column({ type: 'int', nullable: true })
    discount?: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User, user => user.products)
    user: User;

    @Column({ default: true })
    isAvailable: boolean;

    @ManyToOne(() => Category, category => category.products)
    @JoinColumn({ name: 'category_id' })
    category: Category;


    @ManyToOne(() => SubCategory, subCategory => subCategory.products)
    @JoinColumn({ name: 'sub_category_id' })
    subCategory: SubCategory;


    @ManyToOne(() => Type, type => type.products, { nullable: true })
    @JoinColumn({ name: 'type_id' })
    type: Type;

    @OneToMany(() => Favorite, favorite => favorite.product)
    favoritedBy: Favorite[];

    @OneToMany(() => Cart, cart => cart.product)
    cart: Cart[];
}
