import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegistrationInitiateDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class RegistrationVerifyDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  code: string;
}

export class RegistrationCompleteDto {
  @IsString()
  @IsNotEmpty()
  sessionToken: string;

  @IsString()
  @MinLength(6)
  password: string;
}


