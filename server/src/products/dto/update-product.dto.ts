import {
  IsOptional,
  IsString,
  IsBoolean,
  IsNumber,
  IsPositive,
  IsArray,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProductDto {
  @ApiPropertyOptional({ example: 'Shirt' })
  @IsOptional()
  @IsString()
  name_eng?: string;

  @ApiPropertyOptional({ example: 'Рубашка' })
  @IsOptional()
  @IsString()
  name_ru?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  img?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
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
  colors?: string[];

  @ApiPropertyOptional({
    type: 'array',
    items: {
      type: 'object',
      properties: { size: { type: 'string' }, price: { type: 'number' } },
    },
  })
  @IsOptional()
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
  size?: Array<{ size: string; price: number }>;

  @ApiPropertyOptional({ example: '2025-01-10' })
  @IsOptional()
  @IsString()
  deliveryDate?: string;

  @ApiPropertyOptional({ example: 'Описание товара' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) =>
    typeof value === 'string' ? value === 'true' : value
  )
  isNew?: boolean;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  discount?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) =>
    typeof value === 'string' ? value === 'true' : value
  )
  isAvailable?: boolean;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) =>
    typeof value === 'string' ? parseInt(value) : value
  )
  categoryId?: number;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) =>
    typeof value === 'string' ? parseInt(value) : value
  )
  subCategoryId?: number;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) =>
    typeof value === 'string' ? parseInt(value) : value
  )
  typeId?: number;
}
