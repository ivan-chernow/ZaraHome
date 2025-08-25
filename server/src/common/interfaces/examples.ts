/**
 * Примеры использования общих интерфейсов
 * Этот файл демонстрирует, как правильно использовать все созданные интерфейсы
 */

import { 
  // Product interfaces
  IProduct,
  ICategory,
  ISubCategory,
  IType,
  IProductWithRelations,
  
  // User interfaces
  IUser,
  IUserProfile,
  IDeliveryAddress,
  IUserWithRelations,
  
  // Cart & Favorites interfaces
  ICartItem,
  IFavoriteItem,
  ICartItemWithProduct,
  IFavoriteItemWithProduct,
  
  // Order interfaces
  IOrder,
  IOrderItem,
  IOrderWithItems,
  IOrderItemWithProduct,
  IOrderWithProductDetails,
  
  // Promocode interfaces
  IPromocode,
  IPromocodeUsage,
  IPromocodeWithUsage,
  
  // DTO interfaces
  ICreateProductDto,
  IUpdateProductDto,
  ICreateUserDto,
  IUpdateUserDto,
  ICreateOrderDto,
  IUpdateOrderDto,
  ICreatePromocodeDto,
  IUpdatePromocodeDto,
  
  // Service interfaces
  IBaseService,
  IProductService,
  IUserService,
  ICartService,
  IFavoritesService,
  IOrderService,
  IPromocodeService,
  
  // Validation interfaces
  IValidationRule,
  IValidationResult,
  IValidationSchema,
  IProductValidationSchema,
  IUserValidationSchema,
  
  // API interfaces
  ApiResponse,
  PaginatedResponse,
  ErrorResponse,
  PaginationOptions,
  PaginatedResult,
  
  // Base interfaces
  BaseEntity,
  SoftDeleteEntity,
  AuditableEntity,
  RepositoryInterface,
  
  // File interfaces
  FileUploadOptions,
  FileUploadResult,
  ImageUploadOptions,
  
  // Auth interfaces
  AuthenticatedUser,
  AuthenticatedRequest
} from './index';

// Пример создания продукта
const createProductExample = (): ICreateProductDto => {
  return {
    name_eng: "Classic T-Shirt",
    name_ru: "Классическая футболка",
    img: ["tshirt1.jpg", "tshirt2.jpg"],
    colors: ["white", "black", "blue"],
    size: [
      { size: "S", price: 1500 },
      { size: "M", price: 1500 },
      { size: "L", price: 1500 }
    ],
    deliveryDate: "2024-01-15",
    description: "Классическая хлопковая футболка высокого качества",
    isNew: true,
    discount: 0,
    isAvailable: true,
    categoryId: 1,
    subCategoryId: 2,
    typeId: 3
  };
};

// Пример создания пользователя
const createUserExample = (): ICreateUserDto => {
  return {
    email: "user@example.com",
    password: "securePassword123",
    role: "USER"
  };
};

// Пример создания заказа
const createOrderExample = (): ICreateOrderDto => {
  return {
    userId: 1,
    items: [
      {
        productId: 1,
        quantity: 2,
        price: 1500,
        size: "M",
        color: "white"
      }
    ],
    deliveryAddress: "ул. Примерная, д. 123, Москва",
    totalAmount: 3000
  };
};

// Пример API ответа
const apiResponseExample = (): ApiResponse<IProduct> => {
  return {
    success: true,
    data: {
      id: 1,
      name_eng: "Classic T-Shirt",
      name_ru: "Классическая футболка",
      img: ["tshirt1.jpg"],
      colors: ["white"],
      size: [{ size: "M", price: 1500 }],
      deliveryDate: "2024-01-15",
      description: "Классическая хлопковая футболка",
      isNew: true,
      discount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      isAvailable: true
    },
    message: "Продукт успешно создан"
  };
};

// Пример пагинации
const paginationExample = (): PaginatedResult<IProduct> => {
  return {
    items: [],
    total: 100,
    page: 1,
    limit: 20,
    totalPages: 5
  };
};

// Пример валидации
const validationExample = (): IValidationResult => {
  return {
    isValid: true,
    errors: []
  };
};

// Пример сервиса
class ExampleProductService implements IProductService {
  async create(data: ICreateProductDto): Promise<IProduct> {
    // Реализация создания продукта
    throw new Error("Method not implemented.");
  }

  async findAll(): Promise<IProduct[]> {
    // Реализация получения всех продуктов
    throw new Error("Method not implemented.");
  }

  async findOne(id: number): Promise<IProduct | null> {
    // Реализация получения продукта по ID
    throw new Error("Method not implemented.");
  }

  async update(id: number, data: any): Promise<IProduct> {
    // Реализация обновления продукта
    throw new Error("Method not implemented.");
  }

  async delete(id: number): Promise<void> {
    // Реализация удаления продукта
    throw new Error("Method not implemented.");
  }

  async getCatalog(): Promise<ICategory[]> {
    // Реализация получения каталога
    throw new Error("Method not implemented.");
  }

  async findByIds(ids: number[]): Promise<IProduct[]> {
    // Реализация получения продуктов по ID
    throw new Error("Method not implemented.");
  }
}

// Пример репозитория
class ExampleRepository<T> implements RepositoryInterface<T> {
  async findOne(id: number): Promise<T | null> {
    throw new Error("Method not implemented.");
  }

  async findById(id: number): Promise<T | null> {
    throw new Error("Method not implemented.");
  }

  async findAll(): Promise<T[]> {
    throw new Error("Method not implemented.");
  }

  async create(data: Partial<T>): Promise<T> {
    throw new Error("Method not implemented.");
  }

  async save(entity: T): Promise<T> {
    throw new Error("Method not implemented.");
  }

  async update(id: number, data: Partial<T>): Promise<T> {
    throw new Error("Method not implemented.");
  }

  async delete(id: number): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

// Экспорт примеров для использования в тестах или документации
export {
  createProductExample,
  createUserExample,
  createOrderExample,
  apiResponseExample,
  paginationExample,
  validationExample,
  ExampleProductService,
  ExampleRepository
};
