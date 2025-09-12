import { IsEmail, IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { USERS_CONSTANTS } from '../../users.constants';

export class ProfileDto {
  @ApiProperty({
    description: 'ID пользователя',
    example: 1,
  })
  id: number;

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
  firstName?: string | null;

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
  lastName?: string | null;

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
  phone?: string | null;

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
  defaultAddress?: string | null;

  @ApiProperty({
    description: 'Роль пользователя',
    example: 'user',
  })
  role: string;

  @ApiProperty({
    description: 'Подтвержден ли email',
    example: false,
  })
  isEmailVerified: boolean;

  @ApiProperty({
    description: 'Статус пользователя',
    example: 'active',
  })
  status: string;

  @ApiProperty({
    description: 'Дата создания аккаунта',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Дата последнего обновления',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}
