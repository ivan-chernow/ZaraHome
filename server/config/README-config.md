# 🚀 ZaraHome ECOM - Система конфигурации

## 📋 Обзор

Профессиональная система конфигурации для NestJS приложения с поддержкой разных окружений, валидацией переменных и типизацией.

## 🏗️ Архитектура

```
config/
├── config.module.ts              # Основной модуль конфигурации
├── config.service.ts             # Сервис для доступа к конфигурации
├── env.config.ts                 # Основные конфигурации
├── env.validation.ts             # Схема валидации
├── database.config.ts            # Конфигурация БД
├── jwt.config.ts                 # Конфигурация JWT
├── cors.config.ts                # Конфигурация CORS
├── rate-limit.config.ts          # Конфигурация Rate Limiting
├── environments/                  # Окружения
│   ├── development.config.ts     # Development
│   ├── production.config.ts      # Production
│   └── test.config.ts           # Test
└── README-config.md              # Эта документация
```

## 🔧 Основные возможности

### ✅ **Валидация переменных окружения**
- Автоматическая валидация всех переменных
- Схема валидации с помощью Joi
- Проверка типов и значений
- Значения по умолчанию

### ✅ **Поддержка разных окружений**
- Development
- Production  
- Test
- Автоматический выбор конфигурации

### ✅ **Типизация**
- TypeScript интерфейсы для всех конфигураций
- Автодополнение в IDE
- Проверка типов на этапе компиляции

### ✅ **Безопасность**
- Проверка обязательных переменных
- Валидация секретных ключей
- Разные настройки для разных окружений

## 📁 Структура файлов

### 1. **env.example** - Пример переменных окружения
```bash
# Скопируйте в .env и заполните
cp env.example .env
```

### 2. **env.config.ts** - Основные конфигурации
```typescript
export interface AppConfig {
  nodeEnv: string;
  port: number;
  apiPrefix: string;
  // ... другие настройки
}
```

### 3. **env.validation.ts** - Схема валидации
```typescript
export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test'),
  PORT: Joi.number().port().default(3000),
  // ... другие правила
});
```

### 4. **config.service.ts** - Сервис конфигурации
```typescript
@Injectable()
export class ConfigService {
  get port(): number { return this.configService.get<number>('app.port'); }
  get database() { return { /* ... */ }; }
  // ... другие геттеры
}
```

## 🚀 Использование

### 1. **В сервисах**
```typescript
import { ConfigService } from '../config/config.service';

@Injectable()
export class MyService {
  constructor(private configService: ConfigService) {}

  someMethod() {
    const port = this.configService.port;
    const dbHost = this.configService.database.host;
    
    // Проверка окружения
    if (this.configService.isDevelopment) {
      console.log('Development mode');
    }
  }
}
```

### 2. **В модулях**
```typescript
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [ConfigModule],
  // ...
})
export class MyModule {}
```

### 3. **Проверка обязательных переменных**
```typescript
// В main.ts или bootstrap
const configService = app.get(ConfigService);
configService.validateRequired(['JWT_SECRET', 'DB_PASSWORD']);
```

## 🌍 Окружения

### **Development**
- Включена синхронизация БД
- Подробное логирование
- Отключен Rate Limiting
- Меньше раундов BCrypt

### **Production**
- Отключена синхронизация БД
- Только важные логи
- Включен Rate Limiting
- Больше раундов BCrypt
- SSL для БД

### **Test**
- Отдельная тестовая БД
- Минимальное логирование
- Быстрые настройки

## 🔒 Безопасность

### **Обязательные переменные**
- `JWT_SECRET` - минимум 32 символа
- `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`
- `SESSION_SECRET` - минимум 32 символа

### **Рекомендации**
- Используйте разные секреты для разных окружений
- Никогда не коммитьте `.env` файлы
- Используйте `.env.local` для локальных настроек
- Регулярно обновляйте секреты

## 📊 Мониторинг

### **Логирование конфигурации**
```typescript
// В main.ts
const configService = app.get(ConfigService);
console.log(`🚀 Environment: ${configService.nodeEnv}`);
console.log(`🌐 Port: ${configService.port}`);
console.log(`🗄️ Database: ${configService.database.host}:${configService.database.port}`);
```

### **Проверка здоровья**
```typescript
// Проверка обязательных переменных
try {
  configService.validateRequired(['JWT_SECRET', 'DB_PASSWORD']);
  console.log('✅ Configuration validation passed');
} catch (error) {
  console.error('❌ Configuration validation failed:', error.message);
  process.exit(1);
}
```

## 🛠️ Устранение неполадок

### **Ошибка валидации**
```bash
# Проверьте .env файл
cat .env

# Проверьте схему валидации
cat config/env.validation.ts
```

### **Отсутствующие переменные**
```bash
# Создайте .env из примера
cp env.example .env

# Заполните обязательные переменные
nano .env
```

### **Проблемы с типами**
```bash
# Пересоберите проект
npm run build

# Проверьте TypeScript
npx tsc --noEmit
```

## 📝 Примеры конфигурации

### **.env.development**
```bash
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_USERNAME=dev_user
DB_PASSWORD=dev_password
DB_DATABASE=zarahome_dev
JWT_SECRET=dev_secret_key_32_chars_minimum
```

### **.env.production**
```bash
NODE_ENV=production
PORT=3000
DB_HOST=prod-db.example.com
DB_USERNAME=prod_user
DB_PASSWORD=prod_secure_password
DB_DATABASE=zarahome_prod
JWT_SECRET=production_secret_key_very_long_and_secure
```

## 🎯 Лучшие практики

1. **Всегда используйте типизацию**
2. **Валидируйте переменные на старте**
3. **Используйте разные настройки для разных окружений**
4. **Не храните секреты в коде**
5. **Документируйте все переменные**
6. **Тестируйте конфигурацию**

## 🔄 Обновления

### **Добавление новой переменной**
1. Добавьте в `env.example`
2. Добавьте в `env.config.ts`
3. Добавьте в `env.validation.ts`
4. Добавьте геттер в `config.service.ts`
5. Обновите документацию

### **Изменение логики**
1. Обновите соответствующий конфиг файл
2. Обновите типы
3. Обновите валидацию
4. Протестируйте изменения

---

**🎉 Система конфигурации готова к использованию!**

