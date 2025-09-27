import { IsOptional, IsArray, IsNumber, ArrayMaxSize } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ProductIdsQueryDto {
  @ApiProperty({
    description: 'Список ID товаров через запятую',
    example: '1,2,3',
    required: true,
    maxItems: 50,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value == null || value === '') return [];
    const stringValue = Array.isArray(value)
      ? String(value.join(','))
      : String(value);
    const ids = stringValue
      .split(',')
      .map((id: string) => Number(String(id).trim()))
      .filter((n: number) => !Number.isNaN(n) && n > 0);

    // Удаляем дубликаты
    return [...new Set(ids)];
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @ArrayMaxSize(50, { message: 'Максимум 50 товаров за раз' })
  productIds: number[];
}
