import { IsNumber, IsPositive } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ProductIdDto {
  @ApiProperty({ example: 1, description: 'ID продукта' })
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => Number(value))
  id: number;
}
