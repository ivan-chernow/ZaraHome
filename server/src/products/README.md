# Products Module

Модуль для управления продуктами, категориями и типами товаров.

## Структура

```
products/
├── dto/                    # Data Transfer Objects
│   ├── create-product.dto.ts
│   └── index.ts
├── entity/                 # Сущности TypeORM
│   ├── products.entity.ts
│   ├── category.entity.ts
│   ├── sub-category.entity.ts
│   ├── type.entity.ts
│   └── index.ts
├── service/                # Сервисы
│   ├── products.service.ts
│   └── index.ts
├── controller/             # Контроллеры
│   ├── products.controller.ts
│   └── index.ts
├── seed/                   # Сиды для базы данных
│   ├── categories.seed.ts
│   ├── sub-categories.seed.ts
│   ├── types.seed.ts
│   └── index.ts
├── products.module.ts      # Основной модуль
├── index.ts                # Главный экспорт
└── README.md               # Документация
```

## Компоненты

### DTO
- **`CreateProductDto`** - данные для создания продукта

### Entity
- **`ProductsEntity`** - основная сущность продукта
- **`CategoryEntity`** - категория товаров
- **`SubCategoryEntity`** - подкатегория товаров
- **`TypeEntity`** - тип товара

### Service
- **`ProductsService`** - бизнес-логика для работы с продуктами

### Controller
- **`ProductsController`** - API endpoints для продуктов

### Seed
- **`CategoriesSeed`** - начальные данные для категорий
- **`SubCategoriesSeed`** - начальные данные для подкатегорий
- **`TypesSeed`** - начальные данные для типов

## API Endpoints

### Products
- `GET /products` - получить все продукты
- `GET /products/:id` - получить продукт по ID
- `POST /products` - создать новый продукт
- `PUT /products/:id` - обновить продукт
- `DELETE /products/:id` - удалить продукт
- `GET /products/catalog/all` - получить каталог

### Categories
- `GET /products/categories` - получить все категории
- `GET /products/categories/:id` - получить категорию по ID

### SubCategories
- `GET /products/subcategories` - получить все подкатегории
- `GET /products/subcategories/:id` - получить подкатегорию по ID

### Types
- `GET /products/types` - получить все типы
- `GET /products/types/:id` - получить тип по ID

## Использование

```typescript
import { ProductsModule } from './products';

@Module({
  imports: [ProductsModule],
  // ...
})
export class AppModule {}
```

## Зависимости

- `TypeOrmModule` - для работы с базой данных
- `MulterModule` - для загрузки файлов
- `CommonModule` - общие утилиты

## Особенности

- Поддержка загрузки изображений продуктов
- Каскадное удаление связанных данных
- Валидация входных данных
- Автоматическая генерация Swagger документации
