import { IsNumber, IsPositive, IsString, IsOptional } from 'class-validator';

export class OrderItemDto {
  @IsNumber()
  @IsPositive()
  productId: number;

  @IsString()
  productName: string;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsOptional()
  @IsString()
  size?: string;

  @IsOptional()
  @IsString()
  color?: string;
}
