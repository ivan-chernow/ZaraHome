import { Injectable, BadRequestException } from '@nestjs/common';
import { ResourceNotFoundException, ConflictException } from 'src/common/base/base.exceptions';
import { ProductsRepository } from './products.repository';
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
import { ImageOptimizationService } from 'src/shared/services/image-optimization.service';
import { validateUploadedFiles } from 'src/shared/upload/file-upload.helper';
import { FileUploadErrorHandlerService } from 'src/shared/services/file-upload-error-handler.service';

@Injectable()
export class ProductsService implements IProductService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly imageOptimizationService: ImageOptimizationService,
    private readonly errorHandlerService: FileUploadErrorHandlerService,
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

    return this.productsRepository.createProduct(productData);
  }

  async findAll(): Promise<IProduct[]> {
    return this.productsRepository.findAllProducts();
  }

  async findOne(id: number): Promise<IProduct | null> {
    return this.productsRepository.findProductById(id);
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
    return updatedProduct;
  }

  async delete(id: number): Promise<void> {
    await this.productsRepository.removeProduct(id);
  }

  async getCatalog(): Promise<ICategory[]> {
    const categories = await this.productsRepository.findAllCategories();
    const newProducts = await this.productsRepository.findNewProducts();
    const discountedProducts = await this.productsRepository.findDiscountedProducts();

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
  }

  async findByIds(ids: number[]): Promise<IProduct[]> {
    return this.productsRepository.findProductsByIds(ids);
  }
}
