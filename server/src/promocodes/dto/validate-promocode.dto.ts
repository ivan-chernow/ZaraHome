import {
  IsString,
  IsNumber,
  IsOptional,
  IsPositive,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ValidatePromocodeDto {
  @ApiProperty({
    description: 'Код промокода',
    example: 'SUMMER15',
  })
  @IsString({ message: 'Код промокода должен быть строкой' })
  @MinLength(1, { message: 'Код промокода не может быть пустым' })
  code: string;

  @ApiProperty({
    description: 'Сумма заказа',
    example: 5000,
    minimum: 0,
  })
  @Type(() => Number)
  @IsNumber({}, { message: 'Сумма заказа должна быть числом' })
  @IsPositive({ message: 'Сумма заказа должна быть больше 0' })
  orderAmount: number;

  @ApiProperty({
    description: 'ID пользователя (опционально)',
    example: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'ID пользователя должен быть числом' })
  userId?: number;
}
