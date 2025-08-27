import { IsArray, IsNumber, IsPositive, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderItemDto } from './order-item.dto';

export class CreateOrderDto {
  @ApiProperty({ type: () => [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
  
  @ApiProperty({ example: 2500 })
  @IsNumber()
  @IsPositive()
  totalPrice: number;

  @ApiProperty({ example: 3 })
  @IsNumber()
  @IsPositive()
  totalCount: number;

  @ApiPropertyOptional({ example: 'ул. Пушкина, дом Колотушкина' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: '+7 999 000-00-00' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'Позвонить перед доставкой' })
  @IsOptional()
  @IsString()
  comment?: string;
}
