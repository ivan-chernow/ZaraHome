# Cart Module

Модуль для управления корзиной покупок пользователей.

## Структура

```
cart/
├── dto/                    # Data Transfer Objects
│   ├── cart-item.dto.ts
│   ├── add-to-cart.dto.ts
│   ├── update-cart-item.dto.ts
│   └── index.ts
├── entity/                 # Сущности TypeORM
│   ├── cart.entity.ts
│   └── index.ts
├── service/                # Сервисы
│   ├── cart.service.ts
│   └── index.ts
├── controller/             # Контроллеры
│   ├── cart.controller.ts
│   └── index.ts
├── cart.module.ts          # Основной модуль
├── index.ts                # Главный экспорт
└── README.md               # Документация
```

## Компоненты

### DTO
- **`CartItemDto`** - данные элемента корзины
- **`AddToCartDto`** - данные для добавления в корзину
- **`UpdateCartItemDto`** - данные для обновления элемента корзины

### Entity
- **`CartEntity`** - сущность корзины

### Service
- **`CartService`** - сервис для работы с корзиной

### Controller
- **`CartController`** - API endpoints для корзины

## API Endpoints

### Cart Management
- `GET /cart` - получить корзину пользователя
- `POST /cart/add` - добавить товар в корзину
- `PUT /cart/:id` - обновить количество товара
- `DELETE /cart/:id` - удалить товар из корзины
- `DELETE /cart/clear` - очистить корзину
- `GET /cart/summary` - получить сводку корзины

## Использование

```typescript
import { CartModule } from './cart';

@Module({
  imports: [CartModule],
  // ...
})
export class AppModule {}
```

## Зависимости

- `TypeOrmModule` - для работы с базой данных
- `AuthModule` - для аутентификации пользователей
- `ProductsModule` - для работы с продуктами
- `CommonModule` - общие утилиты

## Особенности

- Управление корзиной покупок
- Валидация количества товаров
- Проверка наличия товаров
- Автоматический пересчет стоимости
- Привязка к пользователю
- Автоматическая генерация Swagger документации
