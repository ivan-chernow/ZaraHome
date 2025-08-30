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
        throw new BadRequestException('Нет валидных файлов для загрузки');
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
        throw new BadRequestException('Не удалось загрузить ни одного изображения');
      }
    }

    return this.create(dto);
  }

  async create(data: ICreateProductDto): Promise<IProduct> {
    const { categoryId, subCategoryId, typeId, ...rest } = data;
    
    // Создаем объект для передачи в репозиторий
    const productData: any = { ...rest };
    
    // Найти объекты по id через репозиторий
    if (categoryId) {
      const category = await this.productsRepository.findCategoryById(categoryId);
      if (category) productData.category = category;
    }
    if (subCategoryId) {
      const subCategory = await this.productsRepository.findSubCategoryById(subCategoryId);
      if (subCategory) productData.subCategory = subCategory;
    }
    if (typeId) {
      const type = await this.productsRepository.findTypeById(typeId);
      if (type) productData.type = type;
    }

    const product = await this.productsRepository.createProduct(productData);
    
    // Инвалидируем кеш после создания продукта
    await this.invalidateProductCache();
    
    return product;
  }

  async findAll(): Promise<IProduct[]> {
    return this.cacheService.getOrSet(
      CACHE_KEYS.ALL_PRODUCTS,
      () => this.productsRepository.findAllProducts(),
      { 
        ttl: CACHE_TTL.PRODUCTS, 
        prefix: CACHE_PREFIXES.PRODUCTS 
      }
    );
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
    
    const updatedProduct = await this.productsRepository.updateProduct(id, data);
    if (!updatedProduct) {
      throw new ConflictException('Не удалось обновить продукт');
    }

    // Инвалидируем кеш после обновления
    await this.invalidateProductCacheById(id);
    
    return updatedProduct;
  }

  async delete(id: number): Promise<void> {
    await this.productsRepository.removeProduct(id);
    
    // Инвалидируем кеш после удаления
    await this.invalidateProductCacheById(id);
  }

  async getCatalog(): Promise<ICategory[]> {
    return this.cacheService.getOrSet(
      'catalog:full',
      async () => {
        const categories = await this.findAllCategories();
        const newProducts = await this.findNewProducts();
        const discountedProducts = await this.findDiscountedProducts();

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
    return this.productsRepository.findProductsByIds(ids);
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
   * Инвалидировать кеш продуктов
   */
  private async invalidateProductCache(): Promise<void> {
    await this.cacheService.deleteByPrefix(CACHE_PREFIXES.PRODUCTS);
    await this.cacheService.deleteByPrefix(CACHE_PREFIXES.CATEGORIES);
  }

  /**
   * Инвалидировать кеш конкретного продукта
   */
  async invalidateProductCacheById(id: number): Promise<void> {
    await this.cacheService.delete(`${CACHE_KEYS.PRODUCT_BY_ID}:${id}`, CACHE_PREFIXES.PRODUCTS);
  }
}
