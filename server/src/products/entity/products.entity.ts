import { User } from "../../users/user/entity/user.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn, Index } from "typeorm";
import { Category } from "./category.entity";
import { SubCategory } from "./sub-category.entity";
import { Type } from "./type.entity";
import { Favorite } from "src/favorites/entity/favorite.entity";
import { Cart } from "src/cart/entity/cart.entity";

@Entity('products')
@Index(['category']) // Индекс для поиска по категории
@Index(['subCategory']) // Индекс для поиска по подкатегории
@Index(['type']) // Индекс для поиска по типу
@Index(['isNew']) // Индекс для новых продуктов
@Index(['isAvailable']) // Индекс для доступности
@Index(['discount']) // Индекс для скидок
@Index(['createdAt']) // Индекс для сортировки по дате создания
@Index(['name_ru']) // Индекс для поиска по названию на русском
@Index(['name_eng']) // Индекс для поиска по названию на английском
@Index(['category', 'isAvailable']) // Составной индекс для фильтрации
@Index(['isNew', 'isAvailable']) // Составной индекс для новых доступных
@Index(['discount', 'isAvailable']) // Составной индекс для скидок
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true, length: 255 })
    name_eng: string;

    @Column({ nullable: true, length: 255 })
    name_ru: string;

    @Column('simple-array', { nullable: true })
    img: string[];

    @Column('jsonb', { nullable: true })
    colors: string[];

    @Column('jsonb', { nullable: true })
    size: { size: string; price: number }[];

    @Column({ length: 100, nullable: true })
    deliveryDate: string;

    @Column('text', { nullable: true })
    description: string;

    @Column({ default: false })
    isNew?: boolean;

    @Column({ type: 'int', nullable: true })
    discount?: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User, user => user.products, { nullable: true })
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
