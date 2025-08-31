import { IsEnum } from 'class-validator';
import { OrderStatus } from 'src/shared/shared.interfaces';

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;
}


