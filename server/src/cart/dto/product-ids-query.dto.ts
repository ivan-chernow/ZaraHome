import { IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class ProductIdsQueryDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    if (!value) return [];
    return value
      .split(',')
      .map((id: string) => Number(id))
      .filter((n: number) => !Number.isNaN(n));
  })
  productIds: number[];
}
