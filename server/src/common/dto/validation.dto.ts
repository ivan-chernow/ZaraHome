import { IsEmail, IsString, MinLength, IsOptional, IsPhoneNumber } from 'class-validator';

export class EmailDto {
  @IsEmail()
  email: string;
}

export class PasswordDto {
  @IsString()
  @MinLength(12)
  password: string;
}

export class ChangePasswordDto {
  @IsString()
  @MinLength(12)
  newPassword: string;
}

export class ChangeEmailDto {
  @IsEmail()
  newEmail: string;
}

export class PhoneDto {
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;
}

export class AddressDto {
  @IsString()
  region: string;

  @IsString()
  city: string;

  @IsString()
  street: string;
}
