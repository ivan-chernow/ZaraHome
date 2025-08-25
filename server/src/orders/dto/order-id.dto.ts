import { IsNumber, IsPositive } from 'class-validator';
import { Transform } from 'class-transformer';

export class OrderIdDto {
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => parseInt(value))
  id: number;
}
