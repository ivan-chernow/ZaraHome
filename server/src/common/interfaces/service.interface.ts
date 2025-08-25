export interface IBaseService<T> {
  create(data: any): Promise<T>;
  findAll(): Promise<T[]>;
  findOne(id: number): Promise<T | null>;
  update(id: number, data: any): Promise<T>;
  delete(id: number): Promise<void>;
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
}

export interface IFavoritesService extends IBaseService<any> {
  getUserFavorites(userId: number): Promise<any[]>;
  addToFavorites(userId: number, productId: number): Promise<any>;
  removeFromFavorites(userId: number, productId: number): Promise<void>;
}

export interface IOrderService extends IBaseService<any> {
  getUserOrders(userId: number): Promise<any[]>;
  updateOrderStatus(orderId: number, status: string): Promise<any>;
  calculateOrderTotal(items: any[]): Promise<number>;
}

export interface IPromocodeService extends IBaseService<any> {
  validatePromocode(code: string): Promise<any | null>;
  applyPromocode(code: string, userId: number, orderId: number): Promise<any>;
  deactivatePromocode(id: number): Promise<void>;
}
