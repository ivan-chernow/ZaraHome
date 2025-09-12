import {
  IsString,
  IsOptional,
  IsNumber,
  IsPositive,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SHARED_CONSTANTS } from '../shared.constants';

export class CacheSetDto {
  @ApiProperty({
    description: 'Ключ кеша',
    example: 'user:123:profile',
    maxLength: 255,
  })
  @IsString()
  @MaxLength(255)
  key: string;

  @ApiProperty({
    description: 'Значение для кеширования',
    example: { id: 123, name: 'John Doe' },
  })
  value: unknown;

  @ApiPropertyOptional({
    description: 'Префикс ключа',
    example: 'user',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  prefix?: string;

  @ApiPropertyOptional({
    description: 'Время жизни в секундах',
    example: 3600,
    minimum: SHARED_CONSTANTS.CACHE.MIN_TTL,
    maximum: SHARED_CONSTANTS.CACHE.MAX_TTL,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  ttl?: number;
}

export class CacheGetDto {
  @ApiProperty({
    description: 'Ключ кеша',
    example: 'user:123:profile',
    maxLength: 255,
  })
  @IsString()
  @MaxLength(255)
  key: string;

  @ApiPropertyOptional({
    description: 'Префикс ключа',
    example: 'user',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  prefix?: string;
}

export class CacheDeleteDto {
  @ApiProperty({
    description: 'Ключ кеша для удаления',
    example: 'user:123:profile',
    maxLength: 255,
  })
  @IsString()
  @MaxLength(255)
  key: string;

  @ApiPropertyOptional({
    description: 'Префикс ключа',
    example: 'user',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  prefix?: string;
}

export class CacheDeleteByPrefixDto {
  @ApiProperty({
    description: 'Префикс для удаления ключей',
    example: 'user:123',
    maxLength: 100,
  })
  @IsString()
  @MaxLength(100)
  prefix: string;
}

export class CacheIncrementDto {
  @ApiProperty({
    description: 'Ключ счетчика',
    example: 'user:123:visits',
    maxLength: 255,
  })
  @IsString()
  @MaxLength(255)
  key: string;

  @ApiPropertyOptional({
    description: 'Префикс ключа',
    example: 'user',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  prefix?: string;

  @ApiPropertyOptional({
    description: 'Значение для увеличения',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  value?: number;
}

export class CacheResponseDto {
  @ApiProperty({
    description: 'Успешность операции',
    example: true,
  })
  success: boolean;

  @ApiPropertyOptional({
    description: 'Сообщение об операции',
    example: 'Кеш успешно обновлен',
  })
  message?: string;

  @ApiPropertyOptional({
    description: 'Данные ответа',
  })
  data?: unknown;

  @ApiProperty({
    description: 'Время выполнения операции в миллисекундах',
    example: 15,
  })
  executionTime: number;
}

export class CacheStatsDto {
  @ApiProperty({
    description: 'Общее количество ключей',
    example: 1250,
  })
  totalKeys: number;

  @ApiProperty({
    description: 'Процент попаданий в кеш',
    example: 0.85,
  })
  hitRate: number;

  @ApiProperty({
    description: 'Процент промахов кеша',
    example: 0.15,
  })
  missRate: number;

  @ApiProperty({
    description: 'Использование памяти в байтах',
    example: 1048576,
  })
  memoryUsage: number;

  @ApiProperty({
    description: 'Среднее время жизни ключей в секундах',
    example: 1800,
  })
  averageTTL: number;

  @ApiPropertyOptional({
    description: 'Самый старый ключ',
  })
  oldestKey?: string;

  @ApiPropertyOptional({
    description: 'Самый новый ключ',
  })
  newestKey?: string;
}

export class CacheHealthDto {
  @ApiProperty({
    description: 'Статус кеша',
    example: 'healthy',
    enum: ['healthy', 'unhealthy', 'degraded'],
  })
  status: string;

  @ApiProperty({
    description: 'Время последней проверки',
    example: '2024-01-01T00:00:00.000Z',
  })
  lastCheck: Date;

  @ApiProperty({
    description: 'Время отклика в миллисекундах',
    example: 5,
  })
  responseTime: number;

  @ApiProperty({
    description: 'Доступность кеша',
    example: true,
  })
  isAvailable: boolean;

  @ApiPropertyOptional({
    description: 'Детали состояния',
  })
  details?: Record<string, unknown>;
}
