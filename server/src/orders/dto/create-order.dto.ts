import { OrderItem } from 'src/common/interfaces/order-item.interface';

export class CreateOrderDto {
  items: OrderItem[];
  
  totalPrice: number;
  totalCount: number;
  address?: string;
  phone?: string;
  comment?: string;
}
