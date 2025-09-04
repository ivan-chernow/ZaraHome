import { IsString, IsNumber, IsBoolean, IsArray, IsOptional, IsPositive, IsDateString, Min, Max } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Shirt', description: 'Название товара (EN)' })
  @IsString()
  name_eng: string;

  @ApiProperty({ example: 'Рубашка', description: 'Название товара (RU)' })
  @IsString()
  name_ru: string;

  @ApiProperty({ type: [String], required: false, example: ['url1.jpg', 'url2.jpg'], description: 'Ссылки на изображения (может отсутствовать при загрузке файлов)' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  img?: string[];

  @ApiProperty({ type: [String], example: ['black', 'white'], description: 'Цвета товара' })
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
    return value;
  })
  colors: string[];

  @ApiProperty({ type: 'array', items: { type: 'object', properties: { size: { type: 'string' }, price: { type: 'number' } } }, example: [{ size: 'M', price: 1000 }], description: 'Размеры и цены' })
  @IsArray()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
    return value;
  })
  size: Array<{ size: string; price: number }>;

  @ApiProperty({ example: '2025-01-10', description: 'Дата доставки (ISO)' })
  @IsDateString()
  deliveryDate: string;

  @ApiProperty({ example: 'Описание товара', description: 'Описание' })
  @IsString()
  description: string;

  @ApiProperty({ example: true, description: 'Новый товар' })
  @IsBoolean()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value === 'true';
    }
    return value;
  })
  isNew: boolean;

  @ApiProperty({ example: 10, required: false, description: 'Скидка в % (0-100)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  discount?: number;

  @ApiProperty({ example: true, description: 'Доступен к покупке' })
  @IsBoolean()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value === 'true';
    }
    return value;
  })
  isAvailable: boolean;

  @ApiProperty({ example: 1, required: false, description: 'ID категории' })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return parseInt(value);
    }
    return value;
  })
  categoryId?: number;

  @ApiProperty({ example: 2, required: false, description: 'ID подкатегории' })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return parseInt(value);
    }
    return value;
  })
  subCategoryId?: number;

  @ApiProperty({ example: 3, required: false, description: 'ID типа' })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return parseInt(value);
    }
    return value;
  })
  typeId?: number;
} 