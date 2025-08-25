import { IsNumber, IsPositive } from 'class-validator';
import { Transform } from 'class-transformer';

export class ProductIdDto {
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => Number(value))
  id: number;
}
