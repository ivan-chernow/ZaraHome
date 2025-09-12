import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, Like, In } from 'typeorm';
import { Category } from './entity/category.entity';
import { SubCategory } from './entity/sub-category.entity';
import { Type } from './entity/type.entity';
import { Product } from './entity/products.entity';

interface ProductFilters {
  categoryId?: number;
  subCategoryId?: number;
  typeId?: number;
  minPrice?: number;
  maxPrice?: number;
  isNew?: boolean;
  hasDiscount?: boolean;
  isAvailable?: boolean;
  search?: string;
}

interface ProductSort {
  field: 'price' | 'createdAt' | 'name_ru' | 'discount';
  order: 'ASC' | 'DESC';
}

interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

@Injectable()
export class ProductsRepository {
  private readonly categoryRepo: Repository<Category>;
  private readonly subCategoryRepo: Repository<SubCategory>;
  private readonly typeRepo: Repository<Type>;
  private readonly productRepo: Repository<Product>;

  constructor(
    @InjectRepository(Category) categoryRepo: Repository<Category>,
    @InjectRepository(SubCategory) subCategoryRepo: Repository<SubCategory>,
    @InjectRepository(Type) typeRepo: Repository<Type>,
    @InjectRepository(Product) productRepo: Repository<Product>
  ) {
    this.categoryRepo = categoryRepo;
    this.subCategoryRepo = subCategoryRepo;
    this.typeRepo = typeRepo;
    this.productRepo = productRepo;
  }

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
      relations: ['category', 'subCategory', 'type'],
    });
  }

  async findAllProducts(): Promise<Product[]> {
    return this.productRepo.find({
      relations: ['category', 'subCategory', 'type'],
    });
  }

  async findProductsWithFilters(
    filters?: ProductFilters,
    sort?: ProductSort,
    page: number = 1,
    limit: number = 20
  ): Promise<ProductListResponse> {
    const queryBuilder = this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.subCategory', 'subCategory')
      .leftJoinAndSelect('product.type', 'type');

    // Применяем фильтры
    if (filters) {
      if (filters.categoryId) {
        queryBuilder.andWhere('category.id = :categoryId', {
          categoryId: filters.categoryId,
        });
      }

      if (filters.subCategoryId) {
        queryBuilder.andWhere('subCategory.id = :subCategoryId', {
          subCategoryId: filters.subCategoryId,
        });
      }

      if (filters.typeId) {
        queryBuilder.andWhere('type.id = :typeId', { typeId: filters.typeId });
      }

      if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        // Фильтрация по цене (берем минимальную цену из массива размеров)
        if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
          queryBuilder.andWhere(
            "EXISTS (SELECT 1 FROM jsonb_array_elements(product.size) AS size_item WHERE (size_item->>'price')::numeric BETWEEN :minPrice AND :maxPrice)",
            {
              minPrice: filters.minPrice,
              maxPrice: filters.maxPrice,
            }
          );
        } else if (filters.minPrice !== undefined) {
          queryBuilder.andWhere(
            "EXISTS (SELECT 1 FROM jsonb_array_elements(product.size) AS size_item WHERE (size_item->>'price')::numeric >= :minPrice)",
            {
              minPrice: filters.minPrice,
            }
          );
        } else if (filters.maxPrice !== undefined) {
          queryBuilder.andWhere(
            "EXISTS (SELECT 1 FROM jsonb_array_elements(product.size) AS size_item WHERE (size_item->>'price')::numeric <= :maxPrice)",
            {
              maxPrice: filters.maxPrice,
            }
          );
        }
      }

      if (filters.isNew !== undefined) {
        queryBuilder.andWhere('product.isNew = :isNew', {
          isNew: filters.isNew,
        });
      }

      if (filters.hasDiscount !== undefined) {
        if (filters.hasDiscount) {
          queryBuilder.andWhere('product.discount > 0');
        } else {
          queryBuilder.andWhere(
            'product.discount = 0 OR product.discount IS NULL'
          );
        }
      }

      if (filters.isAvailable !== undefined) {
        queryBuilder.andWhere('product.isAvailable = :isAvailable', {
          isAvailable: filters.isAvailable,
        });
      }

      if (filters.search) {
        queryBuilder.andWhere(
          '(product.name_ru ILIKE :search OR product.name_eng ILIKE :search OR product.description ILIKE :search)',
          { search: `%${filters.search}%` }
        );
      }
    }

    // Применяем сортировку
    if (sort) {
      if (sort.field === 'price') {
        // Сортировка по минимальной цене из массива размеров
        queryBuilder.orderBy(
          "(SELECT MIN((size_item->>'price')::numeric) FROM jsonb_array_elements(product.size) AS size_item)",
          sort.order
        );
      } else {
        queryBuilder.orderBy(`product.${sort.field}`, sort.order);
      }
    } else {
      queryBuilder.orderBy('product.createdAt', 'DESC');
    }

    // Получаем общее количество
    const total = await queryBuilder.getCount();

    // Применяем пагинацию
    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    const products = await queryBuilder.getMany();

    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
      products,
      total,
      page,
      limit,
      totalPages,
      hasNext,
      hasPrev,
    };
  }

  async findProductsByIds(ids: number[]): Promise<Product[]> {
    if (!ids.length) return [];
    return this.productRepo.find({
      where: { id: In(ids) },
      relations: ['category', 'subCategory', 'type'],
    });
  }

  async findNewProducts(): Promise<Product[]> {
    return this.productRepo.find({
      where: { isNew: true },
      relations: ['category', 'subCategory', 'type'],
    });
  }

  async findDiscountedProducts(): Promise<Product[]> {
    return this.productRepo.find({
      where: { discount: MoreThan(0) },
      relations: ['category', 'subCategory', 'type'],
    });
  }

  async searchProducts(query: string, limit: number = 10): Promise<Product[]> {
    return this.productRepo.find({
      where: [
        { name_ru: Like(`%${query}%`) },
        { name_eng: Like(`%${query}%`) },
        { description: Like(`%${query}%`) },
      ],
      relations: ['category', 'subCategory', 'type'],
      take: limit,
      order: { createdAt: 'DESC' },
    });
  }

  async getProductStats(): Promise<{
    total: number;
    available: number;
    new: number;
    discounted: number;
    categories: number;
  }> {
    const [total, available, newProducts, discounted, categories] =
      await Promise.all([
        this.productRepo.count(),
        this.productRepo.count({ where: { isAvailable: true } }),
        this.productRepo.count({ where: { isNew: true } }),
        this.productRepo.count({ where: { discount: MoreThan(0) } }),
        this.categoryRepo.count(),
      ]);

    return {
      total,
      available,
      new: newProducts,
      discounted,
      categories,
    };
  }

  async findAllCategories(): Promise<Category[]> {
    return this.categoryRepo.find({
      relations: [
        'subCategories',
        'subCategories.products',
        'subCategories.types',
        'subCategories.types.products',
        'products',
      ],
    });
  }

  async createProduct(productData: Partial<Product>): Promise<Product> {
    const product = this.productRepo.create(productData);
    return this.productRepo.save(product);
  }

  async updateProduct(
    id: number,
    data: Partial<Product>
  ): Promise<Product | null> {
    await this.productRepo.update(id, data);
    return this.findProductById(id);
  }

  async removeProduct(id: number): Promise<void> {
    const product = await this.findProductById(id);
    if (product) {
      await this.productRepo.remove(product);
    }
  }

  async removeMultipleProducts(ids: number[]): Promise<number> {
    const result = await this.productRepo.delete({ id: In(ids) });
    return result.affected || 0;
  }

  async getProductsByCategory(
    categoryId: number,
    limit: number = 10
  ): Promise<Product[]> {
    return this.productRepo.find({
      where: { category: { id: categoryId } },
      relations: ['category', 'subCategory', 'type'],
      take: limit,
      order: { createdAt: 'DESC' },
    });
  }

  async getProductsBySubCategory(
    subCategoryId: number,
    limit: number = 10
  ): Promise<Product[]> {
    return this.productRepo.find({
      where: { subCategory: { id: subCategoryId } },
      relations: ['category', 'subCategory', 'type'],
      take: limit,
      order: { createdAt: 'DESC' },
    });
  }

  async getProductsByType(
    typeId: number,
    limit: number = 10
  ): Promise<Product[]> {
    return this.productRepo.find({
      where: { type: { id: typeId } },
      relations: ['category', 'subCategory', 'type'],
      take: limit,
      order: { createdAt: 'DESC' },
    });
  }
}
