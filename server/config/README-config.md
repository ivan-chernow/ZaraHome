# 🚀 Конфигурация ZaraHome ECOM - Учебный проект

## 📁 Структура папки

```
server/config/
├── env.config.ts           # Основные конфигурации
├── config.service.ts       # Сервис конфигурации
├── config.module.ts        # Модуль конфигурации
├── env.validation.ts       # Валидация переменных окружения
├── README-config.md        # Эта документация
├── rate-limit/             # Модуль rate limiting
├── jwt/                    # Модуль JWT
└── database/               # Модуль базы данных
```

## 🔧 Основные конфигурации

### **1. Application (app)**
- `NODE_ENV` - окружение (development)
- `PORT` - порт сервера (3001)
- `API_PREFIX` - префикс API (api)
- `GLOBAL_PREFIX` - глобальный префикс (пустой)

### **2. Database (database)**
- `DB_HOST` - хост базы данных (localhost)
- `DB_PORT` - порт базы данных (5432)
- `DB_USERNAME` - имя пользователя (postgres)
- `DB_PASSWORD` - пароль (из .env)
- `DB_DATABASE` - название базы данных (zarahome_ecom)
- `DB_SYNCHRONIZE` - синхронизация схемы (true для dev)
- `DB_LOGGING` - логирование запросов (true для dev)

### **3. JWT (jwt)**
- `JWT_SECRET` - секретный ключ для JWT
- `JWT_ACCESS_EXPIRES_IN` - время жизни access токена (15m)
- `JWT_REFRESH_EXPIRES_IN` - время жизни refresh токена (7d)

### **4. Email (email)**
- `EMAIL_HOST` - SMTP сервер (smtp.gmail.com)
- `EMAIL_PORT` - SMTP порт (587)
- `EMAIL_USER` - email пользователя
- `EMAIL_PASS` - пароль приложения
- `EMAIL_FROM` - отправитель (noreply@zarahome.com)
- `EMAIL_SECURE` - безопасное соединение (false)

### **5. File Upload (fileUpload)**
- `MAX_FILE_SIZE` - максимальный размер файла (5MB)
- `UPLOAD_PATH` - путь для загрузки (uploads)

### **6. Cache (cache)**
- `CACHE_TTL` - время жизни кеша (5 минут)
- `CACHE_MAX_KEYS` - максимальное количество ключей (1000)

### **7. Rate Limit (rateLimit)**
- `RATE_LIMIT_TTL` - время окна (1 минута)
- `RATE_LIMIT_MAX` - максимальное количество запросов (100)

### **8. CORS (cors)**
- `CORS_ORIGIN` - разрешенные источники (http://localhost:3000)
- `CORS_CREDENTIALS` - поддержка credentials (true)

## 📝 Настройка

### **1. Создайте .env файл:**
```bash
# Скопируйте env.example в .env
cp env.example .env

# Отредактируйте .env под ваши настройки
```

### **2. Обязательные переменные:**
```bash
DB_PASSWORD=your_database_password
JWT_SECRET=your_jwt_secret_key
```

### **3. Опциональные переменные:**
```bash
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

## 🎯 Использование в коде

### **В сервисах:**
```typescript
import { ConfigService } from '../config/config.service';

@Injectable()
export class MyService {
  constructor(private configService: ConfigService) {}

  getDatabaseConfig() {
    return this.configService.database;
  }

  getJwtSecret() {
    return this.configService.jwt.secret;
  }
}
```

### **В модулях:**
```typescript
import { getDatabaseConfig } from '../config/env.config';

TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => getDatabaseConfig(configService),
})
```

## 🔒 Безопасность

- **НЕ коммитьте .env файлы** в Git
- **Используйте разные секреты** для разных окружений
- **Ограничивайте доступ** к конфигурационным файлам
- **Валидируйте** все входящие переменные

## 🚀 Запуск

```bash
# Установка зависимостей
npm install

# Сборка проекта
npm run build

# Запуск в режиме разработки
npm run start:dev
```

## 📚 Полезные ссылки

- [NestJS Configuration](https://docs.nestjs.com/techniques/configuration)
- [TypeORM Configuration](https://typeorm.io/#/connection-options)
- [JWT Configuration](https://docs.nestjs.com/security/authentication#jwt-functionality)

