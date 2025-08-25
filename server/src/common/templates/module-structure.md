# Стандартная структура модулей

Каждый модуль должен следовать единообразной структуре для обеспечения консистентности и легкой поддержки.

## Структура папок

```
module-name/
├── dto/                    # Data Transfer Objects
│   ├── create-*.dto.ts    # DTO для создания
│   ├── update-*.dto.ts    # DTO для обновления
│   ├── query-*.dto.ts     # DTO для запросов
│   └── index.ts           # Экспорт всех DTO
├── entity/                 # Сущности TypeORM
│   ├── *.entity.ts        # Основные сущности
│   └── index.ts           # Экспорт всех сущностей
├── repository/             # Репозитории (если нужны)
│   ├── *.repository.ts    # Кастомные репозитории
│   └── index.ts           # Экспорт всех репозиториев
├── service/                # Сервисы
│   ├── *.service.ts       # Основные сервисы
│   └── index.ts           # Экспорт всех сервисов
├── controller/             # Контроллеры
│   ├── *.controller.ts    # Основные контроллеры
│   └── index.ts           # Экспорт всех контроллеров
├── guard/                  # Guards (если нужны)
│   ├── *.guard.ts         # Кастомные guards
│   └── index.ts           # Экспорт всех guards
├── interceptor/            # Interceptors (если нужны)
│   ├── *.interceptor.ts   # Кастомные interceptors
│   └── index.ts           # Экспорт всех interceptors
├── pipe/                   # Pipes (если нужны)
│   ├── *.pipe.ts          # Кастомные pipes
│   └── index.ts           # Экспорт всех pipes
├── decorator/              # Decorators (если нужны)
│   ├── *.decorator.ts     # Кастомные decorators
│   └── index.ts           # Экспорт всех decorators
├── interface/              # Интерфейсы модуля
│   ├── *.interface.ts     # Специфичные интерфейсы
│   └── index.ts           # Экспорт всех интерфейсов
├── type/                   # Типы модуля
│   ├── *.type.ts          # Специфичные типы
│   └── index.ts           # Экспорт всех типов
├── constant/               # Константы модуля
│   ├── *.constant.ts      # Константы
│   └── index.ts           # Экспорт всех констант
├── enum/                   # Enums модуля
│   ├── *.enum.ts          # Enums
│   └── index.ts           # Экспорт всех enums
├── util/                   # Утилиты модуля
│   ├── *.util.ts          # Утилитарные функции
│   └── index.ts           # Экспорт всех утилит
├── test/                   # Тесты модуля
│   ├── *.spec.ts          # Unit тесты
│   ├── *.e2e-spec.ts      # E2E тесты
│   └── fixtures/          # Тестовые данные
├── seed/                   # Сиды для базы данных
│   ├── *.seed.ts          # Сиды
│   └── index.ts           # Экспорт всех сидов
├── migration/              # Миграции (если нужны)
│   └── *.migration.ts     # Миграции
├── *.module.ts             # Основной модуль
├── *.controller.ts         # Основной контроллер (если не в папке)
├── *.service.ts            # Основной сервис (если не в папке)
├── *.repository.ts         # Основной репозиторий (если не в папке)
├── index.ts                # Главный экспорт модуля
└── README.md               # Документация модуля
```

## Правила именования

### Файлы
- **DTO**: `create-*.dto.ts`, `update-*.dto.ts`, `query-*.dto.ts`
- **Entity**: `*.entity.ts`
- **Service**: `*.service.ts`
- **Controller**: `*.controller.ts`
- **Repository**: `*.repository.ts`
- **Guard**: `*.guard.ts`
- **Interceptor**: `*.interceptor.ts`
- **Pipe**: `*.pipe.ts`
- **Decorator**: `*.decorator.ts`
- **Interface**: `*.interface.ts`
- **Type**: `*.type.ts`
- **Constant**: `*.constant.ts`
- **Enum**: `*.enum.ts`
- **Util**: `*.util.ts`
- **Seed**: `*.seed.ts`
- **Migration**: `*.migration.ts`

### Классы
- **DTO**: `Create*Dto`, `Update*Dto`, `Query*Dto`
- **Entity**: `*Entity`
- **Service**: `*Service`
- **Controller**: `*Controller`
- **Repository**: `*Repository`
- **Guard**: `*Guard`
- **Interceptor**: `*Interceptor`
- **Pipe**: `*Pipe`
- **Decorator**: `*Decorator`

### Папки
- Все папки в нижнем регистре
- Использовать множественное число для папок с несколькими файлами
- Использовать единственное число для папок с одним типом файлов

## Обязательные файлы

Каждый модуль должен содержать:

1. **`*.module.ts`** - основной модуль
2. **`index.ts`** - главный экспорт
3. **`README.md`** - документация
4. **`dto/index.ts`** - экспорт DTO
5. **`entity/index.ts`** - экспорт сущностей
6. **`service/index.ts`** - экспорт сервисов
7. **`controller/index.ts`** - экспорт контроллеров

## Пример структуры для Products модуля

```
products/
├── dto/
│   ├── create-product.dto.ts
│   ├── update-product.dto.ts
│   ├── query-product.dto.ts
│   └── index.ts
├── entity/
│   ├── product.entity.ts
│   ├── category.entity.ts
│   ├── sub-category.entity.ts
│   └── index.ts
├── service/
│   ├── product.service.ts
│   ├── category.service.ts
│   └── index.ts
├── controller/
│   ├── product.controller.ts
│   ├── category.controller.ts
│   └── index.ts
├── repository/
│   ├── product.repository.ts
│   └── index.ts
├── interface/
│   ├── product.interface.ts
│   └── index.ts
├── type/
│   ├── product.type.ts
│   └── index.ts
├── constant/
│   ├── product.constant.ts
│   └── index.ts
├── enum/
│   ├── product-status.enum.ts
│   └── index.ts
├── util/
│   ├── product.util.ts
│   └── index.ts
├── test/
│   ├── product.service.spec.ts
│   ├── product.controller.spec.ts
│   └── fixtures/
├── seed/
│   ├── product.seed.ts
│   └── index.ts
├── products.module.ts
├── index.ts
└── README.md
```

## Принципы организации

1. **Разделение ответственности** - каждый файл имеет одну четкую задачу
2. **Группировка по типу** - файлы группируются по функциональности
3. **Единообразие** - все модули следуют одной структуре
4. **Масштабируемость** - структура легко расширяется
5. **Читаемость** - легко найти нужный файл
6. **Поддерживаемость** - изменения локализованы в соответствующих папках
