import { IsArray, IsNumber, ArrayMinSize, ArrayMaxSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddMultipleToCartDto {
  @ApiProperty({
    description: 'Список ID товаров для добавления в корзину',
    example: [1, 2, 3],
    type: [Number],
    minItems: 1,
    maxItems: 50,
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @ArrayMinSize(1, { message: 'Должен быть указан хотя бы один товар' })
  @ArrayMaxSize(50, { message: 'Максимум 50 товаров за раз' })
  productIds: number[];
}
