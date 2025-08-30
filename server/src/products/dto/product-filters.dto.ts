import { IsOptional, IsNumber, IsBoolean, IsString, Min, Max, IsEnum } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PRODUCTS_CONSTANTS } from '../products.constants';

export class ProductFiltersDto {
  @ApiProperty({
    description: 'Номер страницы',
    example: 1,
    required: false,
    minimum: 1
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Номер страницы должен быть числом' })
  @Min(1, { message: 'Номер страницы должен быть больше 0' })
  page?: number;

  @ApiProperty({
    description: 'Количество элементов на странице',
    example: 20,
    required: false,
    minimum: 1,
    maximum: 100
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Лимит должен быть числом' })
  @Min(PRODUCTS_CONSTANTS.MIN_PAGE_SIZE, { message: `Минимум ${PRODUCTS_CONSTANTS.MIN_PAGE_SIZE} элементов` })
  @Max(PRODUCTS_CONSTANTS.MAX_PAGE_SIZE, { message: `Максимум ${PRODUCTS_CONSTANTS.MAX_PAGE_SIZE} элементов` })
  limit?: number;

  @ApiProperty({
    description: 'ID категории',
    example: 1,
    required: false
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'ID категории должен быть числом' })
  @Min(1, { message: 'ID категории должен быть больше 0' })
  categoryId?: number;

  @ApiProperty({
    description: 'ID подкатегории',
    example: 1,
    required: false
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'ID подкатегории должен быть числом' })
  @Min(1, { message: 'ID подкатегории должен быть больше 0' })
  subCategoryId?: number;

  @ApiProperty({
    description: 'ID типа',
    example: 1,
    required: false
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'ID типа должен быть числом' })
  @Min(1, { message: 'ID типа должен быть больше 0' })
  typeId?: number;

  @ApiProperty({
    description: 'Минимальная цена',
    example: 1000,
    required: false,
    minimum: 0
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Минимальная цена должна быть числом' })
  @Min(PRODUCTS_CONSTANTS.MIN_PRICE, { message: 'Минимальная цена не может быть отрицательной' })
  @Max(PRODUCTS_CONSTANTS.MAX_PRICE, { message: 'Минимальная цена слишком высокая' })
  minPrice?: number;

  @ApiProperty({
    description: 'Максимальная цена',
    example: 5000,
    required: false,
    minimum: 0
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Максимальная цена должна быть числом' })
  @Min(PRODUCTS_CONSTANTS.MIN_PRICE, { message: 'Максимальная цена не может быть отрицательной' })
  @Max(PRODUCTS_CONSTANTS.MAX_PRICE, { message: 'Максимальная цена слишком высокая' })
  maxPrice?: number;

  @ApiProperty({
    description: 'Только новые продукты',
    example: true,
    required: false
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean({ message: 'Параметр isNew должен быть булевым значением' })
  isNew?: boolean;

  @ApiProperty({
    description: 'Только продукты со скидкой',
    example: true,
    required: false
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean({ message: 'Параметр hasDiscount должен быть булевым значением' })
  hasDiscount?: boolean;

  @ApiProperty({
    description: 'Только доступные продукты',
    example: true,
    required: false
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean({ message: 'Параметр isAvailable должен быть булевым значением' })
  isAvailable?: boolean;

  @ApiProperty({
    description: 'Поисковый запрос',
    example: 'платье',
    required: false,
    minLength: 2,
    maxLength: 100
  })
  @IsOptional()
  @IsString({ message: 'Поисковый запрос должен быть строкой' })
  @Min(PRODUCTS_CONSTANTS.MIN_SEARCH_LENGTH, { message: `Поисковый запрос должен содержать минимум ${PRODUCTS_CONSTANTS.MIN_SEARCH_LENGTH} символа` })
  @Max(PRODUCTS_CONSTANTS.MAX_SEARCH_LENGTH, { message: `Поисковый запрос слишком длинный` })
  search?: string;

  @ApiProperty({
    description: 'Поле для сортировки',
    example: 'price',
    required: false,
    enum: Object.values(PRODUCTS_CONSTANTS.SORT_FIELDS)
  })
  @IsOptional()
  @IsEnum(Object.values(PRODUCTS_CONSTANTS.SORT_FIELDS), { message: 'Неверное поле для сортировки' })
  sortField?: 'price' | 'createdAt' | 'name_ru' | 'discount';

  @ApiProperty({
    description: 'Порядок сортировки',
    example: 'DESC',
    required: false,
    enum: Object.values(PRODUCTS_CONSTANTS.SORT_ORDERS)
  })
  @IsOptional()
  @IsEnum(Object.values(PRODUCTS_CONSTANTS.SORT_ORDERS), { message: 'Неверный порядок сортировки' })
  sortOrder?: 'ASC' | 'DESC';
}
