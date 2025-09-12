// Централизованные интерфейсы для всего приложения

// ============================================================================
// БАЗОВЫЕ ИНТЕРФЕЙСЫ
// ============================================================================

// Swagger декораторы
export const ApiDefaultErrors = (): ClassDecorator => {
  return target => target;
};

// Базовые исключения
export class ResourceNotFoundException extends Error {
  constructor(message: string = 'Ресурс не найден') {
    super(message);
    this.name = 'ResourceNotFoundException';
  }
}

export class ConflictException extends Error {
  constructor(message: string = 'Конфликт данных') {
    super(message);
    this.name = 'ConflictException';
  }
}

export class InternalServerException extends Error {
  constructor(message: string = 'Внутренняя ошибка сервера') {
    super(message);
    this.name = 'InternalServerException';
  }
}

export class BadRequestException extends Error {
  constructor(message: string = 'Некорректный запрос') {
    super(message);
    this.name = 'BadRequestException';
  }
}

export class UnauthorizedException extends Error {
  constructor(message: string = 'Неавторизованный доступ') {
    super(message);
    this.name = 'UnauthorizedException';
  }
}

export class ForbiddenException extends Error {
  constructor(message: string = 'Доступ запрещен') {
    super(message);
    this.name = 'ForbiddenException';
  }
}

import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    email: string;
    role: string;
  };
}

// ============================================================================
// ENUMS
// ============================================================================

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

// ============================================================================
// БАЗОВЫЕ ИНТЕРФЕЙСЫ
// ============================================================================

export interface BaseEntity {
  id: number;
  createdAt: Date;
}

export interface BaseResponse {
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
  timestamp: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface SearchFilters {
  query?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface BulkOperationResult {
  success: boolean;
  processed: number;
  succeeded: number;
  failed: number;
  errors?: string[];
}

// ============================================================================
// ИНТЕРФЕЙСЫ КЕШИРОВАНИЯ
// ============================================================================

export interface ICacheService {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: any, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
  has(key: string): Promise<boolean>;
  increment(key: string, value?: number): Promise<number>;
  decrement(key: string, value?: number): Promise<number>;
  getKeys(pattern?: string): Promise<string[]>;
  getStats(): Promise<any>;
  healthCheck(): Promise<any>;
  getOrSet<T>(key: string, factory: () => Promise<T>, ttl?: number): Promise<T>;
}

// ============================================================================
// ИНТЕРФЕЙСЫ ОБРАБОТКИ ИЗОБРАЖЕНИЙ
// ============================================================================

export interface IImageOptimizationService {
  processAndSave(
    buffer: Buffer,
    originalName: string,
    options?: ImageProcessingOptions
  ): Promise<{ mainPath: string; thumbnailPath?: string }>;
  generateThumbnail(imagePath: string, size?: number): Promise<string>;
  validateImage(buffer: Buffer): Promise<void>;
  compressImage(imagePath: string, quality?: number): Promise<string>;
  resizeImage(
    imagePath: string,
    width: number,
    height: number
  ): Promise<string>;
  convertFormat(
    imagePath: string,
    format: 'webp' | 'jpeg' | 'png'
  ): Promise<string>;
  getImageMetadata(imagePath: string): Promise<Record<string, unknown>>;
  deleteImage(imagePath: string): Promise<void>;
  cleanupOldImages(maxAge?: number): Promise<number>;
}

// ============================================================================
// ИНТЕРФЕЙСЫ ВАЛИДАЦИИ
// ============================================================================

export interface IValidationService {
  validateEmail(email: string): Promise<ValidationResult>;
  validatePhone(phone: string): Promise<ValidationResult>;
  validatePassword(password: string): Promise<ValidationResult>;
  validateString(value: string, maxLength?: number): Promise<ValidationResult>;
  validateArray(value: any[], maxLength?: number): Promise<ValidationResult>;
  validateObject(value: any, maxKeys?: number): Promise<ValidationResult>;
  bulkValidate(data: Record<string, any>): Promise<BulkValidationResult>;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions?: string[];
  normalizedValue?: any;
}

export interface BulkValidationResult {
  total: number;
  valid: number;
  invalid: number;
  results: Record<string, ValidationResult>;
  summary: {
    criticalErrors: number;
    warnings: number;
    suggestions: number;
    total: number;
    valid: number;
    invalid: number;
  };
}

// ============================================================================
// ИНТЕРФЕЙСЫ УТИЛИТ
// ============================================================================

export interface IUtilityService {
  generateRandomString(length: number, charset?: string): string;
  generateUUID(): string;
  hashString(value: string, algorithm?: string): string;
  compareHash(value: string, hash: string): boolean;
  formatBytes(bytes: number): string;
  formatDuration(ms: number): string;
  sleep(ms: number): Promise<void>;
  retry<T>(fn: () => Promise<T>, attempts: number, delay?: number): Promise<T>;
  capitalize(str: string): string;
  slugify(str: string): string;
  truncateText(str: string, length: number): string;
}

// ============================================================================
// ИНТЕРФЕЙСЫ МОНИТОРИНГА
// ============================================================================

export interface IMonitoringService {
  recordMetric(
    name: string,
    value: number,
    tags?: Record<string, string>
  ): void;
  incrementCounter(name: string, tags?: Record<string, string>): Promise<void>;
  decrementCounter(name: string, tags?: Record<string, string>): Promise<void>;
  setGauge(name: string, value: number, tags?: Record<string, string>): void;
  recordHistogram(
    name: string,
    value: number,
    tags?: Record<string, string>
  ): void;
  getMetrics(): Promise<any>;
  getSystemStats(): Promise<any>;
}

// ============================================================================
// ТИПЫ ДАННЫХ
// ============================================================================

export interface User extends BaseEntity {
  email: string;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  role: UserRole;
  isActive: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  lastLoginAt: Date | null;
  defaultAddress: string | null;
}

export interface DeliveryAddress extends BaseEntity {
  userId: number;
  firstName: string;
  lastName: string;
  patronymic?: string;
  phone: string;
  country: string;
  region: string;
  city: string;
  street: string;
  house: string;
  building?: string;
  apartment?: string;
  postalCode: string;
  additionalInfo?: string;
  isDefault: boolean;
}

export interface CartItem extends BaseEntity {
  id: number;
  userId: number;
  productId: number;
  createdAt: Date;
}

export interface CartItemWithProduct extends CartItem {
  product: Product;
}

export interface FavoriteItem extends BaseEntity {
  id: number;
  userId: number;
  productId: number;
  createdAt: Date;
}

export interface FavoriteItemWithProduct extends FavoriteItem {
  product: Product;
}

export interface Product extends BaseEntity {
  id: number;
  name_eng: string;
  name_ru: string;
  description: string;
  img: string[];
  colors: string[];
  size: Array<{ size: string; price: number }>;
  deliveryDate: string;
  isNew?: boolean;
  discount?: number;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: number;
  name: string;
  subCategories?: any[];
  products?: Product[];
}

export interface Order extends BaseEntity {
  id: number;
  user: User;
  status: OrderStatus;
  totalPrice: number;
  totalCount: number;
  discount: number;
  promocode?: string;
  items: OrderItem[];
  address?: string;
  phone?: string;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  product: Product;
  quantity: number;
  price: number;
  totalPrice: number;
}

export interface Promocode extends BaseEntity {
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minAmount: number;
  maxDiscount: number;
  maxUses: number;
  currentUses: number;
  isActive: boolean;
  validFrom: Date;
  validTo: Date;
}

// ============================================================================
// DTOs
// ============================================================================

export interface CreateUserData {
  email: string;
  password: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
}

export interface UpdateUserData {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
}

export interface DeliveryAddressData {
  firstName: string;
  lastName: string;
  patronymic?: string;
  phone: string;
  country: string;
  region: string;
  city: string;
  street: string;
  house: string;
  building?: string;
  apartment?: string;
  postalCode: string;
  additionalInfo?: string;
  isDefault?: boolean;
}

export interface CreateProductDto {
  name_eng: string;
  name_ru: string;
  description: string;
  img?: string[];
  colors: string[];
  size: Array<{ size: string; price: number }>;
  deliveryDate: string;
  isNew?: boolean;
  discount?: number;
  isAvailable: boolean;
}

export interface CreateOrderDto {
  items: OrderItemDto[];
  address?: string;
  phone?: string;
  comment?: string;
  promocode?: string;
}

export interface OrderItemDto {
  productId: number;
  quantity: number;
  price: number;
}

export interface CreatePromocodeDto {
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minAmount: number;
  maxDiscount: number;
  maxUses: number;
  validFrom: Date;
  validTo: Date;
}

// ============================================================================
// ФИЛЬТРЫ И ПОИСК
// ============================================================================

export interface UserSearchFilters extends SearchFilters {
  role?: UserRole;
  isActive?: boolean;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  createdAfter?: Date;
  createdBefore?: Date;
}

export interface UserStatistics {
  totalUsers: number;
  activeUsers: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  usersByRole: Record<UserRole, number>;
  averageAge: number;
  topCountries: Array<{ country: string; count: number }>;
}

export interface AddressFilters {
  isDefault?: boolean;
  country?: string;
  city?: string;
}

export interface DeliveryAddressesResponse {
  addresses: DeliveryAddress[];
  total: number;
  defaultAddress?: DeliveryAddress;
}

export interface ProductFilters {
  categoryId?: number;
  subCategoryId?: number;
  typeId?: number;
  minPrice?: number;
  maxPrice?: number;
  isNew?: boolean;
  isAvailable?: boolean;
  hasDiscount?: boolean;
}

export interface ProductSort {
  field: 'price' | 'name' | 'createdAt' | 'discount';
  order: 'ASC' | 'DESC';
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface OrderListResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface OrderStatistics {
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  ordersByStatus: Record<OrderStatus, number>;
}

export interface PromocodeFilters {
  isActive?: boolean;
  discountType?: 'percentage' | 'fixed';
  validFrom?: Date;
  validTo?: Date;
}

export interface PromocodeListResponse {
  promocodes: Promocode[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PromocodeValidationResult {
  isValid: boolean;
  promocode: Promocode;
  discount: number;
  finalAmount: number;
  error?: string;
}

export interface PromocodeUsage {
  promocodeId: number;
  userId: number;
  orderId: number;
  discount: number;
  usedAt: Date;
}

export interface PromocodeStats {
  totalPromocodes: number;
  activePromocodes: number;
  totalUsage: number;
  totalDiscount: number;
  averageDiscount: number;
  topPromocodes: Array<{ code: string; usage: number; discount: number }>;
}

export interface PromocodeUsageData {
  promocodeId: number;
  userId: number;
  orderId: number;
  discount: number;
}

// ============================================================================
// ИНТЕРФЕЙСЫ СЕРВИСОВ МОДУЛЕЙ
// ============================================================================

export interface IUserService {
  getProfile(userId: number): Promise<unknown>;
}

export interface IDeliveryAddressService {
  createAddress(
    userId: number,
    data: DeliveryAddressData
  ): Promise<DeliveryAddress>;
  getAddressById(id: number): Promise<DeliveryAddress>;
  getUserAddresses(
    userId: number,
    filters?: AddressFilters
  ): Promise<DeliveryAddressesResponse>;
  updateAddress(
    id: number,
    data: Partial<DeliveryAddressData>
  ): Promise<DeliveryAddress>;
  deleteAddress(id: number): Promise<void>;
  setDefaultAddress(userId: number, addressId: number): Promise<void>;
  bulkCreateAddresses(
    userId: number,
    addresses: DeliveryAddressData[]
  ): Promise<BulkOperationResult>;
  bulkUpdateAddresses(
    updates: Array<{ id: number; data: Partial<DeliveryAddressData> }>
  ): Promise<BulkOperationResult>;
  bulkDeleteAddresses(ids: number[]): Promise<BulkOperationResult>;
}

export interface ICartService {
  addToCart(
    userId: number,
    productId: number,
    quantity: number
  ): Promise<CartItem>;
  removeFromCart(userId: number, productId: number): Promise<void>;
  updateQuantity(
    userId: number,
    productId: number,
    quantity: number
  ): Promise<CartItem>;
  getCart(userId: number): Promise<CartItemWithProduct[]>;
  clearCart(userId: number): Promise<void>;
  getCartItemCount(userId: number): Promise<number>;
  addMultipleToCart(
    userId: number,
    items: Array<{ productId: number; quantity: number }>
  ): Promise<CartItem[]>;
  removeMultipleFromCart(userId: number, productIds: number[]): Promise<void>;
}

export interface IFavoritesService {
  addToFavorites(userId: number, productId: number): Promise<FavoriteItem>;
  removeFromFavorites(userId: number, productId: number): Promise<void>;
  getFavorites(userId: number): Promise<FavoriteItemWithProduct[]>;
  clearFavorites(userId: number): Promise<void>;
  isInFavorites(userId: number, productId: number): Promise<boolean>;
  getFavoritesCount(userId: number): Promise<number>;
  addMultipleToFavorites(
    userId: number,
    productIds: number[]
  ): Promise<FavoriteItem[]>;
  removeMultipleFromFavorites(
    userId: number,
    productIds: number[]
  ): Promise<void>;
}

export interface IProductService {
  createProduct(dto: any, files?: Express.Multer.File[]): Promise<any>;
  findOne(id: number): Promise<any>;
  findAll(): Promise<any>;
  update(id: number, dto: any, files?: Express.Multer.File[]): Promise<any>;
  delete(id: number): Promise<void>;
}

export interface IOrderService {
  createOrder(createOrderDto: any, userId: number): Promise<any>;
  getOrderById(orderId: number, userId: number): Promise<any>;
  getUserOrders(userId: number, page?: number, limit?: number): Promise<any>;
  updateOrderStatus(
    orderId: number,
    status: OrderStatus,
    userId: number
  ): Promise<any>;
  cancelOrder(orderId: number, userId: number): Promise<any>;
}

export interface IPromocodeService {
  create(code: string, discount: number, options?: any): Promise<any>;
  validateAndApply(
    code: string,
    orderAmount: number,
    userId?: number
  ): Promise<any>;
  getAllActive(page?: number, limit?: number): Promise<any>;
  getAll(page?: number, limit?: number): Promise<any>;
  searchPromocodes(query: string, page?: number, limit?: number): Promise<any>;
  deactivateMultiple(codes: string[]): Promise<any>;
  getPromocodeStats(): Promise<any>;
  update(code: string, updates: any): Promise<any>;
}

export interface IAuthService {
  login(
    user: any,
    res?: any
  ): Promise<{
    accessToken: string;
    user: { id: number; email: string; role: string };
  }>;
  validateUser(email: string, password: string): Promise<any>;
}

// Упрощённая сигнатура для внутреннего использования (совпадает по имени — удаляем дубликаты)

export interface ImageProcessingOptions {
  width?: number;
  height?: number;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
  generateThumbnail?: boolean;
  thumbnailSize?: number;
}

export interface MetricsData {
  counters: Record<string, number>;
  gauges: Record<string, number>;
  histograms: Record<string, number[]>;
  timestamps: Record<string, number>;
  timings?: Record<string, any>;
}

export interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'degraded';
  uptime: number;
  checks: Record<string, any>;
  timestamp?: Date;
}

export interface HealthCheck {
  name: string;
  check?: () => Promise<boolean>;
  timeout?: number;
  status?: 'healthy' | 'unhealthy';
  responseTime?: number;
  error?: string;
  details?: any;
}

// ============================================================================
// ЭКСПОРТ ДЛЯ ОБРАТНОЙ СОВМЕСТИМОСТИ
// ============================================================================

// export * from './cache/cache.service';
