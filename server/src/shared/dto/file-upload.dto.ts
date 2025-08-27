import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class FileUploadDto {
  @ApiProperty({
    description: 'Загруженные файлы',
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    maxItems: 12,
  })
  @IsArray()
  @IsOptional()
  files?: Express.Multer.File[];
}

export class ImageUploadOptionsDto {
  @ApiProperty({
    description: 'Качество изображения (1-100)',
    example: 80,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  quality?: number;

  @ApiProperty({
    description: 'Максимальная ширина изображения',
    example: 1600,
    minimum: 50,
    maximum: 8000,
  })
  @IsOptional()
  maxWidth?: number;

  @ApiProperty({
    description: 'Максимальная высота изображения',
    example: 1600,
    minimum: 50,
    maximum: 8000,
  })
  @IsOptional()
  maxHeight?: number;

  @ApiProperty({
    description: 'Формат изображения',
    enum: ['webp', 'jpeg', 'png'],
    example: 'webp',
  })
  @IsOptional()
  @IsString()
  format?: 'webp' | 'jpeg' | 'png';

  @ApiProperty({
    description: 'Создавать миниатюру',
    example: true,
  })
  @IsOptional()
  generateThumbnail?: boolean;

  @ApiProperty({
    description: 'Размер миниатюры',
    example: 300,
    minimum: 50,
    maximum: 1000,
  })
  @IsOptional()
  thumbnailSize?: number;
}

export class FileValidationDto {
  @ApiProperty({
    description: 'Максимальное количество файлов',
    example: 12,
    minimum: 1,
    maximum: 50,
  })
  @IsOptional()
  maxCount?: number;

  @ApiProperty({
    description: 'Максимальный размер файла в MB',
    example: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  maxSizeMB?: number;

  @ApiProperty({
    description: 'Разрешенные расширения файлов',
    example: ['jpg', 'jpeg', 'png', 'gp', 'webp'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  allowedExt?: string[];

  @ApiProperty({
    description: 'Разрешенные MIME типы',
    example: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  allowedMime?: string[];
}
