import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "./category.entity";
import { Type } from "./type.entity";
import { Product } from "./products.entity";

@Entity('sub_categories')
export class SubCategory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToOne(() => Category, category => category.subCategories)
    category: Category;

    @Column()
    categoryId: number;

    @OneToMany(() => Type, type => type.subCategory)
    types: Type[];

    @OneToMany(() => Product, product => product.subCategory)
    products: Product[];
}