import { IsString, IsNotEmpty, Length } from 'class-validator';

export class PromocodeCodeDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 20)
  code: string;
}
