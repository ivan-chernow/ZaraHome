import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { SubCategory } from "./sub-category.entity";
import { Product } from "./products.entity";

@Entity('types')
export class Type {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    name: string;

    @ManyToOne(() => SubCategory, subCategory => subCategory.types)
    subCategory: SubCategory;

    @Column()
    subCategoryId: number;

    @OneToMany(() => Product, product => product.type)
    products: Product[];
}
