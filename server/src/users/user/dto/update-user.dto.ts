import { IsEmail, IsString, IsOptional, MinLength, MaxLength, IsEnum, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from 'src/shared/shared.interfaces';
import { USERS_CONSTANTS } from '../../users.constants';

export class UpdateUserDto {
  @ApiPropertyOptional({ 
    description: 'Email пользователя',
    example: 'user@example.com',
    maxLength: USERS_CONSTANTS.MAX_EMAIL_LENGTH
  })
  @IsOptional()
  @IsEmail({}, { message: USERS_CONSTANTS.ERRORS.INVALID_EMAIL_FORMAT })
  @MaxLength(USERS_CONSTANTS.MAX_EMAIL_LENGTH, { message: USERS_CONSTANTS.ERRORS.EMAIL_TOO_LONG })
  email?: string;

  @ApiPropertyOptional({ 
    description: 'Имя пользователя',
    example: 'Иван',
    maxLength: USERS_CONSTANTS.MAX_NAME_LENGTH
  })
  @IsOptional()
  @IsString()
  @MaxLength(USERS_CONSTANTS.MAX_NAME_LENGTH, { message: USERS_CONSTANTS.ERRORS.NAME_TOO_LONG })
  firstName?: string;

  @ApiPropertyOptional({ 
    description: 'Фамилия пользователя',
    example: 'Иванов',
    maxLength: USERS_CONSTANTS.MAX_NAME_LENGTH
  })
  @IsOptional()
  @IsString()
  @MaxLength(USERS_CONSTANTS.MAX_NAME_LENGTH, { message: USERS_CONSTANTS.ERRORS.NAME_TOO_LONG })
  lastName?: string;

  @ApiPropertyOptional({ 
    description: 'Номер телефона',
    example: '+7 999 123-45-67',
    maxLength: USERS_CONSTANTS.MAX_PHONE_LENGTH
  })
  @IsOptional()
  @IsString()
  @MaxLength(USERS_CONSTANTS.MAX_PHONE_LENGTH, { message: USERS_CONSTANTS.ERRORS.INVALID_PHONE_FORMAT })
  phone?: string;

  @ApiPropertyOptional({ 
    description: 'Основной адрес доставки',
    example: 'ул. Пушкина, д. 10, кв. 5',
    maxLength: USERS_CONSTANTS.MAX_ADDRESS_LENGTH
  })
  @IsOptional()
  @IsString()
  @MaxLength(USERS_CONSTANTS.MAX_ADDRESS_LENGTH, { message: USERS_CONSTANTS.ERRORS.ADDRESS_TOO_LONG })
  defaultAddress?: string;

  @ApiPropertyOptional({ 
    description: 'Роль пользователя',
    enum: UserRole
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({ 
    description: 'Подтвержден ли email'
  })
  @IsOptional()
  @IsBoolean()
  isEmailVerified?: boolean;

  @ApiPropertyOptional({ 
    description: 'Статус пользователя',
    enum: ['active', 'inactive', 'suspended', 'pending_verification']
  })
  @IsOptional()
  @IsString()
  status?: string;
}

