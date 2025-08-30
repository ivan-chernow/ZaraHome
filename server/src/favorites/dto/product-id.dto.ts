import { IsNumber, IsPositive } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class FavoriteProductIdDto {
  @ApiProperty({
    description: 'ID товара',
    example: 1,
    minimum: 1
  })
  @IsNumber()
  @IsPositive({ message: 'ID товара должен быть положительным числом' })
  @Transform(({ value }) => Number(value))
  productId: number;
}
