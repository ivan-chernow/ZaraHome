import { Injectable } from '@nestjs/common';
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

@Injectable()
export class ProductsService implements IProductService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly imageOptimizationService: ImageOptimizationService,
  ) {}

  async createProduct(dto: ICreateProductDto, files?: Array<Express.Multer.File>): Promise<IProduct> {
    // Обработка файлов
    if (files && files.length > 0) {
      dto.img = await this.imageOptimizationService.processMany(files);
    }
    
    // Преобразуем строковые значения в числа
    if (dto.categoryId) dto.categoryId = parseInt(dto.categoryId as any);
    if (dto.subCategoryId) dto.subCategoryId = parseInt(dto.subCategoryId as any);
    if (dto.typeId) dto.typeId = parseInt(dto.typeId as any);
    
    // Преобразуем JSON-строки в объекты
    if (typeof dto.colors === 'string') {
      dto.colors = JSON.parse(dto.colors);
    }
    if (typeof dto.size === 'string') {
      dto.size = JSON.parse(dto.size);
    }

    // Преобразуем строковые булевы значения
    if (typeof dto.isNew === 'string') {
      dto.isNew = dto.isNew === 'true';
    }
    if (typeof dto.isAvailable === 'string') {
      dto.isAvailable = dto.isAvailable === 'true';
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
      throw new Error('Продукт не найден');
    }
    
    const updatedProduct = await this.productsRepository.updateProduct(id, data);
    if (!updatedProduct) {
      throw new Error('Не удалось обновить продукт');
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
