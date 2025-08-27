export interface IBaseService<T> {
  create(data: any): Promise<T>;
  findAll(): Promise<T[]>;
  findOne(id: number): Promise<T | null>;
  update(id: number, data: any): Promise<T>;
  delete(id: number): Promise<void>;
}

export interface IAuthService {
  validateUser(email: string, password: string): Promise<any>;
  login(user: any, res?: any): Promise<any>;
  refreshTokens(refreshToken: string, res?: any): Promise<any>;
  logout(userId: number, res?: any): Promise<any>;
}

export interface IProductService extends IBaseService<any> {
  getCatalog(): Promise<any[]>;
  findByIds(ids: number[]): Promise<any[]>;
}

export interface IUserService extends IBaseService<any> {
  findByEmail(email: string): Promise<any | null>;
  verifyEmail(userId: number): Promise<boolean>;
  changePassword(userId: number, oldPassword: string, newPassword: string): Promise<boolean>;
  changeEmail(userId: number, newEmail: string): Promise<boolean>;
}

export interface ICartService extends IBaseService<any> {
  getUserCart(userId: number): Promise<any[]>;
  addToCart(userId: number, productId: number): Promise<any>;
  removeFromCart(userId: number, productId: number): Promise<void>;
  clearCart(userId: number): Promise<void>;
  getCartStatus(userId: number, productIds: number[]): Promise<Record<number, boolean>>;
}

export interface IFavoritesService {
  add(userId: number, productId: number): Promise<any>;
  remove(userId: number, productId: number): Promise<void>;
  findAll(userId: number): Promise<any[]>;
  getFavoriteStatus(userId: number, productIds: number[]): Promise<Record<number, boolean>>;
}

import { OrderStatus } from 'src/common/enums/order-status.enum';
import { Order } from 'src/orders/entity/order.entity';
import { CreateOrderDto } from 'src/orders/dto/create-order.dto';
import { UpdateOrderDto } from 'src/orders/dto/update-order.dto';

export interface IOrderService {
  createOrder(createOrderDto: CreateOrderDto, userId: number): Promise<Order>;
  getUserOrders(userId: number): Promise<Order[]>;
  getActiveOrder(userId: number): Promise<Order | null>;
  getOrderById(orderId: number, userId: number): Promise<Order | null>;
  updateOrderStatus(orderId: number, status: OrderStatus, userId: number): Promise<Order>;
  cancelOrder(orderId: number, userId: number): Promise<Order>;
  updateOrder(orderId: number, updateOrderDto: UpdateOrderDto, userId: number): Promise<Order>;
}

export interface IPromocodeService {
  create(code: string, discount: number): Promise<any>;
  validateAndApply(code: string, orderAmount: number): Promise<{ 
    isValid: boolean; 
    message?: string; 
    discount?: number;
    finalAmount?: number;
  }>;
  getAllActive(): Promise<any[]>;
  getAll(): Promise<any[]>;
  deactivate(code: string): Promise<void>;
}
