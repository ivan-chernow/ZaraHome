import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Category } from './entity/category.entity';
import { SubCategory } from './entity/sub-category.entity';
import { Type } from './entity/type.entity';
import { Product } from './entity/products.entity';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
    @InjectRepository(SubCategory) private subCategoryRepo: Repository<SubCategory>,
    @InjectRepository(Type) private typeRepo: Repository<Type>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
  ) {}

  async findCategoryById(id: number): Promise<Category | null> {
    return this.categoryRepo.findOneBy({ id });
  }

  async findSubCategoryById(id: number): Promise<SubCategory | null> {
    return this.subCategoryRepo.findOneBy({ id });
  }

  async findTypeById(id: number): Promise<Type | null> {
    return this.typeRepo.findOneBy({ id });
  }

  async findProductById(id: number): Promise<Product | null> {
    return this.productRepo.findOne({
      where: { id },
      relations: ['category', 'subCategory', 'type']
    });
  }

  async findAllProducts(): Promise<Product[]> {
    return this.productRepo.find({
      relations: ['category', 'subCategory', 'type']
    });
  }

  async findProductsByIds(ids: number[]): Promise<Product[]> {
    if (!ids.length) return [];
    return this.productRepo.findByIds(ids);
  }

  async findNewProducts(): Promise<Product[]> {
    return this.productRepo.find({ where: { isNew: true } });
  }

  async findDiscountedProducts(): Promise<Product[]> {
    return this.productRepo.find({ where: { discount: MoreThan(0) } });
  }

  async findAllCategories(): Promise<Category[]> {
    return this.categoryRepo.find({
      relations: [
        'subCategories', 
        'subCategories.products',
        'subCategories.types', 
        'subCategories.types.products',
        'products'
      ],
    });
  }

  async createProduct(productData: Partial<Product>): Promise<Product> {
    const product = this.productRepo.create(productData);
    return this.productRepo.save(product);
  }

  async updateProduct(id: number, data: Partial<Product>): Promise<Product | null> {
    await this.productRepo.update(id, data);
    return this.findProductById(id);
  }

  async removeProduct(id: number): Promise<void> {
    const product = await this.findProductById(id);
    if (product) {
      await this.productRepo.remove(product);
    }
  }
}
