# 🔑 Login Module

Модуль для аутентификации пользователей в системе ZaraHome ECOM.

## 📁 Структура модуля

```
login/
├── 📄 login.module.ts           # Основной модуль
├── 📄 login.service.ts          # Бизнес-логика аутентификации
├── 📄 login.controller.ts       # API endpoints
├── 📄 README.md                 # Документация
├── 📁 dto/                      # Data Transfer Objects
│   ├── 📄 login.dto.ts         # DTO для входа
│   └── 📄 refresh-token.dto.ts # DTO для обновления токенов
├── 📁 entity/                   # Сущности TypeORM
│   └── 📄 refresh-token.entity.ts # Entity для refresh токенов
└── 📁 jwt/                      # JWT компоненты
    ├── 📄 jwt.strategy.ts       # Passport JWT стратегия
    └── 📄 jwt-auth.guard.ts    # JWT Guard для защиты
```

## 🚀 API Endpoints

### POST `/auth/login`
Вход пользователя в систему.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "role": "user"
    }
  },
  "message": "Успешная авторизация"
}
```

### POST `/auth/refresh`
Обновление токенов пользователя.

**Request Body (опционально):**
```json
{
  "refreshToken": "refresh_token_here"
}
```

**Примечание:** Refresh token также может быть передан в cookies.

### POST `/auth/logout`
Выход пользователя из системы.

**Требует:** JWT токен в заголовке `Authorization: Bearer <token>`

## 🔧 Основные компоненты

### LoginService
Основной сервис для аутентификации:

- **`validateUser(email, password)`** - валидация пользователя
- **`login(user, res)`** - вход в систему и создание токенов
- **`refreshTokens(refreshToken, res)`** - обновление токенов
- **`logout(userId, res)`** - выход из системы

### LoginController
Контроллер для обработки HTTP запросов:

- Обрабатывает входящие запросы
- Валидирует данные через DTO
- Вызывает соответствующие методы сервиса
- Возвращает структурированные ответы

### RefreshToken Entity
Сущность для хранения refresh токенов:

```typescript
@Entity('refresh_tokens')
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', unique: true })
  token: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
```

### JWT Strategy
Passport стратегия для JWT аутентификации:

- Извлекает токен из заголовка `Authorization`
- Валидирует JWT токен
- Возвращает данные пользователя

### JWT Auth Guard
Guard для защиты endpoints:

- Проверяет валидность JWT токена
- Автоматически добавляет пользователя в `req.user`

## 🔐 Безопасность

### Токены
- **Access Token** - короткий срок жизни (15 минут)
- **Refresh Token** - длинный срок жизни (7 дней)
- **HttpOnly Cookies** - защита от XSS атак

### Валидация
- Проверка email и пароля
- Верификация email пользователя
- Хеширование паролей с bcrypt

### Защита
- Автоматическая ротация refresh токенов
- Удаление старых токенов при входе
- Проверка существования токена в базе

## 📋 DTO Validation

### LoginDto
```typescript
export class LoginDto {
  @IsEmail({}, { message: 'Введите корректный email адрес' })
  @IsNotEmpty({ message: 'Email обязателен' })
  email: string;

  @IsString({ message: 'Пароль должен быть строкой' })
  @MinLength(8, { message: 'Пароль должен содержать минимум 8 символов' })
  @IsNotEmpty({ message: 'Пароль обязателен' })
  password: string;
}
```

### RefreshTokenDto
```typescript
export class RefreshTokenDto {
  @IsOptional()
  @IsString({ message: 'Refresh token должен быть строкой' })
  @IsNotEmpty({ message: 'Refresh token не может быть пустым' })
  refreshToken?: string;
}
```

## 🎯 Особенности

- ✅ **Двухфакторная аутентификация** - access + refresh токены
- ✅ **Автоматическая ротация** - обновление токенов при каждом использовании
- ✅ **HttpOnly Cookies** - безопасное хранение refresh токенов
- ✅ **Валидация данных** - проверка входящих данных через DTO
- ✅ **Обработка ошибок** - информативные сообщения об ошибках
- ✅ **Типизация TypeScript** - безопасность типов

## 🔄 Жизненный цикл токенов

1. **Вход** - создание access и refresh токенов
2. **Использование** - access токен для API запросов
3. **Обновление** - refresh токен для получения новых токенов
4. **Ротация** - автоматическое обновление refresh токена
5. **Выход** - удаление всех токенов пользователя

## 🚧 Разработка

Для добавления новых функций аутентификации:

1. Добавьте новый метод в `LoginService`
2. Создайте соответствующий endpoint в `LoginController`
3. Добавьте валидацию через DTO
4. Обновите документацию

## 📖 Зависимости

- `@nestjs/jwt` - работа с JWT токенами
- `@nestjs/passport` - Passport стратегии
- `@nestjs/typeorm` - работа с базой данных
- `bcrypt` - хеширование паролей
- `class-validator` - валидация DTO
