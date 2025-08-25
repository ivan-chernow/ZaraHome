import { IsString, IsNumber, IsPositive } from 'class-validator';

export class ValidatePromocodeDto {
  @IsString()
  code: string;

  @IsNumber()
  @IsPositive()
  orderAmount: number;
}
