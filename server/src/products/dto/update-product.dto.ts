import { IsOptional, IsString, IsBoolean, IsNumber, IsPositive, IsArray } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name_eng?: string;

  @IsOptional()
  @IsString()
  name_ru?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  img?: string[];

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

  @IsOptional()
  @IsString()
  deliveryDate?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => (typeof value === 'string' ? value === 'true' : value))
  isNew?: boolean;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  discount?: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => (typeof value === 'string' ? value === 'true' : value))
  isAvailable?: boolean;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => (typeof value === 'string' ? parseInt(value) : value))
  categoryId?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => (typeof value === 'string' ? parseInt(value) : value))
  subCategoryId?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => (typeof value === 'string' ? parseInt(value) : value))
  typeId?: number;
}


