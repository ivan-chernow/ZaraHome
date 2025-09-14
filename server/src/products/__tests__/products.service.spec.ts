import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from '../products.service';
import { ProductsRepository } from '../products.repository';
import { ImageOptimizationService } from '../../shared/services/image-optimization.service';
import { FileUploadErrorHandlerService } from '../../shared/services/file-upload-error-handler.service';
import { CacheService } from '../../shared/cache/cache.service';

describe('ProductsService (unit)', () => {
  let service: ProductsService;
  let productsRepository: jest.Mocked<ProductsRepository>;
  let imageOptimizationService: jest.Mocked<ImageOptimizationService>;
  let errorHandlerService: jest.Mocked<FileUploadErrorHandlerService>;
  let cacheService: jest.Mocked<CacheService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: ProductsRepository,
          useValue: {
            findProductsWithFilters: jest.fn(),
            findProductById: jest.fn(),
            createProduct: jest.fn(),
            updateProduct: jest.fn(),
            removeProduct: jest.fn(),
            searchProducts: jest.fn(),
            findNewProducts: jest.fn(),
            findDiscountedProducts: jest.fn(),
            getProductStats: jest.fn(),
            findAllCategories: jest.fn(),
            findCategoryById: jest.fn(),
            findProductsByIds: jest.fn(),
          },
        },
        {
          provide: ImageOptimizationService,
          useValue: {
            processAndSave: jest.fn(),
          },
        },
        {
          provide: FileUploadErrorHandlerService,
          useValue: {
            validateFileWithFallback: jest.fn(),
            handleUploadErrors: jest.fn(),
          },
        },
        {
          provide: CacheService,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            getOrSet: jest.fn(),
            delete: jest.fn(),
            deleteByPrefix: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productsRepository = module.get(ProductsRepository);
    imageOptimizationService = module.get(ImageOptimizationService);
    errorHandlerService = module.get(FileUploadErrorHandlerService);
    cacheService = module.get(CacheService);
  });

  describe('findAll', () => {
    it('получение всех товаров', async () => {
      const products = [{ id: 1, name_ru: 'Product 1' }, { id: 2, name_ru: 'Product 2' }];
      const filters = { categoryId: 1 };
      const sort = { field: 'price' as const, order: 'ASC' as const };
      const pagination = { page: 1, limit: 10 };
      const expectedResult = { products, total: 2, page: 1, limit: 10, totalPages: 1, hasNext: false, hasPrev: false };
      
      cacheService.get.mockResolvedValue(null);
      productsRepository.findProductsWithFilters.mockResolvedValue(expectedResult as any);
      cacheService.set.mockResolvedValue(undefined);

      const result = await service.findAll(filters, sort, pagination);

      expect(productsRepository.findProductsWithFilters).toHaveBeenCalledWith(filters, sort, 1, 10);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('получение товара по ID', async () => {
      const product = { id: 1, name_ru: 'Product 1' };
      cacheService.getOrSet.mockResolvedValue(product as any);

      const result = await service.findOne(1);

      expect(cacheService.getOrSet).toHaveBeenCalled();
      expect(result).toEqual(product);
    });

    it('товар не найден', async () => {
      cacheService.getOrSet.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('создание товара', async () => {
      const productData = { 
        name_eng: 'New Product', 
        name_ru: 'Новый товар',
        description: 'Description',
        colors: ['red'],
        size: [{ size: 'M', price: 100 }],
        categoryId: 1,
        subCategoryId: 1,
        typeId: 1,
        deliveryDate: '2024-12-31',
        isAvailable: true,
      } as any;
      const createdProduct = { id: 1, ...productData };
      
      productsRepository.createProduct.mockResolvedValue(createdProduct as any);
      cacheService.deleteByPrefix.mockResolvedValue(undefined);

      const result = await service.create(productData);

      expect(productsRepository.createProduct).toHaveBeenCalledWith(productData);
      expect(result).toEqual(createdProduct);
    });
  });

  describe('update', () => {
    it('обновление товара', async () => {
      const id = 1;
      const updateData = { name_ru: 'Updated Product' };
      const existingProduct = { id: 1, name_ru: 'Old Product' };
      const updatedProduct = { id: 1, ...updateData };
      
      productsRepository.findProductById.mockResolvedValue(existingProduct as any);
      productsRepository.updateProduct.mockResolvedValue(updatedProduct as any);
      cacheService.deleteByPrefix.mockResolvedValue(undefined);

      const result = await service.update(id, updateData);

      expect(productsRepository.findProductById).toHaveBeenCalledWith(id);
      expect(productsRepository.updateProduct).toHaveBeenCalledWith(id, updateData);
      expect(result).toEqual(updatedProduct);
    });
  });

  describe('delete', () => {
    it('удаление товара', async () => {
      const id = 1;
      const existingProduct = { id: 1, name_ru: 'Product' };
      
      productsRepository.findProductById.mockResolvedValue(existingProduct as any);
      productsRepository.removeProduct.mockResolvedValue(undefined);
      cacheService.deleteByPrefix.mockResolvedValue(undefined);

      await service.delete(id);

      expect(productsRepository.findProductById).toHaveBeenCalledWith(id);
      expect(productsRepository.removeProduct).toHaveBeenCalledWith(id);
    });
  });

  describe('searchProducts', () => {
    it('поиск товаров', async () => {
      const searchResults = [{ id: 1, name_ru: 'Found Product' }];
      const query = 'search term';
      const limit = 10;
      
      cacheService.getOrSet.mockResolvedValue(searchResults as any);

      const result = await service.searchProducts(query, limit);

      expect(cacheService.getOrSet).toHaveBeenCalled();
      expect(result).toEqual(searchResults);
    });
  });

  it('findAll: должен вернуть продукты с фильтрами и пагинацией', async () => {
    const mockProducts = [
      { id: 1, name_ru: 'Товар 1', name_eng: 'Product 1', price: 100, isAvailable: true } as any,
      { id: 2, name_ru: 'Товар 2', name_eng: 'Product 2', price: 200, isAvailable: true } as any
    ];
    
    productsRepository.findProductsWithFilters.mockResolvedValue({
      products: mockProducts,
      total: 2,
      page: 1,
      limit: 10,
      totalPages: 1,
      hasNext: false,
      hasPrev: false
    });

    const result = await service.findAll({} as any);
    
    expect(result.products).toHaveLength(2);
    expect(result.total).toBe(2);
    expect(productsRepository.findProductsWithFilters).toHaveBeenCalled();
  });

  it('findOne: должен вернуть продукт по ID', async () => {
    const mockProduct = { id: 1, name_ru: 'Товар 1', price: 100, isAvailable: true } as any;
    productsRepository.findProductById.mockResolvedValue(mockProduct);
    cacheService.getOrSet.mockImplementation((key, fn) => fn());

    const result = await service.findOne(1);
    
    expect(result).toEqual(mockProduct);
    expect(productsRepository.findProductById).toHaveBeenCalledWith(1);
  });

  it('findOne: должен вернуть null если продукт не найден', async () => {
    productsRepository.findProductById.mockResolvedValue(null);
    cacheService.getOrSet.mockImplementation((key, fn) => fn());

    const result = await service.findOne(999);
    expect(result).toBeNull();
  });

  it('create: должен создать новый продукт', async () => {
    const productData = {
      name_ru: 'Новый товар',
      name_eng: 'New Product',
      price: 150,
      categoryId: 1,
      subCategoryId: 1,
      typeId: 1,
      colors: ['красный', 'синий'],
      size: [{ size: 'M', price: 150 }],
      deliveryDate: '2024-12-31',
      description: 'Описание товара',
      isAvailable: true
    };

    const createdProduct = { id: 1, ...productData } as any;
    productsRepository.createProduct.mockResolvedValue(createdProduct);

    const result = await service.create(productData);
    
    expect(result).toEqual(createdProduct);
    expect(productsRepository.createProduct).toHaveBeenCalledWith(productData);
  });

  it('update: должен обновить продукт', async () => {
    const updateData = { name_ru: 'Обновленный товар', price: 200 };
    const updatedProduct = { id: 1, ...updateData } as any;
    
    productsRepository.findProductById.mockResolvedValue({ id: 1, name_ru: 'Старый товар' } as any);
    productsRepository.updateProduct.mockResolvedValue(updatedProduct);

    const result = await service.update(1, updateData);
    
    expect(result).toEqual(updatedProduct);
    expect(productsRepository.updateProduct).toHaveBeenCalledWith(1, updateData);
  });

  it('delete: должен удалить продукт', async () => {
    productsRepository.findProductById.mockResolvedValue({ id: 1, name_ru: 'Товар' } as any);
    productsRepository.removeProduct.mockResolvedValue(undefined);

    await service.delete(1);
    
    expect(productsRepository.removeProduct).toHaveBeenCalledWith(1);
  });
});
