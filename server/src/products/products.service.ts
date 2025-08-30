import { Injectable, BadRequestException } from '@nestjs/common';
import { ResourceNotFoundException, ConflictException } from 'src/common/base/base.exceptions';
import { ProductsRepository } from './products.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { IProduct, IProductWithRelations } from '../common/interfaces/product.interface';
import { ICategory, ISubCategory, IType } from '../common/interfaces/product.interface';
import { IProductService } from '../common/interfaces/service.interface';
import { ICreateProductDto } from '../common/interfaces/dto.interface';
import { ImageOptimizationService } from 'src/shared/services/image-optimization.service';
import { validateUploadedFiles } from 'src/shared/upload/file-upload.helper';
import { FileUploadErrorHandlerService } from 'src/shared/services/file-upload-error-handler.service';
import { CacheService } from '../shared/cache/cache.service';
import { CACHE_TTL, CACHE_PREFIXES, CACHE_KEYS } from '../shared/cache/cache.constants';
import { PRODUCTS_CONSTANTS } from './products.constants';

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

interface PaginationOptions {
  page: number;
  limit: number;
}

interface ProductListResponse {
  products: IProduct[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

@Injectable()
export class ProductsService implements IProductService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly imageOptimizationService: ImageOptimizationService,
    private readonly errorHandlerService: FileUploadErrorHandlerService,
    private readonly cacheService: CacheService,
  ) {}

  async createProduct(dto: ICreateProductDto, files?: Express.Multer.File[]): Promise<IProduct> {
    if (files && files.length > 0) {
      // Валидируем загруженные файлы с graceful fallback
      const validationResults = await Promise.all(
        files.map(file => this.errorHandlerService.validateFileWithFallback(file))
      );

      const validFiles = files.filter((_, index) => validationResults[index].valid);
      
      if (validFiles.length === 0) {
        throw new BadRequestException(PRODUCTS_CONSTANTS.ERRORS.NO_VALID_FILES);
      }

      // Обрабатываем изображения с обработкой ошибок
      const uploadResult = await this.errorHandlerService.handleUploadErrors(
        validFiles,
        async (file) => {
          const result = await this.imageOptimizationService.processAndSave(
            file.buffer,
            file.originalname,
            {
              quality: 80,
              maxWidth: 1600,
              maxHeight: 1600,
              format: 'webp',
              generateThumbnail: true,
              thumbnailSize: 300
            }
          );
          return result.mainPath;
        }
      );

      // Получаем успешно загруженные файлы
      const successfulUploads = uploadResult.filter(r => r.success);
      dto.img = successfulUploads.map(r => r.filePath!);

      if (dto.img.length === 0) {
        throw new BadRequestException(PRODUCTS_CONSTANTS.ERRORS.UPLOAD_FAILED);
      }
    }

    return this.create(dto);
  }

  async create(data: ICreateProductDto): Promise<IProduct> {
    const { categoryId, subCategoryId, typeId, ...rest } = data;
    
    // Валидация входных данных
    this.validateProductData(data);
    
    // Создаем объект для передачи в репозиторий
    const productData: any = { ...rest };
    
    // Найти объекты по id через репозиторий с параллельными запросами
    const [category, subCategory, type] = await Promise.all([
      categoryId ? this.productsRepository.findCategoryById(categoryId) : null,
      subCategoryId ? this.productsRepository.findSubCategoryById(subCategoryId) : null,
      typeId ? this.productsRepository.findTypeById(typeId) : null
    ]);

    if (categoryId && !category) {
      throw new BadRequestException(PRODUCTS_CONSTANTS.ERRORS.CATEGORY_NOT_FOUND);
    }
    if (subCategoryId && !subCategory) {
      throw new BadRequestException(PRODUCTS_CONSTANTS.ERRORS.SUB_CATEGORY_NOT_FOUND);
    }
    if (typeId && !type) {
      throw new BadRequestException(PRODUCTS_CONSTANTS.ERRORS.TYPE_NOT_FOUND);
    }

    if (category) productData.category = category;
    if (subCategory) productData.subCategory = subCategory;
    if (type) productData.type = type;

    const product = await this.productsRepository.createProduct(productData);
    
    // Инвалидируем кеш после создания продукта
    await this.invalidateProductCache();
    
    return product;
  }

  async findAll(
    filters?: ProductFilters,
    sort?: ProductSort,
    pagination?: PaginationOptions
  ): Promise<ProductListResponse> {
    const { page = 1, limit = PRODUCTS_CONSTANTS.DEFAULT_PAGE_SIZE } = pagination || {};
    const defaultSort: ProductSort = { field: 'createdAt', order: 'DESC' };
    const finalSort = sort || defaultSort;

    // Создаем ключ кеша на основе фильтров и сортировки
    const cacheKey = this.generateCacheKey('products', { filters, sort: finalSort, page, limit });

    const cachedResult = await this.cacheService.get(cacheKey, CACHE_PREFIXES.PRODUCTS);
    if (cachedResult) {
      return cachedResult as ProductListResponse;
    }

    const result = await this.productsRepository.findProductsWithFilters(
      filters,
      finalSort,
      page,
      limit
    );

    // Кешируем результат
    await this.cacheService.set(
      cacheKey,
      result,
      { 
        ttl: CACHE_TTL.PRODUCTS, 
        prefix: CACHE_PREFIXES.PRODUCTS 
      }
    );

    return result;
  }

  async findOne(id: number): Promise<IProduct | null> {
    return this.cacheService.getOrSet(
      `${CACHE_KEYS.PRODUCT_BY_ID}:${id}`,
      () => this.productsRepository.findProductById(id),
      { 
        ttl: CACHE_TTL.PRODUCTS, 
        prefix: CACHE_PREFIXES.PRODUCTS 
      }
    );
  }

  async update(id: number, data: Partial<ICreateProductDto>): Promise<IProduct> {
    const product = await this.productsRepository.findProductById(id);
    if (!product) {
      throw new ResourceNotFoundException('Продукт', id);
    }
    
    // Валидация обновляемых данных
    this.validateProductData(data, true);
    
    const updatedProduct = await this.productsRepository.updateProduct(id, data);
    if (!updatedProduct) {
      throw new ConflictException(PRODUCTS_CONSTANTS.ERRORS.UPDATE_FAILED);
    }

    // Инвалидируем кеш после обновления
    await this.invalidateProductCacheById(id);
    
    return updatedProduct;
  }

  async delete(id: number): Promise<void> {
    const product = await this.productsRepository.findProductById(id);
    if (!product) {
      throw new ResourceNotFoundException('Продукт', id);
    }

    await this.productsRepository.removeProduct(id);
    
    // Инвалидируем кеш после удаления
    await this.invalidateProductCacheById(id);
  }

  async deleteMultiple(ids: number[]): Promise<{ deleted: number; failed: number }> {
    if (!ids.length) {
      throw new BadRequestException(PRODUCTS_CONSTANTS.ERRORS.NO_IDS_PROVIDED);
    }

    if (ids.length > PRODUCTS_CONSTANTS.MAX_BATCH_SIZE) {
      throw new BadRequestException(PRODUCTS_CONSTANTS.ERRORS.BATCH_SIZE_EXCEEDED);
    }

    const results = await Promise.allSettled(
      ids.map(id => this.delete(id))
    );

    const deleted = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    // Инвалидируем кеш после массового удаления
    await this.invalidateProductCache();

    return { deleted, failed };
  }

  async getCatalog(): Promise<ICategory[]> {
    return this.cacheService.getOrSet(
      'catalog:full',
      async () => {
        const categories = await this.findAllCategories();
        const [newProducts, discountedProducts] = await Promise.all([
          this.findNewProducts(),
          this.findDiscountedProducts()
        ]);

        // Бизнес-логика: добавление новинок и скидок в соответствующие категории
        const novinkiCategory = categories.find(c => c.name === 'Новинки');
        if (novinkiCategory) {
          novinkiCategory.products = newProducts;
        }

        const skidkiCategory = categories.find(c => c.name === 'Скидки');
        if (skidkiCategory) {
          skidkiCategory.products = discountedProducts;
        }
        
        return categories;
      },
      { 
        ttl: CACHE_TTL.CATALOG, 
        prefix: CACHE_PREFIXES.CATALOG 
      }
    );
  }

  async findByIds(ids: number[]): Promise<IProduct[]> {
    if (!ids.length) return [];
    
    if (ids.length > PRODUCTS_CONSTANTS.MAX_BATCH_SIZE) {
      throw new BadRequestException(PRODUCTS_CONSTANTS.ERRORS.BATCH_SIZE_EXCEEDED);
    }

    return this.productsRepository.findProductsByIds(ids);
  }

  async searchProducts(query: string, limit: number = 10): Promise<IProduct[]> {
    if (!query || query.trim().length < PRODUCTS_CONSTANTS.MIN_SEARCH_LENGTH) {
      throw new BadRequestException(PRODUCTS_CONSTANTS.ERRORS.SEARCH_TOO_SHORT);
    }

    const cacheKey = `search:${query}:${limit}`;
    return this.cacheService.getOrSet(
      cacheKey,
      () => this.productsRepository.searchProducts(query, limit),
      { 
        ttl: CACHE_TTL.SEARCH, 
        prefix: CACHE_PREFIXES.SEARCH 
      }
    );
  }

  async getProductStats(): Promise<{
    total: number;
    available: number;
    new: number;
    discounted: number;
    categories: number;
  }> {
    return this.cacheService.getOrSet(
      'stats:products',
      () => this.productsRepository.getProductStats(),
      { 
        ttl: CACHE_TTL.STATS, 
        prefix: CACHE_PREFIXES.STATS 
      }
    );
  }

  /**
   * Получить все категории с кешированием
   */
  async findAllCategories(): Promise<ICategory[]> {
    return this.cacheService.getOrSet(
      CACHE_KEYS.ALL_CATEGORIES,
      () => this.productsRepository.findAllCategories(),
      { 
        ttl: CACHE_TTL.CATEGORIES, 
        prefix: CACHE_PREFIXES.CATEGORIES 
      }
    );
  }

  /**
   * Получить категорию по ID с кешированием
   */
  async findCategoryById(id: number): Promise<ICategory | null> {
    return this.cacheService.getOrSet(
      `${CACHE_KEYS.CATEGORY_BY_ID}:${id}`,
      () => this.productsRepository.findCategoryById(id),
      { 
        ttl: CACHE_TTL.CATEGORIES, 
        prefix: CACHE_PREFIXES.CATEGORIES 
      }
    );
  }

  /**
   * Получить новые продукты с кешированием
   */
  async findNewProducts(): Promise<IProduct[]> {
    return this.cacheService.getOrSet(
      CACHE_KEYS.NEW_PRODUCTS,
      () => this.productsRepository.findNewProducts(),
      { 
        ttl: CACHE_TTL.PRODUCTS, 
        prefix: CACHE_PREFIXES.PRODUCTS 
      }
    );
  }

  /**
   * Получить продукты со скидками с кешированием
   */
  async findDiscountedProducts(): Promise<IProduct[]> {
    return this.cacheService.getOrSet(
      CACHE_KEYS.DISCOUNTED_PRODUCTS,
      () => this.productsRepository.findDiscountedProducts(),
      { 
        ttl: CACHE_TTL.PRODUCTS, 
        prefix: CACHE_PREFIXES.PRODUCTS 
      }
    );
  }

  /**
   * Валидация данных продукта
   */
  private validateProductData(data: Partial<ICreateProductDto>, isUpdate: boolean = false): void {
    if (!isUpdate || data.name_eng !== undefined) {
      if (!data.name_eng || data.name_eng.trim().length < PRODUCTS_CONSTANTS.MIN_NAME_LENGTH) {
        throw new BadRequestException(PRODUCTS_CONSTANTS.ERRORS.INVALID_NAME_ENG);
      }
    }

    if (!isUpdate || data.name_ru !== undefined) {
      if (!data.name_ru || data.name_ru.trim().length < PRODUCTS_CONSTANTS.MIN_NAME_LENGTH) {
        throw new BadRequestException(PRODUCTS_CONSTANTS.ERRORS.INVALID_NAME_RU);
      }
    }

    if (!isUpdate || data.size !== undefined) {
      if (!data.size || !Array.isArray(data.size) || data.size.length === 0) {
        throw new BadRequestException(PRODUCTS_CONSTANTS.ERRORS.INVALID_SIZE);
      }

      for (const sizeItem of data.size) {
        if (!sizeItem.size || sizeItem.price <= 0) {
          throw new BadRequestException(PRODUCTS_CONSTANTS.ERRORS.INVALID_SIZE_ITEM);
        }
      }
    }

    if (!isUpdate || data.colors !== undefined) {
      if (!data.colors || !Array.isArray(data.colors) || data.colors.length === 0) {
        throw new BadRequestException(PRODUCTS_CONSTANTS.ERRORS.INVALID_COLORS);
      }
    }
  }

  /**
   * Генерация ключа кеша
   */
  private generateCacheKey(prefix: string, params: any): string {
    const sortedParams = JSON.stringify(params, Object.keys(params).sort());
    return `${prefix}:${Buffer.from(sortedParams).toString('base64')}`;
  }

  /**
   * Инвалидировать кеш продуктов
   */
  private async invalidateProductCache(): Promise<void> {
    await Promise.all([
      this.cacheService.deleteByPrefix(CACHE_PREFIXES.PRODUCTS),
      this.cacheService.deleteByPrefix(CACHE_PREFIXES.CATEGORIES),
      this.cacheService.deleteByPrefix(CACHE_PREFIXES.SEARCH),
      this.cacheService.deleteByPrefix(CACHE_PREFIXES.STATS)
    ]);
  }

  /**
   * Инвалидировать кеш конкретного продукта
   */
  async invalidateProductCacheById(id: number): Promise<void> {
    await Promise.all([
      this.cacheService.delete(`${CACHE_KEYS.PRODUCT_BY_ID}:${id}`, CACHE_PREFIXES.PRODUCTS),
      this.cacheService.deleteByPrefix(CACHE_PREFIXES.SEARCH),
      this.cacheService.deleteByPrefix(CACHE_PREFIXES.STATS)
    ]);
  }
}
