import { IsNumber, IsPositive, IsOptional } from 'class-validator';

export class CartItemDto {
  @IsNumber()
  @IsPositive()
  id: number;

  @IsNumber()
  @IsPositive()
  userId: number;

  @IsNumber()
  @IsPositive()
  productId: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  quantity?: number;
}
