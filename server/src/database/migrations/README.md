# Миграции базы данных

Этот каталог содержит миграции для управления схемой базы данных.

## 🚀 Команды для работы с миграциями

### Создание новой миграции
```bash
npm run migration:generate src/database/migrations/НазваниеМиграции
```

### Запуск миграций
```bash
npm run migration:run
```

### Откат последней миграции
```bash
npm run migration:revert
```

## 📋 Существующие миграции

### 1. `1700000000000-CreateSchemaFromEntities.ts`
**Описание:** Создаёт всю схему БД на основе Entity классов
**Содержит:**
- Все таблицы (users, products, orders, cart, favorites, etc.)
- Enum типы (user_role_enum, order_status_enum)
- Внешние ключи и связи
- Индексы для производительности

## ⚠️ Важные моменты

### Development vs Production
- **Development**: `synchronize: true` - таблицы создаются автоматически
- **Production**: `synchronize: false` + миграции - безопасное управление схемой

### Порядок выполнения
1. Сначала запускаются миграции (создают структуру)
2. Затем запускаются сиды (заполняют данными)

### Безопасность
- Миграции НЕ удаляют существующие данные
- Всегда делайте backup перед production деплоем
- Тестируйте миграции на копии production данных

## 🔧 Настройка

### app.module.ts
Добавлена поддержка миграций:
```typescript
migrations: ['src/database/migrations/*.ts'],
migrationsRun: config.get<string>('NODE_ENV') === 'production',
```

## 📚 Полезные ссылки

- [TypeORM Migrations](https://typeorm.io/migrations)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
