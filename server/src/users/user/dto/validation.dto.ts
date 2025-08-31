import { IsEmail, IsString, IsOptional, MinLength, MaxLength, IsPhoneNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ description: 'Текущий пароль' })
  @IsString()
  @MinLength(8)
  currentPassword: string;

  @ApiProperty({ description: 'Новый пароль' })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  newPassword: string;
}

export class ChangeEmailDto {
  @ApiProperty({ description: 'Новый email адрес' })
  @IsEmail()
  newEmail: string;

  @ApiProperty({ description: 'Пароль для подтверждения' })
  @IsString()
  password: string;
}

export class AddressDto {
  @ApiProperty({ description: 'Имя' })
  @IsString()
  @MaxLength(100)
  firstName: string;

  @ApiProperty({ description: 'Фамилия' })
  @IsString()
  @MaxLength(100)
  lastName: string;

  @ApiPropertyOptional({ description: 'Отчество' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  patronymic?: string;

  @ApiProperty({ description: 'Телефон' })
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({ description: 'Страна' })
  @IsString()
  @MaxLength(100)
  country: string;

  @ApiProperty({ description: 'Регион/область' })
  @IsString()
  @MaxLength(100)
  region: string;

  @ApiProperty({ description: 'Город' })
  @IsString()
  @MaxLength(100)
  city: string;

  @ApiProperty({ description: 'Улица' })
  @IsString()
  @MaxLength(200)
  street: string;

  @ApiProperty({ description: 'Дом' })
  @IsString()
  @MaxLength(20)
  house: string;

  @ApiPropertyOptional({ description: 'Строение' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  building?: string;

  @ApiPropertyOptional({ description: 'Квартира' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  apartment?: string;

  @ApiProperty({ description: 'Почтовый индекс' })
  @IsString()
  @MaxLength(20)
  postalCode: string;

  @ApiPropertyOptional({ description: 'Дополнительная информация' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  additionalInfo?: string;
}

