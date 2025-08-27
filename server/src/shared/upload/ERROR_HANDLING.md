# Обработка ошибок загрузки файлов

## Обзор

Система обработки ошибок загрузки файлов обеспечивает graceful fallback, автоматическое удаление неполных файлов и детальное логирование всех ошибок.

## Основные компоненты

### 1. FileUploadErrorHandlerService

Основной сервис для обработки ошибок загрузки файлов.

#### Методы:

- `handleUploadErrors()` - Обработка с graceful fallback
- `handleUploadWithRollback()` - Обработка с откатом при критических ошибках
- `cleanupPartialUploads()` - Удаление неполных файлов
- `validateFileWithFallback()` - Валидация с graceful fallback
- `processWithRetry()` - Обработка с повторными попытками
- `getUploadStatistics()` - Получение статистики загрузки

### 2. UploadErrorMiddleware

Middleware для перехвата ошибок загрузки на уровне HTTP запросов.

### 3. DTO для ответов

- `UploadResponseDto` - Базовый ответ с информацией об ошибках
- `ProductUploadResponseDto` - Ответ для создания продуктов
- `UploadErrorDto` - Информация об ошибке
- `UploadStatisticsDto` - Статистика загрузки

## Стратегии обработки ошибок

### 1. Graceful Fallback

```typescript
// Продолжаем обработку других файлов при ошибке одного
const results = await this.errorHandlerService.handleUploadErrors(
  files,
  async (file) => {
    return await this.imageService.processAndSave(file.buffer, file.originalname);
  }
);

// Результат содержит информацию об успешных и неуспешных загрузках
const successful = results.filter(r => r.success);
const failed = results.filter(r => !r.success);
```

### 2. Rollback при критических ошибках

```typescript
// Если менее 70% файлов обработано успешно, откатываем все изменения
const result = await this.errorHandlerService.handleUploadWithRollback(
  files,
  async (file) => {
    return await this.imageService.processAndSave(file.buffer, file.originalname);
  },
  0.7 // 70% порог успешности
);

if (!result.success) {
  // Все файлы автоматически удалены
  throw new BadRequestException(result.error);
}
```

### 3. Повторные попытки

```typescript
// Автоматические повторные попытки с экспоненциальной задержкой
const result = await this.errorHandlerService.processWithRetry(
  file,
  async (file) => {
    return await this.imageService.processAndSave(file.buffer, file.originalname);
  },
  3 // Максимум 3 попытки
);
```

## Автоматическая очистка

### Удаление неполных файлов

```typescript
// Автоматически удаляем файлы при ошибках
await this.errorHandlerService.cleanupPartialUploads([
  '/uploads/products/image1.webp',
  '/uploads/products/image2.webp'
]);
```

### Валидация с fallback

```typescript
// Валидируем каждый файл отдельно
const validationResults = await Promise.all(
  files.map(file => this.errorHandlerService.validateFileWithFallback(file))
);

// Фильтруем только валидные файлы
const validFiles = files.filter((_, index) => validationResults[index].valid);
```

## Статистика и мониторинг

### Получение статистики

```typescript
const stats = this.errorHandlerService.getUploadStatistics(results);

console.log(`Успешно: ${stats.successful}/${stats.total} (${Math.round(stats.successRate * 100)}%)`);
console.log(`Ошибки: ${stats.errors.join(', ')}`);
```

### Логирование

```typescript
// Автоматическое логирование всех ошибок
this.logger.error(`Ошибка обработки файла ${file.originalname}:`, error.message);
this.logger.warn(`Найдены некорректные файлы: ${invalidFiles.map(f => f.error).join(', ')}`);
```

## Примеры использования

### Создание продукта с обработкой ошибок

```typescript
async createProduct(files: Express.Multer.File[], productData: CreateProductDto) {
  // Валидация с graceful fallback
  const validationResults = await Promise.all(
    files.map(file => this.errorHandlerService.validateFileWithFallback(file))
  );

  const validFiles = files.filter((_, index) => validationResults[index].valid);
  
  if (validFiles.length === 0) {
    throw new BadRequestException('Нет валидных файлов для загрузки');
  }

  // Обработка с rollback при критических ошибках
  const uploadResult = await this.errorHandlerService.handleUploadWithRollback(
    validFiles,
    async (file) => {
      const result = await this.imageService.processAndSave(file.buffer, file.originalname);
      return result.mainPath;
    },
    0.7 // 70% порог
  );

  if (!uploadResult.success) {
    throw new BadRequestException(uploadResult.error);
  }

  // Создание продукта только с успешно загруженными файлами
  const imagePaths = uploadResult.results
    .filter(r => r.success)
    .map(r => r.filePath!);

  const product = await this.productService.create({
    ...productData,
    img: imagePaths
  });

  // Логирование статистики
  const stats = this.errorHandlerService.getUploadStatistics(uploadResult.results);
  this.logger.log(`Product created: ${stats.successful}/${stats.total} images uploaded`);

  return product;
}
```

### Обработка ошибок в контроллере

```typescript
@Post('upload')
@UseInterceptors(ImagesUploadInterceptor())
async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
  try {
    const results = await this.errorHandlerService.handleUploadErrors(
      files,
      async (file) => {
        return await this.imageService.processAndSave(file.buffer, file.originalname);
      }
    );

    const stats = this.errorHandlerService.getUploadStatistics(results);

    return {
      success: stats.successRate > 0.5,
      filePaths: results.filter(r => r.success).map(r => r.filePath),
      errors: results.filter(r => !r.success).map(r => ({
        originalName: r.originalName,
        error: r.error
      })),
      statistics: stats,
      message: `Загружено ${stats.successful} из ${stats.total} файлов`
    };
  } catch (error) {
    // Автоматическая очистка при общей ошибке
    throw new InternalServerErrorException('Ошибка загрузки файлов');
  }
}
```

## Типы ошибок

### 1. Ошибки валидации
- Файл пустой
- Файл слишком большой
- Неподдерживаемый тип файла
- Неподдерживаемое расширение

### 2. Ошибки обработки
- Некорректное изображение
- Ошибка Sharp
- Ошибка записи файла

### 3. Ошибки системы
- Недостаточно места на диске
- Ошибки сети
- Ошибки базы данных

## Конфигурация

### Пороги успешности
- **0.5 (50%)** - Базовый порог для rollback
- **0.7 (70%)** - Рекомендуемый порог для продуктов
- **0.9 (90%)** - Строгий порог для критических операций

### Повторные попытки
- **Максимум попыток**: 3
- **Задержка**: Экспоненциальная (2^attempt секунд)
- **Максимальная задержка**: 8 секунд

### Очистка
- **Автоматическая**: При ошибках обработки
- **Ручная**: Через API
- **Планировщик**: Ежедневная очистка старых файлов

## Мониторинг и алерты

### Метрики
- Процент успешных загрузок
- Количество ошибок по типам
- Время обработки файлов
- Размер загруженных файлов

### Алерты
- Критический уровень ошибок (>30%)
- Долгое время обработки (>30 секунд)
- Недостаток места на диске
- Ошибки валидации (>50% файлов)

## Заключение

Система обработки ошибок обеспечивает:
- ✅ Graceful fallback при ошибках
- ✅ Автоматическое удаление неполных файлов
- ✅ Детальное логирование и статистику
- ✅ Повторные попытки с экспоненциальной задержкой
- ✅ Rollback при критических ошибках
- ✅ Валидацию с graceful fallback
- ✅ Мониторинг и алерты

