# Auth Module

Модуль для аутентификации и авторизации пользователей.

## Структура

```
auth/
├── dto/                    # Data Transfer Objects
│   ├── login.dto.ts
│   ├── register.dto.ts
│   ├── reset-password.dto.ts
│   └── index.ts
├── entity/                 # Сущности TypeORM
│   ├── login.entity.ts
│   ├── reset-password.entity.ts
│   ├── email-verification.entity.ts
│   └── index.ts
├── service/                # Сервисы
│   ├── login.service.ts
│   ├── register.service.ts
│   ├── reset-password.service.ts
│   ├── jwt.service.ts
│   ├── email.service.ts
│   └── index.ts
├── controller/             # Контроллеры
│   ├── login.controller.ts
│   ├── register.controller.ts
│   ├── reset-password.controller.ts
│   └── index.ts
├── guard/                  # Guards
│   ├── roles.guard.ts
│   ├── jwt-auth.guard.ts
│   └── index.ts
├── decorator/              # Decorators
│   ├── roles.decorator.ts
│   ├── current-user.decorator.ts
│   ├── public.decorator.ts
│   └── index.ts
├── strategy/               # Passport Strategies
│   ├── jwt.strategy.ts
│   ├── local.strategy.ts
│   └── index.ts
├── jwt/                    # JWT утилиты
│   ├── jwt.module.ts
│   └── jwt.service.ts
├── auth.module.ts          # Основной модуль
├── index.ts                # Главный экспорт
└── README.md               # Документация
```

## Компоненты

### DTO
- **`LoginDto`** - данные для входа в систему
- **`RegisterDto`** - данные для регистрации
- **`ResetPasswordDto`** - данные для сброса пароля

### Entity
- **`LoginEntity`** - сущность для логинов
- **`ResetPasswordEntity`** - сущность для сброса паролей
- **`EmailVerificationEntity`** - сущность для верификации email

### Service
- **`LoginService`** - сервис для аутентификации
- **`RegisterService`** - сервис для регистрации
- **`ResetPasswordService`** - сервис для сброса паролей
- **`JwtService`** - сервис для работы с JWT токенами
- **`EmailService`** - сервис для отправки email

### Controller
- **`LoginController`** - API endpoints для входа
- **`RegisterController`** - API endpoints для регистрации
- **`ResetPasswordController`** - API endpoints для сброса паролей

### Guard
- **`RolesGuard`** - guard для проверки ролей
- **`JwtAuthGuard`** - guard для проверки JWT токенов

### Decorator
- **`@Roles()`** - декоратор для указания ролей
- **`@CurrentUser()`** - декоратор для получения текущего пользователя
- **`@Public()`** - декоратор для публичных endpoints

### Strategy
- **`JwtStrategy`** - стратегия для JWT аутентификации
- **`LocalStrategy`** - стратегия для локальной аутентификации

## API Endpoints

### Authentication
- `POST /auth/login` - вход в систему
- `POST /auth/register` - регистрация
- `POST /auth/logout` - выход из системы
- `POST /auth/refresh` - обновление токена

### Password Reset
- `POST /auth/reset-password/request` - запрос на сброс пароля
- `POST /auth/reset-password/reset` - сброс пароля
- `POST /auth/reset-password/verify` - верификация токена сброса

### Email Verification
- `POST /auth/verify-email` - верификация email
- `POST /auth/resend-verification` - повторная отправка верификации

## Использование

```typescript
import { AuthModule } from './auth';

@Module({
  imports: [AuthModule],
  // ...
})
export class AppModule {}
```

### Защита endpoints

```typescript
import { Controller, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, RolesGuard } from '../auth';
import { Roles } from '../auth';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  
  @Get('users')
  @Roles('admin')
  async getUsers() {
    // Только для админов
  }
}
```

## Зависимости

- `JwtModule` - для работы с JWT токенами
- `PassportModule` - для аутентификации
- `TypeOrmModule` - для работы с базой данных
- `EmailModule` - для отправки email
- `CommonModule` - общие утилиты

## Особенности

- JWT аутентификация
- Ролевая авторизация
- Верификация email
- Сброс паролей
- Защита endpoints
- Автоматическая генерация Swagger документации
