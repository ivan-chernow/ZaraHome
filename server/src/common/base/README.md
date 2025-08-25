# Base Classes

Эта папка содержит базовые абстрактные классы для контроллеров, сервисов, репозиториев и DTO, которые предоставляют общую функциональность для всех модулей приложения.

## Структура

### `base.controller.ts`
Базовый абстрактный класс для всех контроллеров:
- **CRUD операции**: `findAll`, `findOne`, `create`, `update`, `remove`
- **Дополнительные методы**: `uploadFiles`, `search`, `getStats`
- **Swagger документация**: автоматическая генерация API документации
- **Валидация**: встроенная валидация параметров

### `base.service.ts`
Базовый абстрактный класс для всех сервисов:
- **CRUD операции**: `create`, `findAll`, `findOne`, `update`, `delete`
- **Расширенные методы**: `findByCondition`, `findWithPagination`, `softDelete`, `restore`
- **Обработка ошибок**: автоматическая обработка исключений
- **Статистика**: встроенные методы для получения статистики

### `base.repository.ts`
Базовый абстрактный класс для всех репозиториев:
- **QueryBuilder**: создание сложных SQL запросов
- **Отношения**: работа с связанными данными
- **Поиск**: текстовый поиск, поиск по диапазонам
- **Агрегация**: подсчет, группировка, статистика
- **Транзакции**: выполнение операций в транзакциях

### `base.dto.ts`
Базовые DTO классы с валидацией:
- **BaseCreateDto**: базовый DTO для создания
- **BaseUpdateDto**: базовый DTO для обновления
- **PaginationDto**: пагинация с валидацией
- **SortDto**: сортировка с валидацией
- **FilterDto**: фильтрация с валидацией
- **FileDto**: работа с файлами

### `base.exceptions.ts`
Базовые классы исключений:
- **BusinessException**: базовый класс для бизнес-логики
- **ResourceNotFoundException**: ресурс не найден
- **ConflictException**: конфликт данных
- **ValidationException**: ошибка валидации
- **UnauthorizedException**: неавторизованный доступ
- **ForbiddenException**: доступ запрещен

## Использование

### Создание контроллера

```typescript
import { Controller } from '@nestjs/common';
import { BaseController } from '../common/base';
import { Product, CreateProductDto, UpdateProductDto } from '../common/interfaces';

@Controller('products')
export class ProductsController extends BaseController<Product, CreateProductDto, UpdateProductDto> {
  
  // Реализация абстрактных методов
  async findAll(page: number, limit: number) {
    // Ваша логика
  }
  
  async findOne(id: string) {
    // Ваша логика
  }
  
  // ... остальные методы
}
```

### Создание сервиса

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../common/base';
import { Product, CreateProductDto, UpdateProductDto } from '../common/interfaces';
import { ProductEntity } from './product.entity';

@Injectable()
export class ProductsService extends BaseService<Product, CreateProductDto, UpdateProductDto> {
  
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>
  ) {
    super(productRepository);
  }
  
  // Дополнительные методы
  async getProductsByCategory(categoryId: number) {
    return this.findByCondition({ categoryId } as any);
  }
}
```

### Создание репозитория

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../common/base';
import { ProductEntity } from './product.entity';

@Injectable()
export class ProductsRepository extends BaseRepository<ProductEntity> {
  
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>
  ) {
    super(productRepository);
  }
  
  // Дополнительные методы
  async findActiveProducts() {
    return this.findByCondition({ isActive: true } as any);
  }
}
```

### Использование DTO

```typescript
import { Body, Query } from '@nestjs/common';
import { PaginationDto, SortDto, FilterDto } from '../common/base';

@Controller('products')
export class ProductsController {
  
  @Get()
  async findAll(
    @Query() pagination: PaginationDto,
    @Query() sort: SortDto,
    @Query() filter: FilterDto
  ) {
    // Автоматическая валидация параметров
    const { page, limit } = pagination;
    const { sortBy, sortOrder } = sort;
    const { search, startDate, endDate } = filter;
    
    // Ваша логика
  }
}
```

### Использование исключений

```typescript
import { ResourceNotFoundException, ConflictException } from '../common/base';

export class ProductsService {
  
  async findOne(id: number) {
    const product = await this.repository.findOne(id);
    if (!product) {
      throw new ResourceNotFoundException('Продукт', id);
    }
    return product;
  }
  
  async create(data: CreateProductDto) {
    const existing = await this.repository.findOneByCondition({
      where: { name: data.name }
    });
    
    if (existing) {
      throw new ConflictException('Продукт с таким именем уже существует');
    }
    
    return this.repository.create(data);
  }
}
```

## Преимущества

1. **Переиспользование кода** - общая функциональность в одном месте
2. **Консистентность** - единообразное поведение во всех модулях
3. **DRY принцип** - избежание дублирования кода
4. **Легкость поддержки** - изменения в одном месте применяются везде
5. **Стандартизация** - единые подходы к решению задач
6. **Быстрая разработка** - готовые базовые классы для использования

## Расширение

Все базовые классы можно расширять, добавляя новые методы или переопределяя существующие:

```typescript
export class CustomService extends BaseService<Product, CreateProductDto, UpdateProductDto> {
  
  // Переопределение базового метода
  async create(data: CreateProductDto): Promise<Product> {
    // Дополнительная логика перед созданием
    const product = await super.create(data);
    // Дополнительная логика после создания
    return product;
  }
  
  // Новые методы
  async getPopularProducts() {
    // Ваша логика
  }
}
```
