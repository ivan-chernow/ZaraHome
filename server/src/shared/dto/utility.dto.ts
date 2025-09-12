import {
  IsString,
  IsOptional,
  IsNumber,
  IsPositive,
  IsBoolean,
  MaxLength,
  MinLength,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SHARED_CONSTANTS } from '../shared.constants';

export class GenerateRandomStringDto {
  @ApiProperty({
    description: 'Длина генерируемой строки',
    example: 16,
    minimum: 1,
    maximum: 1000,
  })
  @IsNumber()
  @IsPositive()
  @MinLength(1)
  @MaxLength(1000)
  length: number;

  @ApiPropertyOptional({
    description: 'Использовать только буквы и цифры',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  alphanumericOnly?: boolean;

  @ApiPropertyOptional({
    description: 'Использовать специальные символы',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  includeSpecialChars?: boolean;

  @ApiPropertyOptional({
    description: 'Использовать заглавные буквы',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  includeUppercase?: boolean;
}

export class HashStringDto {
  @ApiProperty({
    description: 'Строка для хеширования',
    example: 'mySecretPassword123',
    maxLength: SHARED_CONSTANTS.VALIDATION.MAX_STRING_LENGTH,
  })
  @IsString()
  @MaxLength(SHARED_CONSTANTS.VALIDATION.MAX_STRING_LENGTH)
  value: string;

  @ApiPropertyOptional({
    description: 'Алгоритм хеширования',
    example: 'sha256',
    enum: ['md5', 'sha1', 'sha256', 'sha512'],
    default: 'sha256',
  })
  @IsOptional()
  @IsString()
  algorithm?: string;

  @ApiPropertyOptional({
    description: 'Соль для хеширования',
    example: 'randomSalt123',
  })
  @IsOptional()
  @IsString()
  salt?: string;
}

export class CompareHashDto {
  @ApiProperty({
    description: 'Исходное значение',
    example: 'mySecretPassword123',
  })
  @IsString()
  originalValue: string;

  @ApiProperty({
    description: 'Хеш для сравнения',
    example: 'a1b2c3d4e5f6...',
  })
  @IsString()
  hash: string;

  @ApiPropertyOptional({
    description: 'Алгоритм хеширования',
    example: 'sha256',
  })
  @IsOptional()
  @IsString()
  algorithm?: string;
}

export class FormatBytesDto {
  @ApiProperty({
    description: 'Количество байт для форматирования',
    example: 1048576,
  })
  @IsNumber()
  @IsPositive()
  bytes: number;

  @ApiPropertyOptional({
    description: 'Количество знаков после запятой',
    example: 2,
    default: 2,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  decimals?: number;

  @ApiPropertyOptional({
    description: 'Использовать бинарные префиксы (KiB, MiB)',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  binary?: boolean;
}

export class FormatDurationDto {
  @ApiProperty({
    description: 'Длительность в миллисекундах',
    example: 3661000,
  })
  @IsNumber()
  @IsPositive()
  milliseconds: number;

  @ApiPropertyOptional({
    description: 'Формат вывода',
    example: 'human',
    enum: ['short', 'long', 'human'],
    default: 'human',
  })
  @IsOptional()
  @IsString()
  format?: string;

  @ApiPropertyOptional({
    description: 'Показывать нулевые значения',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  showZero?: boolean;
}

export class SleepDto {
  @ApiProperty({
    description: 'Время ожидания в миллисекундах',
    example: 1000,
    minimum: 1,
    maximum: 60000,
  })
  @IsNumber()
  @IsPositive()
  @MinLength(1)
  @MaxLength(60000)
  milliseconds: number;
}

export class RetryDto {
  @ApiProperty({
    description: 'Функция для повторного выполнения',
    example: 'async function() { return await apiCall(); }',
  })
  @IsString()
  functionName: string;

  @ApiProperty({
    description: 'Количество попыток',
    example: 3,
    minimum: 1,
    maximum: 10,
  })
  @IsNumber()
  @IsPositive()
  @MinLength(1)
  @MaxLength(10)
  attempts: number;

  @ApiProperty({
    description: 'Задержка между попытками в миллисекундах',
    example: 1000,
    minimum: 100,
    maximum: 30000,
  })
  @IsNumber()
  @IsPositive()
  @MinLength(100)
  @MaxLength(30000)
  delay: number;

  @ApiPropertyOptional({
    description: 'Увеличивать задержку экспоненциально',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  exponential?: boolean;

  @ApiPropertyOptional({
    description: 'Максимальная задержка в миллисекундах',
    example: 10000,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  maxDelay?: number;
}

export class UtilityResponseDto {
  @ApiProperty({
    description: 'Успешность операции',
    example: true,
  })
  success: boolean;

  @ApiPropertyOptional({
    description: 'Результат операции',
  })
  result?: any;

  @ApiPropertyOptional({
    description: 'Сообщение об операции',
    example: 'Строка успешно сгенерирована',
  })
  message?: string;

  @ApiProperty({
    description: 'Время выполнения операции в миллисекундах',
    example: 5,
  })
  executionTime: number;

  @ApiPropertyOptional({
    description: 'Дополнительные метаданные',
  })
  metadata?: Record<string, any>;
}

export class BulkUtilityDto {
  @ApiProperty({
    description: 'Массив операций для выполнения',
  })
  @IsArray()
  operations: {
    type: string;
    data: any;
    options?: Record<string, any>;
  }[];

  @ApiPropertyOptional({
    description: 'Выполнять операции параллельно',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  parallel?: boolean;

  @ApiPropertyOptional({
    description: 'Максимальное количество параллельных операций',
    example: 5,
    default: 3,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  maxConcurrency?: number;
}

export class BulkUtilityResultDto {
  @ApiProperty({
    description: 'Общий результат операций',
    example: true,
  })
  overallSuccess: boolean;

  @ApiProperty({
    description: 'Результаты каждой операции',
  })
  results: UtilityResponseDto[];

  @ApiProperty({
    description: 'Количество успешных операций',
    example: 8,
  })
  successCount: number;

  @ApiProperty({
    description: 'Количество неуспешных операций',
    example: 2,
  })
  failureCount: number;

  @ApiProperty({
    description: 'Общее время выполнения в миллисекундах',
    example: 150,
  })
  totalExecutionTime: number;

  @ApiPropertyOptional({
    description: 'Детали выполнения',
  })
  details?: Record<string, any>;
}
