import {
  IsString,
  IsOptional,
  IsNumber,
  IsPositive,
  IsEmail,
  MaxLength,
  MinLength,
  IsArray,
  IsObject,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SHARED_CONSTANTS } from '../shared.constants';

export class ValidateEmailDto {
  @ApiProperty({
    description: 'Email для валидации',
    example: 'user@example.com',
    maxLength: SHARED_CONSTANTS.VALIDATION.EMAIL_MAX_LENGTH,
  })
  @IsEmail({}, { message: 'Некорректный формат email' })
  @MaxLength(SHARED_CONSTANTS.VALIDATION.EMAIL_MAX_LENGTH, {
    message: `Email не может быть длиннее ${SHARED_CONSTANTS.VALIDATION.EMAIL_MAX_LENGTH} символов`,
  })
  email: string;
}

export class ValidatePhoneDto {
  @ApiProperty({
    description: 'Номер телефона для валидации',
    example: '+7 999 123-45-67',
    maxLength: SHARED_CONSTANTS.VALIDATION.PHONE_MAX_LENGTH,
  })
  @IsString()
  @MaxLength(SHARED_CONSTANTS.VALIDATION.PHONE_MAX_LENGTH, {
    message: `Номер телефона не может быть длиннее ${SHARED_CONSTANTS.VALIDATION.PHONE_MAX_LENGTH} символов`,
  })
  phone: string;
}

export class ValidatePasswordDto {
  @ApiProperty({
    description: 'Пароль для валидации',
    example: 'SecurePassword123!',
    minLength: SHARED_CONSTANTS.SECURITY.PASSWORD_MIN_LENGTH,
    maxLength: SHARED_CONSTANTS.SECURITY.PASSWORD_MAX_LENGTH,
  })
  @IsString()
  @MinLength(SHARED_CONSTANTS.SECURITY.PASSWORD_MIN_LENGTH, {
    message: `Пароль должен содержать минимум ${SHARED_CONSTANTS.SECURITY.PASSWORD_MIN_LENGTH} символов`,
  })
  @MaxLength(SHARED_CONSTANTS.SECURITY.PASSWORD_MAX_LENGTH, {
    message: `Пароль не может быть длиннее ${SHARED_CONSTANTS.SECURITY.PASSWORD_MAX_LENGTH} символов`,
  })
  password: string;
}

export class ValidateStringDto {
  @ApiProperty({
    description: 'Строка для валидации',
    example: 'Пример строки для валидации',
    maxLength: SHARED_CONSTANTS.VALIDATION.MAX_STRING_LENGTH,
  })
  @IsString()
  @MaxLength(SHARED_CONSTANTS.VALIDATION.MAX_STRING_LENGTH, {
    message: `Строка не может быть длиннее ${SHARED_CONSTANTS.VALIDATION.MAX_STRING_LENGTH} символов`,
  })
  value: string;

  @ApiPropertyOptional({
    description: 'Максимальная длина строки',
    example: 500,
    default: SHARED_CONSTANTS.VALIDATION.MAX_STRING_LENGTH,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  maxLength?: number;
}

export class ValidateArrayDto {
  @ApiProperty({
    description: 'Массив для валидации',
    example: ['item1', 'item2', 'item3'],
    maxLength: SHARED_CONSTANTS.VALIDATION.MAX_ARRAY_LENGTH,
  })
  @IsArray()
  value: any[];

  @ApiPropertyOptional({
    description: 'Максимальная длина массива',
    example: 100,
    default: SHARED_CONSTANTS.VALIDATION.MAX_ARRAY_LENGTH,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  maxLength?: number;
}

export class ValidateObjectDto {
  @ApiProperty({
    description: 'Объект для валидации',
    example: { key1: 'value1', key2: 'value2' },
    maxLength: SHARED_CONSTANTS.VALIDATION.MAX_OBJECT_KEYS,
  })
  @IsObject()
  value: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Максимальное количество ключей',
    example: 50,
    default: SHARED_CONSTANTS.VALIDATION.MAX_OBJECT_KEYS,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  maxKeys?: number;
}

export class ValidationResultDto {
  @ApiProperty({
    description: 'Результат валидации',
    example: true,
  })
  isValid: boolean;

  @ApiProperty({
    description: 'Список ошибок',
    example: ['Email имеет некорректный формат'],
  })
  errors: string[];

  @ApiProperty({
    description: 'Список предупреждений',
    example: ['Email может быть слишком длинным'],
  })
  warnings: string[];

  @ApiPropertyOptional({
    description: 'Нормализованное значение',
  })
  normalizedValue?: any;

  @ApiProperty({
    description: 'Время выполнения валидации в миллисекундах',
    example: 5,
  })
  executionTime: number;
}

export class BulkValidationDto {
  @ApiProperty({
    description: 'Массив значений для валидации',
    example: ['user@example.com', 'admin@example.com'],
  })
  @IsArray()
  values: any[];

  @ApiProperty({
    description: 'Тип валидации',
    example: 'email',
    enum: ['email', 'phone', 'password', 'string', 'array', 'object'],
  })
  @IsString()
  type: string;

  @ApiPropertyOptional({
    description: 'Дополнительные параметры валидации',
  })
  @IsOptional()
  options?: Record<string, any>;
}

export class BulkValidationResultDto {
  @ApiProperty({
    description: 'Общий результат валидации',
    example: true,
  })
  overallValid: boolean;

  @ApiProperty({
    description: 'Результаты валидации для каждого значения',
  })
  results: ValidationResultDto[];

  @ApiProperty({
    description: 'Количество валидных значений',
    example: 8,
  })
  validCount: number;

  @ApiProperty({
    description: 'Количество невалидных значений',
    example: 2,
  })
  invalidCount: number;

  @ApiProperty({
    description: 'Общее время выполнения в миллисекундах',
    example: 25,
  })
  totalExecutionTime: number;
}
