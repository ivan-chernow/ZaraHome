import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateOrderDto {
  @ApiPropertyOptional({ example: 'ул. Пушкина, дом Колотушкина' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: '+7 999 000-00-00' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'Позвонить перед доставкой' })
  @IsOptional()
  @IsString()
  comment?: string;
}
