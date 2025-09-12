import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindProductsQueryDto {
  @ApiPropertyOptional({
    type: Number,
    description: 'Номер страницы',
    default: 1,
  })
  page?: number;

  @ApiPropertyOptional({
    type: Number,
    description: 'Количество элементов',
    default: 20,
  })
  limit?: number;

  @ApiPropertyOptional({ type: Number, description: 'ID категории' })
  categoryId?: number;

  @ApiPropertyOptional({ type: Number, description: 'ID подкатегории' })
  subCategoryId?: number;

  @ApiPropertyOptional({ type: Number, description: 'ID типа' })
  typeId?: number;

  @ApiPropertyOptional({ type: Number, description: 'Минимальная цена' })
  minPrice?: number;

  @ApiPropertyOptional({ type: Number, description: 'Максимальная цена' })
  maxPrice?: number;

  @ApiPropertyOptional({ type: Boolean, description: 'Только новые' })
  isNew?: boolean;

  @ApiPropertyOptional({ type: Boolean, description: 'Только со скидкой' })
  hasDiscount?: boolean;

  @ApiPropertyOptional({ type: Boolean, description: 'Только доступные' })
  isAvailable?: boolean;

  @ApiPropertyOptional({ type: String, description: 'Поисковый запрос' })
  search?: string;

  @ApiPropertyOptional({
    enum: ['price', 'createdAt', 'name_ru', 'discount'],
    description: 'Поле сортировки',
  })
  sortField?: 'price' | 'createdAt' | 'name_ru' | 'discount';

  @ApiPropertyOptional({
    enum: ['ASC', 'DESC'],
    description: 'Порядок сортировки',
  })
  sortOrder?: 'ASC' | 'DESC';
}
