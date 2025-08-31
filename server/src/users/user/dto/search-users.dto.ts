import { IsOptional, IsString, IsNumber, IsEnum, Min, Max, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { USERS_CONSTANTS } from '../../users.constants';
import { UserRole } from 'src/common/enums/user-role.enum';

export class SearchUsersDto {
  @ApiPropertyOptional({ 
    description: 'Поисковый запрос (по email, имени, фамилии)',
    example: 'ivan',
    minLength: USERS_CONSTANTS.MIN_SEARCH_QUERY_LENGTH,
    maxLength: USERS_CONSTANTS.MAX_SEARCH_QUERY_LENGTH
  })
  @IsOptional()
  @IsString()
  @Min(USERS_CONSTANTS.MIN_SEARCH_QUERY_LENGTH, { message: USERS_CONSTANTS.ERRORS.SEARCH_QUERY_TOO_SHORT })
  @Max(USERS_CONSTANTS.MAX_SEARCH_QUERY_LENGTH, { message: USERS_CONSTANTS.ERRORS.SEARCH_QUERY_TOO_LONG })
  query?: string;

  @ApiPropertyOptional({ 
    description: 'Роль пользователя',
    enum: UserRole
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({ 
    description: 'Статус пользователя',
    enum: ['active', 'inactive', 'suspended', 'pending_verification']
  })
  @IsOptional()
  @IsString()
  @IsIn(['active', 'inactive', 'suspended', 'pending_verification'])
  status?: string;

  @ApiPropertyOptional({ 
    description: 'Подтвержден ли email'
  })
  @IsOptional()
  isEmailVerified?: boolean;

  @ApiPropertyOptional({ 
    description: 'Номер страницы',
    default: 1,
    minimum: 1
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: USERS_CONSTANTS.ERRORS.INVALID_PAGINATION })
  @Min(1, { message: USERS_CONSTANTS.ERRORS.INVALID_PAGINATION })
  page?: number = 1;

  @ApiPropertyOptional({ 
    description: 'Количество элементов на странице',
    default: USERS_CONSTANTS.DEFAULT_PAGE_SIZE,
    minimum: USERS_CONSTANTS.MIN_PAGE_SIZE,
    maximum: USERS_CONSTANTS.MAX_PAGE_SIZE
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: USERS_CONSTANTS.ERRORS.INVALID_PAGINATION })
  @Min(USERS_CONSTANTS.MIN_PAGE_SIZE, { message: USERS_CONSTANTS.ERRORS.INVALID_PAGINATION })
  @Max(USERS_CONSTANTS.MAX_PAGE_SIZE, { message: USERS_CONSTANTS.ERRORS.INVALID_PAGINATION })
  limit?: number = USERS_CONSTANTS.DEFAULT_PAGE_SIZE;

  @ApiPropertyOptional({ 
    description: 'Поле для сортировки',
    enum: USERS_CONSTANTS.FILTERS.ALLOWED_SORT_FIELDS,
    default: USERS_CONSTANTS.FILTERS.DEFAULT_SORT_FIELD
  })
  @IsOptional()
  @IsString()
  @IsIn(USERS_CONSTANTS.FILTERS.ALLOWED_SORT_FIELDS)
  sortBy?: string = USERS_CONSTANTS.FILTERS.DEFAULT_SORT_FIELD;

  @ApiPropertyOptional({ 
    description: 'Порядок сортировки',
    enum: USERS_CONSTANTS.FILTERS.ALLOWED_SORT_ORDERS,
    default: USERS_CONSTANTS.FILTERS.DEFAULT_SORT_ORDER
  })
  @IsOptional()
  @IsString()
  @IsIn(USERS_CONSTANTS.FILTERS.ALLOWED_SORT_ORDERS)
  sortOrder?: 'ASC' | 'DESC' = USERS_CONSTANTS.FILTERS.DEFAULT_SORT_ORDER;
}

