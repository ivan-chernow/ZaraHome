import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { Category } from './entity/category.entity';
import { SubCategory } from './entity/sub-category.entity';
import { Type } from './entity/type.entity';
import { Product } from './entity/products.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
    @InjectRepository(SubCategory) private subCategoryRepo: Repository<SubCategory>,
    @InjectRepository(Type) private typeRepo: Repository<Type>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
  ) {}

  async createProduct(dto: CreateProductDto) {
    const { categoryId, subCategoryId, typeId, ...rest } = dto;
    const product = this.productRepo.create(rest);

    // Найти объекты по id
    if (categoryId) {
      const category = await this.categoryRepo.findOneBy({ id: categoryId });
      if (category) product.category = category;
    }
    if (subCategoryId) {
      const subCategory = await this.subCategoryRepo.findOneBy({ id: subCategoryId });
      if (subCategory) product.subCategory = subCategory;
    }
    if (typeId) {
      const type = await this.typeRepo.findOneBy({ id: typeId });
      if (type) product.type = type;
    }

    return this.productRepo.save(product);
  }


async deleteProduct(id: number) {
  const product = await this.productRepo.findOneBy({id})
  if (!product) {
    throw new Error('Продукт не найден')
  }
  await this.productRepo.remove(product)
  return {message: 'Продукт успешно удален '}
  
}

  async getCatalog() {
    const categories = await this.categoryRepo.find({
      relations: [
        'subCategories', 
        'subCategories.products',
        'subCategories.types', 
        'subCategories.types.products',
        'products'
      ],
    });

    const newProducts = await this.productRepo.find({ where: { isNew: true } });
    const discountedProducts = await this.productRepo.find({ where: { discount: MoreThan(0) } });

    const novinkiCategory = categories.find(c => c.name === 'Новинки');
    if (novinkiCategory) {
      novinkiCategory.products = newProducts;
    }

    const skidkiCategory = categories.find(c => c.name === 'Скидки');
    if (skidkiCategory) {
      skidkiCategory.products = discountedProducts;
    }
    
    return categories;
  }
}
