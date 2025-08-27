import { ApiProperty } from '@nestjs/swagger';

export class UploadErrorDto {
  @ApiProperty({
    description: 'Оригинальное имя файла',
    example: 'image.jpg',
  })
  originalName: string;

  @ApiProperty({
    description: 'Сообщение об ошибке',
    example: 'Файл слишком большой (максимум 10MB)',
  })
  error: string;

  @ApiProperty({
    description: 'Этап, на котором произошла ошибка',
    enum: ['validation', 'processing', 'saving'],
    example: 'validation',
  })
  stage: 'validation' | 'processing' | 'saving';
}

export class UploadStatisticsDto {
  @ApiProperty({
    description: 'Общее количество файлов',
    example: 5,
  })
  total: number;

  @ApiProperty({
    description: 'Количество успешно обработанных файлов',
    example: 4,
  })
  successful: number;

  @ApiProperty({
    description: 'Количество файлов с ошибками',
    example: 1,
  })
  failed: number;

  @ApiProperty({
    description: 'Процент успешных загрузок',
    example: 0.8,
  })
  successRate: number;

  @ApiProperty({
    description: 'Список ошибок',
    type: [String],
    example: ['image.jpg: Файл слишком большой'],
  })
  errors: string[];
}

export class UploadResponseDto {
  @ApiProperty({
    description: 'Успешность операции',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Пути к успешно загруженным файлам',
    type: [String],
    example: ['/uploads/products/1700000000000-abc123-def456.webp'],
  })
  filePaths?: string[];

  @ApiProperty({
    description: 'Ошибки загрузки',
    type: [UploadErrorDto],
  })
  errors?: UploadErrorDto[];

  @ApiProperty({
    description: 'Статистика загрузки',
    type: UploadStatisticsDto,
  })
  statistics?: UploadStatisticsDto;

  @ApiProperty({
    description: 'Сообщение',
    example: 'Файлы успешно загружены',
  })
  message?: string;
}

export class ProductUploadResponseDto extends UploadResponseDto {
  @ApiProperty({
    description: 'ID созданного продукта',
    example: 1,
  })
  productId?: number;

  @ApiProperty({
    description: 'Название созданного продукта',
    example: 'Красивая футболка',
  })
  productName?: string;
}

