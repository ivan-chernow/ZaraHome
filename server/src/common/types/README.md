# Common Types

Эта папка содержит все общие типы TypeScript, используемые в серверной части приложения.

## Структура

### `utility.types.ts`
Базовые утилитарные типы:
- `DeepPartial<T>` - глубокое частичное преобразование типа
- `Optional<T, K>` - делает поля опциональными
- `RequiredFields<T, K>` - делает поля обязательными
- `Id` - тип для идентификаторов (number)
- `Email` - тип для email адресов (string)
- `Brand` - тип для брендов (string)
- `SortOrder` - порядок сортировки ('ASC' | 'DESC')
- `WhereCondition<T>` - условие для фильтрации

### `product.types.ts`
Типы для продуктов:
- `ProductSize` - размер и цена продукта
- `ProductColors` - цвета продукта
- `ProductImages` - изображения продукта
- `ProductStatus` - статус продукта
- `ProductCondition` - состояние продукта
- `ProductDiscount` - скидка на продукт
- `ProductMetadata` - метаданные продукта
- `ProductVariants` - варианты продукта
- `ProductFilters` - фильтры для продуктов
- `ProductSortOptions` - опции сортировки продуктов

### `user.types.ts`
Типы для пользователей:
- `UserStatus` - статус пользователя
- `UserPreferences` - предпочтения пользователя
- `UserAddress` - адрес доставки
- `UserProfile` - профиль пользователя
- `UserSecurity` - безопасность пользователя
- `UserActivity` - активность пользователя
- `UserPermissions` - права пользователя
- `UserFilters` - фильтры для пользователей
- `UserSortOptions` - опции сортировки пользователей

### `order.types.ts`
Типы для заказов и корзины:
- `OrderStatus` - статус заказа
- `OrderPriority` - приоритет заказа
- `OrderPaymentStatus` - статус оплаты
- `OrderPaymentMethod` - метод оплаты
- `OrderItem` - элемент заказа
- `OrderShipping` - доставка заказа
- `OrderBilling` - биллинг заказа
- `OrderHistory` - история заказа
- `OrderFilters` - фильтры для заказов
- `OrderSortOptions` - опции сортировки заказов
- `CartItem` - элемент корзины
- `CartSummary` - сводка корзины
- `CartValidation` - валидация корзины

## Использование

```typescript
import { 
  ProductSize, 
  UserStatus, 
  OrderStatus,
  DeepPartial,
  Id 
} from '../common/types';

// Пример использования
const productSize: ProductSize = {
  size: 'M',
  price: 1000
};

const userId: Id = 1;
const userStatus: UserStatus = 'active';
```

## Принципы

1. **Единый источник истины** - все типы определены в одном месте
2. **Переиспользование** - типы используются во всех модулях
3. **Консистентность** - единообразное именование и структура
4. **Расширяемость** - легко добавлять новые типы
5. **Документирование** - каждый тип имеет описание
