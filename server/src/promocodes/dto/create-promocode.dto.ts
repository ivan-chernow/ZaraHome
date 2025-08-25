import { IsString, IsNumber, IsPositive, Max } from 'class-validator';

export class CreatePromocodeDto {
  @IsString()
  code: string;

  @IsNumber()
  @IsPositive()
  @Max(100)
  discount: number;
}
