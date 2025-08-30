export interface IBaseService<T> {
  create(_data: unknown): Promise<T>;
  findAll(): Promise<T[]>;
  findOne(_id: number): Promise<T | null>;
  update(_id: number, _data: unknown): Promise<T>;
  delete(_id: number): Promise<void>;
}

export interface IAuthService {
  validateUser(_email: string, _password: string): Promise<unknown>;
  login(_user: unknown, _res?: unknown): Promise<unknown>;
  refreshTokens(_refreshToken: string, _res?: unknown): Promise<unknown>;
  logout(_userId: number, _res?: unknown): Promise<unknown>;
}

export interface IProductService {
  create(_data: unknown): Promise<unknown>;
  findAll(_filters?: unknown, _sort?: unknown, _pagination?: unknown): Promise<unknown>;
  findOne(_id: number): Promise<unknown | null>;
  update(_id: number, _data: unknown): Promise<unknown>;
  delete(_id: number): Promise<void>;
  getCatalog(): Promise<unknown[]>;
  findByIds(_ids: number[]): Promise<unknown[]>;
}

import { ChangePasswordDto, ProfileDto, ChangeDeliveryAddressDto } from '../../users/user/dto/user.dto';

export interface IUserService extends IBaseService<unknown> {
  findOne(_userId: number): Promise<unknown>;
  getProfile(_userId: number): Promise<ProfileDto>;
  changePassword(_userId: number, _dto: ChangePasswordDto): Promise<{ message: string }>;
  changeEmail(_userId: number, _currentEmail: string, _newEmail: string): Promise<{ message: string }>;
  changeDeliveryAddress(_userId: number, _addressData: ChangeDeliveryAddressDto): Promise<{ message: string }>;
  getDeliveryAddresses(_userId: number): Promise<unknown[]>;
  addDeliveryAddress(_userId: number, _addressData: ChangeDeliveryAddressDto): Promise<unknown>;
  updateDeliveryAddress(_userId: number, _addressId: number, _addressData: ChangeDeliveryAddressDto): Promise<unknown>;
  deleteDeliveryAddress(_userId: number, _addressId: number): Promise<void>;
}

export interface ICartService extends IBaseService<unknown> {
  getUserCart(_userId: number): Promise<unknown[]>;
  addToCart(_userId: number, _productId: number): Promise<unknown>;
  removeFromCart(_userId: number, _productId: number): Promise<void>;
  clearCart(_userId: number): Promise<void>;
  getCartStatus(_userId: number, _productIds: number[]): Promise<Record<number, boolean>>;
}

export interface IFavoritesService {
  add(_userId: number, _productId: number): Promise<unknown>;
  remove(_userId: number, _productId: number): Promise<void>;
  findAll(_userId: number): Promise<unknown[]>;
  getFavoriteStatus(_userId: number, _productIds: number[]): Promise<Record<number, boolean>>;
}

import { OrderStatus } from 'src/common/enums/order-status.enum';
import { Order } from 'src/orders/entity/order.entity';
import { CreateOrderDto } from 'src/orders/dto/create-order.dto';
import { UpdateOrderDto } from 'src/orders/dto/update-order.dto';

export interface IOrderService {
  createOrder(_createOrderDto: CreateOrderDto, _userId: number): Promise<Order>;
  getUserOrders(_userId: number, _page?: number, _limit?: number): Promise<unknown>;
  getActiveOrder(_userId: number): Promise<Order | null>;
  getOrderById(_orderId: number, _userId: number): Promise<Order | null>;
  updateOrderStatus(_orderId: number, _status: OrderStatus, _userId: number): Promise<Order>;
  cancelOrder(_orderId: number, _userId: number): Promise<Order>;
  updateOrder(_orderId: number, _updateOrderDto: UpdateOrderDto, _userId: number): Promise<Order>;
}

export interface IPromocodeService {
  create(_code: string, _discount: number, _options?: unknown): Promise<unknown>;
  validateAndApply(_code: string, _orderAmount: number, _userId?: number): Promise<{ 
    isValid: boolean; 
    message?: string; 
    discount?: number;
    finalAmount?: number;
  }>;
  getAllActive(_page?: number, _limit?: number): Promise<unknown>;
  getAll(_page?: number, _limit?: number): Promise<unknown>;
  deactivate(_code: string): Promise<void>;
  update(_code: string, _data: unknown): Promise<unknown>;
  deactivateMultiple(_codes: string[]): Promise<unknown>;
  searchPromocodes(_query: string, _page?: number, _limit?: number): Promise<unknown>;
  getPromocodeStats(): Promise<unknown>;
  getPromocodeUsageStats(_promocodeId: number): Promise<unknown>;
}

export interface IAdminService {
  addProduct(_files: Express.Multer.File[], _productData: unknown): Promise<unknown>;
}
