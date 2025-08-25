import { IsArray, IsNumber, IsPositive, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderItemDto } from './order-item.dto';

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
  
  @IsNumber()
  @IsPositive()
  totalPrice: number;

  @IsNumber()
  @IsPositive()
  totalCount: number;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  comment?: string;
}
