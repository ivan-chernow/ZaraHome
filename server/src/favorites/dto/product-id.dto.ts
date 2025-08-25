import { IsNumber, IsPositive } from 'class-validator';
import { Transform } from 'class-transformer';

export class FavoriteProductIdDto {
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => Number(value))
  productId: number;
}
