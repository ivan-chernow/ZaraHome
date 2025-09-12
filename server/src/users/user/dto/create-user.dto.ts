import {
  IsEmail,
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from 'src/shared/shared.interfaces';
import { USERS_CONSTANTS } from '../../users.constants';

export class CreateUserDto {
  @ApiProperty({
    description: 'Email пользователя',
    example: 'user@example.com',
    maxLength: USERS_CONSTANTS.MAX_EMAIL_LENGTH,
  })
  @IsEmail({}, { message: USERS_CONSTANTS.ERRORS.INVALID_EMAIL_FORMAT })
  @MaxLength(USERS_CONSTANTS.MAX_EMAIL_LENGTH, {
    message: USERS_CONSTANTS.ERRORS.EMAIL_TOO_LONG,
  })
  email: string;

  @ApiProperty({
    description: 'Пароль пользователя',
    example: 'password123',
    minLength: USERS_CONSTANTS.MIN_PASSWORD_LENGTH,
    maxLength: USERS_CONSTANTS.MAX_PASSWORD_LENGTH,
  })
  @IsString()
  @MinLength(USERS_CONSTANTS.MIN_PASSWORD_LENGTH, {
    message: USERS_CONSTANTS.ERRORS.PASSWORD_TOO_SHORT,
  })
  @MaxLength(USERS_CONSTANTS.MAX_PASSWORD_LENGTH, {
    message: USERS_CONSTANTS.ERRORS.PASSWORD_TOO_LONG,
  })
  password: string;

  @ApiPropertyOptional({
    description: 'Имя пользователя',
    example: 'Иван',
    maxLength: USERS_CONSTANTS.MAX_NAME_LENGTH,
  })
  @IsOptional()
  @IsString()
  @MaxLength(USERS_CONSTANTS.MAX_NAME_LENGTH, {
    message: USERS_CONSTANTS.ERRORS.NAME_TOO_LONG,
  })
  firstName?: string;

  @ApiPropertyOptional({
    description: 'Фамилия пользователя',
    example: 'Иванов',
    maxLength: USERS_CONSTANTS.MAX_NAME_LENGTH,
  })
  @IsOptional()
  @IsString()
  @MaxLength(USERS_CONSTANTS.MAX_NAME_LENGTH, {
    message: USERS_CONSTANTS.ERRORS.NAME_TOO_LONG,
  })
  lastName?: string;

  @ApiPropertyOptional({
    description: 'Номер телефона',
    example: '+7 999 123-45-67',
    maxLength: USERS_CONSTANTS.MAX_PHONE_LENGTH,
  })
  @IsOptional()
  @IsString()
  @MaxLength(USERS_CONSTANTS.MAX_PHONE_LENGTH, {
    message: USERS_CONSTANTS.ERRORS.INVALID_PHONE_FORMAT,
  })
  phone?: string;

  @ApiPropertyOptional({
    description: 'Основной адрес доставки',
    example: 'ул. Пушкина, д. 10, кв. 5',
    maxLength: USERS_CONSTANTS.MAX_ADDRESS_LENGTH,
  })
  @IsOptional()
  @IsString()
  @MaxLength(USERS_CONSTANTS.MAX_ADDRESS_LENGTH, {
    message: USERS_CONSTANTS.ERRORS.ADDRESS_TOO_LONG,
  })
  defaultAddress?: string;

  @ApiPropertyOptional({
    description: 'Роль пользователя',
    enum: UserRole,
    default: UserRole.USER,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({
    description: 'Подтвержден ли email',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isEmailVerified?: boolean;
}
