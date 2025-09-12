import {
  IsArray,
  IsOptional,
  IsString,
  ValidateNested,
  Length,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderItemDto } from './order-item.dto';

export class CreateOrderDto {
  @ApiProperty({
    type: () => [OrderItemDto],
    description: 'Товары в заказе',
    minItems: 1,
    maxItems: 50,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiPropertyOptional({
    example: 'SUMMER2024',
    description: 'Промокод для скидки',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  promocode?: string;

  @ApiPropertyOptional({
    example: 'ул. Пушкина, дом Колотушкина',
    description: 'Адрес доставки',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  address?: string;

  @ApiPropertyOptional({
    example: '+7 999 000-00-00',
    description: 'Номер телефона',
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiPropertyOptional({
    example: 'Позвонить перед доставкой',
    description: 'Комментарий к заказу',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  comment?: string;
}
