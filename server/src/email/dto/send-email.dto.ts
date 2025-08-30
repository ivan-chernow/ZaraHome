import { IsEmail, IsString, IsNotEmpty, IsOptional, IsObject, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EMAIL_CONSTANTS } from '../email.constants';

export class SendEmailDto {
  @ApiProperty({
    description: 'Email адрес получателя',
    example: 'user@example.com',
    maxLength: EMAIL_CONSTANTS.MAX_EMAIL_LENGTH
  })
  @IsEmail({}, { message: 'Неверный формат email адреса' })
  @IsNotEmpty({ message: 'Email адрес обязателен' })
  @MaxLength(EMAIL_CONSTANTS.MAX_EMAIL_LENGTH, { message: 'Email адрес слишком длинный' })
  to: string;

  @ApiProperty({
    description: 'Тема письма',
    example: 'Подтверждение регистрации',
    maxLength: EMAIL_CONSTANTS.MAX_SUBJECT_LENGTH
  })
  @IsString({ message: 'Тема должна быть строкой' })
  @IsNotEmpty({ message: 'Тема письма обязательна' })
  @MaxLength(EMAIL_CONSTANTS.MAX_SUBJECT_LENGTH, { message: 'Тема письма слишком длинная' })
  subject: string;

  @ApiProperty({
    description: 'Тип шаблона',
    example: 'verification',
    enum: Object.values(EMAIL_CONSTANTS.TEMPLATE_TYPES)
  })
  @IsString({ message: 'Тип шаблона должен быть строкой' })
  @IsNotEmpty({ message: 'Тип шаблона обязателен' })
  templateType: string;

  @ApiProperty({
    description: 'Контекст для шаблона',
    example: { code: '123456', name: 'John' },
    type: 'object',
    additionalProperties: true
  })
  @IsObject({ message: 'Контекст должен быть объектом' })
  @IsNotEmpty({ message: 'Контекст обязателен' })
  context: Record<string, any>;

  @ApiProperty({
    description: 'Количество попыток отправки',
    example: 3,
    required: false,
    minimum: 1,
    maximum: 5
  })
  @IsOptional()
  retryAttempts?: number;
}
