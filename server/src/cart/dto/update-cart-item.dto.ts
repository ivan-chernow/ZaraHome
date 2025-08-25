import { IsNumber, IsPositive, IsOptional } from 'class-validator';

export class UpdateCartItemDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  quantity?: number;
}
