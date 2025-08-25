import { IsOptional, IsNumber, IsString, IsDate, IsBoolean, IsArray, IsObject, ValidateNested, Min, Max, Length } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Базовый DTO для создания сущности
 */
export class BaseCreateDto {
  @ApiPropertyOptional({ description: 'ID сущности (автогенерируется)' })
  @IsOptional()
  @IsNumber()
  id?: number;

  @ApiPropertyOptional({ description: 'Дата создания' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  createdAt?: Date;

  @ApiPropertyOptional({ description: 'Дата обновления' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  updatedAt?: Date;
}

/**
 * Базовый DTO для обновления сущности
 */
export class BaseUpdateDto {
  @ApiPropertyOptional({ description: 'Дата обновления' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  updatedAt?: Date;
}

/**
 * Базовый DTO для пагинации
 */
export class PaginationDto {
  @ApiPropertyOptional({ description: 'Номер страницы', default: 1, minimum: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  @Transform(({ value }) => parseInt(value))
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Количество элементов на странице', default: 10, minimum: 1, maximum: 100 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  @Transform(({ value }) => parseInt(value))
  limit?: number = 10;
}

/**
 * Базовый DTO для сортировки
 */
export class SortDto {
  @ApiPropertyOptional({ description: 'Поле для сортировки' })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  sortBy?: string;

  @ApiPropertyOptional({ description: 'Порядок сортировки', enum: ['ASC', 'DESC'], default: 'ASC' })
  @IsOptional()
  @IsString()
  @Length(3, 4)
  sortOrder?: 'ASC' | 'DESC' = 'ASC';
}

/**
 * Базовый DTO для фильтрации
 */
export class FilterDto {
  @ApiPropertyOptional({ description: 'Поисковый запрос' })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  search?: string;

  @ApiPropertyOptional({ description: 'Фильтры в формате JSON' })
  @IsOptional()
  @IsString()
  filters?: string;

  @ApiPropertyOptional({ description: 'Дата начала периода' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @ApiPropertyOptional({ description: 'Дата окончания периода' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @ApiPropertyOptional({ description: 'Минимальное значение' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minValue?: number;

  @ApiPropertyOptional({ description: 'Максимальное значение' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxValue?: number;

  @ApiPropertyOptional({ description: 'Активность' })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;
}

/**
 * Базовый DTO для ответа с пагинацией
 */
export class PaginatedResponseDto<T> {
  @ApiProperty({ description: 'Данные' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  data: T[];

  @ApiProperty({ description: 'Общее количество элементов' })
  @IsNumber()
  total: number;

  @ApiProperty({ description: 'Текущая страница' })
  @IsNumber()
  page: number;

  @ApiProperty({ description: 'Количество элементов на странице' })
  @IsNumber()
  limit: number;

  @ApiProperty({ description: 'Общее количество страниц' })
  @IsNumber()
  pages: number;

  @ApiProperty({ description: 'Есть ли следующая страница' })
  @IsBoolean()
  hasNext: boolean;

  @ApiProperty({ description: 'Есть ли предыдущая страница' })
  @IsBoolean()
  hasPrev: boolean;
}

/**
 * Базовый DTO для поиска
 */
export class SearchDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Поисковый запрос' })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  q?: string;

  @ApiPropertyOptional({ description: 'Фильтры' })
  @IsOptional()
  @IsString()
  filters?: string;

  @ApiPropertyOptional({ description: 'Сортировка' })
  @IsOptional()
  @IsString()
  sort?: string;
}

/**
 * Базовый DTO для статистики
 */
export class StatsDto {
  @ApiProperty({ description: 'Общее количество' })
  @IsNumber()
  total: number;

  @ApiProperty({ description: 'Количество за сегодня' })
  @IsNumber()
  todayCount: number;

  @ApiProperty({ description: 'Последнее обновление' })
  @IsDate()
  @Type(() => Date)
  lastUpdated: Date;
}

/**
 * Базовый DTO для файла
 */
export class FileDto {
  @ApiProperty({ description: 'Имя файла' })
  @IsString()
  @Length(1, 255)
  filename: string;

  @ApiProperty({ description: 'Оригинальное имя файла' })
  @IsString()
  @Length(1, 255)
  originalname: string;

  @ApiProperty({ description: 'MIME тип файла' })
  @IsString()
  @Length(1, 100)
  mimetype: string;

  @ApiProperty({ description: 'Размер файла в байтах' })
  @IsNumber()
  size: number;

  @ApiProperty({ description: 'Путь к файлу' })
  @IsString()
  @Length(1, 500)
  path: string;
}

/**
 * Базовый DTO для загрузки файлов
 */
export class UploadFilesDto {
  @ApiProperty({ description: 'Загруженные файлы', type: [FileDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FileDto)
  files: FileDto[];

  @ApiProperty({ description: 'Количество загруженных файлов' })
  @IsNumber()
  count: number;

  @ApiProperty({ description: 'Общий размер файлов в байтах' })
  @IsNumber()
  totalSize: number;
}
