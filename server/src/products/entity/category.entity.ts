import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./products.entity";
import { SubCategory } from "./sub-category.entity";

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => SubCategory, subCategory => subCategory.category)
    subCategories: SubCategory[];
    
    @OneToMany(() => Product, product => product.category)
    products: Product[];
}