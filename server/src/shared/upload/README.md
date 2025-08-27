# Улучшения загрузки файлов

## Обзор

Система загрузки файлов была значительно улучшена с добавлением строгой валидации, генерации уникальных имен и оптимизации изображений.

## Основные улучшения

### 1. Валидация файлов

#### Проверка типов файлов
- **Разрешенные форматы**: jpg, jpeg, png, gif, webp
- **MIME типы**: image/jpeg, image/jpg, image/png, image/gif, image/webp
- **Проверка расширений**: Автоматическая проверка расширений файлов
- **Проверка MIME типов**: Валидация реального типа файла

#### Ограничения размера
- **Максимальный размер файла**: 10MB (настраивается)
- **Минимальный размер**: 1 байт (файл не должен быть пустым)
- **Максимальное количество файлов**: 12 (настраивается)

#### Валидация изображений
- **Минимальные размеры**: 50x50 пикселей
- **Максимальные размеры**: 8000x8000 пикселей
- **Проверка корректности**: Валидация через Sharp

### 2. Генерация уникальных имен

#### Формат имени файла
```
{timestamp}-{randomId}-{hash}.{extension}
```

Пример: `1700000000000-a1b2c3d4-e5f6g7h8.webp`

#### Компоненты имени
- **timestamp**: Время загрузки в миллисекундах
- **randomId**: 8 символов из UUID
- **hash**: MD5 хеш от оригинального имени + timestamp + randomId
- **extension**: Оригинальное расширение файла

### 3. Оптимизация изображений

#### Настройки по умолчанию
- **Качество**: 80%
- **Максимальная ширина**: 1600px
- **Максимальная высота**: 1600px
- **Формат**: WebP
- **Автоматический поворот**: По EXIF данным

#### Создание миниатюр
- **Размер миниатюры**: 300x300px
- **Формат**: WebP
- **Качество**: 70%
- **Позиционирование**: center

## Использование

### Базовое использование

```typescript
@Post('upload')
@UseInterceptors(ImagesUploadInterceptor({
  fieldName: 'images',
  maxCount: 12,
  maxSizeMB: 10,
  generateUniqueNames: true
}))
async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
  // Файлы уже валидированы и имеют уникальные имена
  return this.imageService.processMany(files);
}
```

### Расширенная валидация

```typescript
// Дополнительная валидация после загрузки
validateUploadedFiles(files, {
  maxCount: 12,
  maxSizeMB: 10,
  allowedExt: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  allowedMime: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
});
```

### Обработка изображений

```typescript
const imagePaths = await this.imageOptimizationService.processMany(files, {
  quality: 80,
  maxWidth: 1600,
  maxHeight: 1600,
  format: 'webp',
  generateThumbnail: true,
  thumbnailSize: 300
});
```

## Обработка ошибок

### Типы ошибок

1. **Файл не предоставлен**
   ```
   BadRequestException: Файл не предоставлен
   ```

2. **Неподдерживаемый тип файла**
   ```
   BadRequestException: Неподдерживаемый тип файла. Разрешены только: jpg, jpeg, png, gif, webp
   ```

3. **Файл слишком большой**
   ```
   BadRequestException: Файл "image.jpg" слишком большой. Максимальный размер: 10MB
   ```

4. **Некорректное изображение**
   ```
   BadRequestException: Некорректный формат изображения
   ```

5. **Изображение слишком маленькое**
   ```
   BadRequestException: Изображение слишком маленькое. Минимальный размер: 50x50 пикселей
   ```

## Безопасность

### Защита от атак
- **Валидация MIME типов**: Предотвращает загрузку исполняемых файлов
- **Проверка расширений**: Дополнительный уровень защиты
- **Ограничение размера**: Защита от DoS атак
- **Уникальные имена**: Предотвращает перезапись файлов

### Очистка файлов
```typescript
// Удаление одного файла
await this.imageOptimizationService.deleteFile('/uploads/products/image.webp');

// Удаление нескольких файлов
await this.imageOptimizationService.deleteFiles([
  '/uploads/products/image1.webp',
  '/uploads/products/image2.webp'
]);
```

## Конфигурация

### Настройки по умолчанию

```typescript
const defaultOptions = {
  fieldName: 'images',
  maxCount: 10,
  maxSizeMB: 10,
  allowedExt: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  allowedMime: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  generateUniqueNames: true,
};
```

### Настройки обработки изображений

```typescript
const imageOptions = {
  quality: 80,              // Качество (1-100)
  maxWidth: 1600,           // Максимальная ширина
  maxHeight: 1600,          // Максимальная высота
  format: 'webp',           // Формат (webp, jpeg, png)
  generateThumbnail: true,  // Создавать миниатюру
  thumbnailSize: 300,       // Размер миниатюры
};
```

## Примеры использования

### Создание продукта с изображениями

```typescript
@Post('products')
@UseInterceptors(ImagesUploadInterceptor({
  fieldName: 'images',
  maxCount: 12,
  maxSizeMB: 10
}))
async createProduct(
  @UploadedFiles() files: Express.Multer.File[],
  @Body() productData: CreateProductDto
) {
  // Валидируем файлы
  validateUploadedFiles(files, {
    maxCount: 12,
    maxSizeMB: 10
  });

  // Обрабатываем изображения
  const imagePaths = await this.imageService.processMany(files, {
    quality: 80,
    maxWidth: 1600,
    maxHeight: 1600,
    format: 'webp',
    generateThumbnail: true
  });

  // Создаем продукт
  const product = await this.productService.create({
    ...productData,
    img: imagePaths
  });

  return product;
}
```

## Заключение

Система загрузки файлов теперь обеспечивает:
- ✅ Строгую валидацию всех загружаемых файлов
- ✅ Генерацию уникальных имен файлов
- ✅ Оптимизацию изображений с созданием миниатюр
- ✅ Защиту от различных типов атак
- ✅ Гибкую настройку параметров
- ✅ Подробную обработку ошибок
