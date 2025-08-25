import { IsNumber, IsPositive, IsOptional } from 'class-validator';

export class AddToCartDto {
  @IsNumber()
  @IsPositive()
  productId: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  quantity?: number;
}
