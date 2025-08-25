# Users Module

Модуль для управления пользователями, профилями и адресами доставки.

## Структура

```
users/
├── dto/                    # Data Transfer Objects
│   ├── user.dto.ts
│   ├── profile.dto.ts
│   ├── delivery-address.dto.ts
│   └── index.ts
├── entity/                 # Сущности TypeORM
│   ├── user.entity.ts
│   ├── user-profile.entity.ts
│   ├── delivery-address.entity.ts
│   └── index.ts
├── service/                # Сервисы
│   ├── user.service.ts
│   ├── admin.service.ts
│   ├── profile.service.ts
│   └── index.ts
├── controller/             # Контроллеры
│   ├── user.controller.ts
│   ├── admin.controller.ts
│   ├── profile.controller.ts
│   └── index.ts
├── admin/                  # Административные функции
│   ├── admin.controller.ts
│   └── admin.service.ts
├── user/                   # Пользовательские функции
│   ├── user.controller.ts
│   ├── user.service.ts
│   ├── dto/
│   └── entity/
├── users.module.ts         # Основной модуль
├── index.ts                # Главный экспорт
└── README.md               # Документация
```

## Компоненты

### DTO
- **`UserDto`** - данные пользователя
- **`ProfileDto`** - данные профиля
- **`DeliveryAddressDto`** - данные адреса доставки

### Entity
- **`UserEntity`** - основная сущность пользователя
- **`UserProfileEntity`** - профиль пользователя
- **`DeliveryAddressEntity`** - адрес доставки

### Service
- **`UserService`** - сервис для работы с пользователями
- **`AdminService`** - сервис для административных функций
- **`ProfileService`** - сервис для работы с профилями

### Controller
- **`UserController`** - API endpoints для пользователей
- **`AdminController`** - API endpoints для администраторов
- **`ProfileController`** - API endpoints для профилей

## API Endpoints

### Users
- `GET /users` - получить всех пользователей (admin)
- `GET /users/:id` - получить пользователя по ID
- `PUT /users/:id` - обновить пользователя
- `DELETE /users/:id` - удалить пользователя (admin)

### Profile
- `GET /users/profile` - получить профиль текущего пользователя
- `PUT /users/profile` - обновить профиль
- `POST /users/profile/avatar` - загрузить аватар

### Delivery Address
- `GET /users/delivery-addresses` - получить адреса доставки
- `POST /users/delivery-addresses` - создать адрес доставки
- `PUT /users/delivery-addresses/:id` - обновить адрес доставки
- `DELETE /users/delivery-addresses/:id` - удалить адрес доставки

### Admin
- `GET /users/admin/stats` - статистика пользователей
- `POST /users/admin/block/:id` - заблокировать пользователя
- `POST /users/admin/unblock/:id` - разблокировать пользователя
- `POST /users/admin/change-role/:id` - изменить роль пользователя

## Использование

```typescript
import { UsersModule } from './users';

@Module({
  imports: [UsersModule],
  // ...
})
export class AppModule {}
```

## Зависимости

- `TypeOrmModule` - для работы с базой данных
- `AuthModule` - для аутентификации и авторизации
- `CommonModule` - общие утилиты

## Особенности

- Управление профилями пользователей
- Адреса доставки
- Административные функции
- Ролевая авторизация
- Валидация данных
- Автоматическая генерация Swagger документации
