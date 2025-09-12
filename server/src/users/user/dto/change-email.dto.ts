import { IsEmail, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { USERS_CONSTANTS } from '../../users.constants';

export class ChangeEmailDto {
  @ApiProperty({
    description: 'Текущий email',
    example: 'current@example.com',
    maxLength: USERS_CONSTANTS.MAX_EMAIL_LENGTH,
  })
  @IsEmail({}, { message: USERS_CONSTANTS.ERRORS.INVALID_EMAIL_FORMAT })
  @MaxLength(USERS_CONSTANTS.MAX_EMAIL_LENGTH, {
    message: USERS_CONSTANTS.ERRORS.EMAIL_TOO_LONG,
  })
  currentEmail: string;

  @ApiProperty({
    description: 'Новый email',
    example: 'new@example.com',
    maxLength: USERS_CONSTANTS.MAX_EMAIL_LENGTH,
  })
  @IsEmail({}, { message: USERS_CONSTANTS.ERRORS.INVALID_EMAIL_FORMAT })
  @MaxLength(USERS_CONSTANTS.MAX_EMAIL_LENGTH, {
    message: USERS_CONSTANTS.ERRORS.EMAIL_TOO_LONG,
  })
  newEmail: string;

  @ApiProperty({
    description: 'Пароль для подтверждения',
    example: 'password123',
    minLength: USERS_CONSTANTS.MIN_PASSWORD_LENGTH,
    maxLength: USERS_CONSTANTS.MAX_PASSWORD_LENGTH,
  })
  @IsString()
  password: string;
}
