import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { Category } from './entity/category.entity';
import { SubCategory } from './entity/sub-category.entity';
import { Type } from './entity/type.entity';
import { Product } from './entity/products.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { 
  IProduct, 
  IProductService, 
  ICreateProductDto,
  IProductWithRelations,
  ICategory,
  ISubCategory,
  IType
} from '../common/interfaces';

@Injectable()
export class ProductsService implements IProductService {
  constructor(
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
    @InjectRepository(SubCategory) private subCategoryRepo: Repository<SubCategory>,
    @InjectRepository(Type) private typeRepo: Repository<Type>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
  ) {}

  async create(data: ICreateProductDto): Promise<IProduct> {
    const { categoryId, subCategoryId, typeId, ...rest } = data;
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

  async findAll(): Promise<IProduct[]> {
    return this.productRepo.find({
      relations: ['category', 'subCategory', 'type']
    });
  }

  async findOne(id: number): Promise<IProduct | null> {
    return this.productRepo.findOne({
      where: { id },
      relations: ['category', 'subCategory', 'type']
    });
  }

  async update(id: number, data: Partial<ICreateProductDto>): Promise<IProduct> {
    const product = await this.productRepo.findOneBy({ id });
    if (!product) {
      throw new Error('Продукт не найден');
    }
    
    Object.assign(product, data);
    return this.productRepo.save(product);
  }

  async delete(id: number): Promise<void> {
    const product = await this.productRepo.findOneBy({id})
    if (!product) {
      throw new Error('Продукт не найден')
    }
    await this.productRepo.remove(product)
  }

  async getCatalog(): Promise<ICategory[]> {
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

  async findByIds(ids: number[]): Promise<IProduct[]> {
    if (!ids.length) return [];
    return this.productRepo.findByIds(ids);
  }
}
