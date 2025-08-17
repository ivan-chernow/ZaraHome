export class CreateOrderDto {
  items: Array<{
    productId: number;
    productName: string;
    quantity: number;
    price: number;
    size?: string;
    color?: string;
  }>;
  
  totalPrice: number;
  totalCount: number;
  address?: string;
  phone?: string;
  comment?: string;
}
