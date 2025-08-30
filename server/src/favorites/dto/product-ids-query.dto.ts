import { IsOptional, IsString, IsArray, IsNumber, ArrayMaxSize } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ProductIdsQueryDto {
  @ApiProperty({
    description: 'Список ID товаров через запятую',
    example: '1,2,3',
    required: true,
    maxItems: 50
  })
  @IsOptional()
  @IsString({ message: 'productIds должен быть строкой' })
  @Transform(({ value }) => {
    if (!value) return [];
    const ids = value
      .split(',')
      .map((id: string) => Number(id.trim()))
      .filter((n: number) => !Number.isNaN(n) && n > 0);
    
    // Удаляем дубликаты
    return [...new Set(ids)];
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @ArrayMaxSize(50, { message: 'Максимум 50 товаров за раз' })
  productIds: number[];
}
