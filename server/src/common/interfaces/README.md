# Общие интерфейсы (Common Interfaces)

Этот каталог содержит все общие интерфейсы, используемые в проекте ZaraHome ECOM.

## Структура интерфейсов

### 1. Базовые интерфейсы (Base Interfaces)
- **`base-entity.interface.ts`** - Базовые интерфейсы для сущностей
- **`repository.interface.ts`** - Интерфейсы для репозиториев

### 2. Продукты (Products)
- **`product.interface.ts`** - Интерфейсы для продуктов, категорий, подкатегорий и типов
  - `IProduct` - Основной интерфейс продукта
  - `ICategory` - Интерфейс категории
  - `ISubCategory` - Интерфейс подкатегории
  - `IType` - Интерфейс типа продукта
  - `IProductWithRelations` - Продукт с связанными данными

### 3. Пользователи (Users)
- **`user.interface.ts`** - Интерфейсы для пользователей и профилей
  - `IUser` - Основной интерфейс пользователя
  - `IUserProfile` - Профиль пользователя
  - `IDeliveryAddress` - Адрес доставки
  - `IUserWithRelations` - Пользователь с связанными данными

### 4. Корзина и избранное (Cart & Favorites)
- **`cart-favorites.interface.ts`** - Интерфейсы для корзины и избранного
  - `ICartItem` - Элемент корзины
  - `IFavoriteItem` - Элемент избранного
  - `ICartItemWithProduct` - Элемент корзины с продуктом
  - `IFavoriteItemWithProduct` - Элемент избранного с продуктом

### 5. Заказы (Orders)
- **`order.interface.ts`** - Интерфейсы для заказов
  - `IOrder` - Основной интерфейс заказа
  - `IOrderItem` - Элемент заказа
  - `IOrderWithItems` - Заказ с элементами
  - `IOrderItemWithProduct` - Элемент заказа с продуктом
  - `IOrderWithProductDetails` - Заказ с деталями продуктов

### 6. Промокоды (Promocodes)
- **`promocode.interface.ts`** - Интерфейсы для промокодов
  - `IPromocode` - Основной интерфейс промокода
  - `IPromocodeUsage` - Использование промокода
  - `IPromocodeWithUsage` - Промокод с использованием

### 7. DTO интерфейсы
- **`dto.interface.ts`** - Интерфейсы для Data Transfer Objects
  - `ICreateProductDto` - DTO для создания продукта
  - `IUpdateProductDto` - DTO для обновления продукта
  - `ICreateUserDto` - DTO для создания пользователя
  - `IUpdateUserDto` - DTO для обновления пользователя
  - `ICreateOrderDto` - DTO для создания заказа
  - `IUpdateOrderDto` - DTO для обновления заказа
  - `ICreatePromocodeDto` - DTO для создания промокода
  - `IUpdatePromocodeDto` - DTO для обновления промокода

### 8. Сервисные интерфейсы (Service Interfaces)
- **`service.interface.ts`** - Интерфейсы для сервисов
  - `IBaseService<T>` - Базовый интерфейс сервиса
  - `IProductService` - Интерфейс сервиса продуктов
  - `IUserService` - Интерфейс сервиса пользователей
  - `ICartService` - Интерфейс сервиса корзины
  - `IFavoritesService` - Интерфейс сервиса избранного
  - `IOrderService` - Интерфейс сервиса заказов
  - `IPromocodeService` - Интерфейс сервиса промокодов

### 9. Валидация (Validation)
- **`validation.interface.ts`** - Интерфейсы для валидации
  - `IValidationRule` - Правило валидации
  - `IValidationResult` - Результат валидации
  - `IValidationSchema` - Схема валидации
  - `IProductValidationSchema` - Схема валидации продукта
  - `IUserValidationSchema` - Схема валидации пользователя

### 10. HTTP и API
- **`api-response.interface.ts`** - Интерфейсы для API ответов
- **`authenticated-request.interface.ts`** - Интерфейсы для аутентифицированных запросов
- **`pagination.interface.ts`** - Интерфейсы для пагинации

### 11. Файлы
- **`file-upload.interface.ts`** - Интерфейсы для загрузки файлов

## Использование

Все интерфейсы экспортируются из основного файла `index.ts`:

```typescript
import { 
  IProduct, 
  IUser, 
  IOrder,
  IProductService 
} from 'src/common/interfaces';
```

## Принципы именования

- Все интерфейсы начинаются с заглавной буквы `I`
- Используются описательные имена на английском языке
- Для связанных интерфейсов используется общий префикс (например, `IProduct`, `IProductWithRelations`)

## Расширение интерфейсов

При добавлении новых интерфейсов:

1. Создайте файл в соответствующей категории
2. Добавьте экспорт в `index.ts`
3. Обновите эту документацию
4. Следуйте принципам именования
