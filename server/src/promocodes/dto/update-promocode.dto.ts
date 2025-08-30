import { IsOptional, IsNumber, IsString, IsBoolean, IsDateString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PROMOCODES_CONSTANTS } from '../promocodes.constants';

export class UpdatePromocodeDto {
  @ApiProperty({
    description: 'Размер скидки в процентах',
    example: 15,
    required: false,
    minimum: 1,
    maximum: 100
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Скидка должна быть числом' })
  @Min(PROMOCODES_CONSTANTS.MIN_DISCOUNT, { message: 'Скидка должна быть не менее 1%' })
  @Max(PROMOCODES_CONSTANTS.MAX_DISCOUNT, { message: 'Скидка не может превышать 100%' })
  discount?: number;

  @ApiProperty({
    description: 'Максимальное количество использований',
    example: 100,
    required: false,
    minimum: 1
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Максимальное использование должно быть числом' })
  @Min(1, { message: 'Максимальное использование должно быть больше 0' })
  maxUsage?: number;

  @ApiProperty({
    description: 'Минимальная сумма заказа для применения промокода',
    example: 1000,
    required: false,
    minimum: 0
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Минимальная сумма заказа должна быть числом' })
  @Min(0, { message: 'Минимальная сумма заказа не может быть отрицательной' })
  minOrderAmount?: number;

  @ApiProperty({
    description: 'Дата истечения промокода',
    example: '2024-12-31T23:59:59.000Z',
    required: false
  })
  @IsOptional()
  @IsDateString({}, { message: 'Неверный формат даты' })
  expiresAt?: string;

  @ApiProperty({
    description: 'Описание промокода',
    example: 'Скидка 15% на все товары',
    required: false,
    maxLength: 500
  })
  @IsOptional()
  @IsString({ message: 'Описание должно быть строкой' })
  description?: string;

  @ApiProperty({
    description: 'Активен ли промокод',
    example: true,
    required: false
  })
  @IsOptional()
  @IsBoolean({ message: 'Статус активности должен быть булевым значением' })
  isActive?: boolean;
}
