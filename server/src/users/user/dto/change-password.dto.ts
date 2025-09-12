import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { USERS_CONSTANTS } from '../../users.constants';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Текущий пароль',
    example: 'currentPassword123',
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
  currentPassword: string;

  @ApiProperty({
    description: 'Новый пароль',
    example: 'newPassword123',
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
  newPassword: string;

  @ApiProperty({
    description: 'Подтверждение нового пароля',
    example: 'newPassword123',
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
  confirmPassword: string;
}
