export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
}

export interface CartItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
}
