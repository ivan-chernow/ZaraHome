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

  async createProduct(dto: ICreateProductDto, files?: Express.Multer.File[]): Promise<IProduct> {
    if (files && files.length > 0) {
      dto.img = await this.imageOptimizationService.processMany(files);
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
