import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetRequestDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class ResetVerifyDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  token: string;
}

export class ResetSetDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @MinLength(6)
  password: string;
}


