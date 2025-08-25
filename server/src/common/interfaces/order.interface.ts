import { OrderStatus } from '../enums/order-status.enum';

export interface IOrder {
  id: number;
  userId: number;
  status: OrderStatus;
  totalAmount: number;
  deliveryAddress: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  size: string;
  color: string;
}

export interface IOrderWithItems extends IOrder {
  items: IOrderItem[];
  user?: any;
}

export interface IOrderItemWithProduct extends IOrderItem {
  product: {
    id: number;
    name_eng: string;
    name_ru: string;
    img: string[];
    colors: string[];
    size: { size: string; price: number }[];
    deliveryDate: string;
    description: string;
    isNew?: boolean;
    discount?: number;
    isAvailable: boolean;
  };
}

export interface IOrderWithProductDetails extends IOrder {
  items: IOrderItemWithProduct[];
  user?: any;
}
