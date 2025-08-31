// Централизованные интерфейсы для всего приложения
import { CacheOptions } from './cache/cache.service';

// ============================================================================
// БАЗОВЫЕ ИНТЕРФЕЙСЫ
// ============================================================================

// Swagger декораторы
export const ApiDefaultErrors = () => {
  return (target: any) => {
    // Декоратор для стандартных ошибок API
    return target;
  };
};

// Базовые исключения

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

export interface IAuthService {
  login(email: string, password: string): Promise<{ accessToken: string; refreshToken: string; user: any }>;
  refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }>;
  logout(refreshToken: string): Promise<void>;
  validateUser(email: string, password: string): Promise<any>;
  generateTokens(user: any): Promise<{ accessToken: string; refreshToken: string }>;
}

export interface IAdminService {
  getSystemStats(): Promise<any>;
  getUserStats(): Promise<any>;
  getProductStats(): Promise<any>;
  getOrderStats(): Promise<any>;
  bulkUpdateUsers(updates: Array<{ id: number; data: any }>): Promise<any>;
  bulkDeleteUsers(ids: number[]): Promise<any>;
}

export interface BaseEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
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
  timestamp: Date;
  statusCode: number;
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
  getStats(): Promise<CacheStats>;
  healthCheck(): Promise<HealthStatus>;
}

export interface CacheStats {
  totalKeys: number;
  memoryUsage: number;
  hitRate: number;
  missRate: number;
  evictions: number;
  expiredKeys: number;
}

export interface CacheHealthCheck {
  status: 'healthy' | 'unhealthy';
  message: string;
  details: {
    totalKeys: number;
    memoryUsage: number;
    hitRate: number;
  };
}

// ============================================================================
// ИНТЕРФЕЙСЫ ОБРАБОТКИ ИЗОБРАЖЕНИЙ
// ============================================================================

export interface IImageOptimizationService {
  processAndSave(buffer: Buffer, originalName: string, options?: ImageProcessingOptions): Promise<{ mainPath: string; thumbnailPath?: string }>;
  generateThumbnail(imagePath: string, size?: number): Promise<string>;
  validateImage(buffer: Buffer): Promise<void>;
  compressImage(imagePath: string, quality?: number): Promise<string>;
  resizeImage(imagePath: string, width: number, height: number): Promise<string>;
  convertFormat(imagePath: string, format: 'webp' | 'jpeg' | 'png'): Promise<string>;
  getImageMetadata(imagePath: string): Promise<ImageMetadata>;
  deleteImage(imagePath: string): Promise<void>;
  cleanupOldImages(maxAge?: number): Promise<number>;
}

export interface ImageProcessingOptions {
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
  format?: 'webp' | 'jpeg' | 'png';
  generateThumbnail?: boolean;
  thumbnailSize?: number;
}

export interface ImageMetadata {
  width: number;
  height: number;
  format: string;
  size: number;
  mimeType: string;
  hasAlpha: boolean;
  colorSpace: string;
  channels: number;
}

export interface FileMetadata {
  originalName: string;
  filename: string;
  path: string;
  size: number;
  mimeType: string;
  extension: string;
  uploadDate: Date;
}

export interface FileInfo {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  thumbnailUrl?: string;
  uploadedAt: Date;
}

// ============================================================================
// ИНТЕРФЕЙСЫ ЗАГРУЗКИ ФАЙЛОВ
// ============================================================================

export interface IFileUploadService {
  uploadFile(file: Express.Multer.File, options?: UploadOptions): Promise<FileUploadResult>;
  uploadMultipleFiles(files: Express.Multer.File[], options?: UploadOptions): Promise<FileUploadResult[]>;
  deleteFile(filePath: string): Promise<void>;
  getFileInfo(filePath: string): Promise<FileInfo>;
  validateFile(file: Express.Multer.File): Promise<ValidationResult>;
  getUploadStats(): Promise<UploadStats>;
}

export interface UploadOptions {
  allowedTypes?: string[];
  maxSize?: number;
  generateThumbnail?: boolean;
  compress?: boolean;
  resize?: {
    width?: number;
    height?: number;
  };
  folder?: string;
}

export interface FileUploadResult {
  success: boolean;
  filePath: string;
  thumbnailPath?: string;
  metadata: FileMetadata;
  error?: string;
}

export interface UploadStats {
  totalFiles: number;
  totalSize: number;
  averageFileSize: number;
  filesByType: Record<string, number>;
  uploadsToday: number;
  uploadsThisWeek: number;
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
  suggestions: string[];
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
  truncate(str: string, length: number): string;
  bulkUtilityOperations(operations: UtilityOperation[]): Promise<BulkUtilityResult>;
}

export interface UtilityOperation {
  type: 'hash' | 'generate' | 'format' | 'transform';
  data: any;
  options?: any;
}

export interface BulkUtilityResult {
  total: number;
  succeeded: number;
  failed: number;
  results: any[];
  errors: string[];
}

// ============================================================================
// ИНТЕРФЕЙСЫ МОНИТОРИНГА
// ============================================================================

export interface IMonitoringService {
  recordMetric(name: string, value: number, tags?: Record<string, string>): void;
  incrementCounter(name: string, value?: number, tags?: Record<string, string>): void;
  decrementCounter(name: string, value?: number, tags?: Record<string, string>): void;
  setGauge(name: string, value: number, tags?: Record<string, string>): void;
  recordHistogram(name: string, value: number, tags?: Record<string, string>): void;
  getMetrics(name?: string, tags?: Record<string, string>): MetricsData[];
  getSystemHealth(): Promise<HealthStatus>;
  getSystemStats(): Promise<SystemStats>;
}

export interface MetricsData {
  name: string;
  value: number;
  tags: Record<string, string>;
  timestamp: Date;
  type: 'counter' | 'gauge' | 'histogram';
}

export interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  message: string;
  timestamp: Date;
  details: Record<string, any>;
}

export interface SystemStats {
  cpu: {
    usage: number;
    load: number;
    cores: number;
  };
  memory: {
    total: number;
    used: number;
    free: number;
    usage: number;
  };
  disk: {
    total: number;
    used: number;
    free: number;
    usage: number;
  };
  network: {
    bytesIn: number;
    bytesOut: number;
    connections: number;
  };
  uptime: number;
  processId: number;
  nodeVersion: string;
}

// ============================================================================
// ИНТЕРФЕЙСЫ ЛОГИРОВАНИЯ
// ============================================================================

export interface ILoggingService {
  log(level: LogLevel, message: string, context?: any): void;
  error(message: string, error?: Error, context?: any): void;
  warn(message: string, context?: any): void;
  info(message: string, context?: any): void;
  debug(message: string, context?: any): void;
  verbose(message: string, context?: any): void;
  setLogLevel(level: LogLevel): void;
  getLogs(level?: LogLevel, limit?: number): LogEntry[];
  clearLogs(): void;
}

export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  context?: any;
  error?: Error;
}

export type LogLevel = 'error' | 'warn' | 'info' | 'debug' | 'verbose';

// ============================================================================
// ИНТЕРФЕЙСЫ КОНФИГУРАЦИИ
// ============================================================================

export interface IConfigService {
  get<T>(key: string, defaultValue?: T): T;
  set(key: string, value: any): void;
  has(key: string): boolean;
  delete(key: string): void;
  getDatabaseConfig(): DatabaseConfig;
  getRedisConfig(): RedisConfig;
  getJwtConfig(): JwtConfig;
  getEmailConfig(): EmailConfig;
  getUploadConfig(): UploadConfig;
  validateConfig(): ValidationResult;
}

export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
  logging: boolean;
}

export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db: number;
  keyPrefix: string;
}

export interface JwtConfig {
  secret: string;
  expiresIn: string;
  refreshExpiresIn: string;
}

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  username: string;
  password: string;
  from: string;
}

export interface UploadConfig {
  maxFileSize: number;
  allowedTypes: string[];
  uploadPath: string;
  generateThumbnails: boolean;
}

// ============================================================================
// ИНТЕРФЕЙСЫ СОБЫТИЙ
// ============================================================================

export interface IEventService {
  emit(event: string, data?: any): void;
  on(event: string, handler: EventHandler): void;
  off(event: string, handler: EventHandler): void;
  once(event: string, handler: EventHandler): void;
  getEventHandlers(event: string): EventHandler[];
  clearEventHandlers(event?: string): void;
  getEventStats(): EventStats;
}

export interface EventHandler {
  (data?: any): void | Promise<void>;
}

export interface EventStats {
  totalEvents: number;
  eventsByType: Record<string, number>;
  activeHandlers: number;
  lastEventTime: Date;
}

// ============================================================================
// ИНТЕРФЕЙСЫ REDIS
// ============================================================================

export interface IRedisService {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttl?: number): Promise<void>;
  del(key: string): Promise<void>;
  exists(key: string): Promise<boolean>;
  expire(key: string, ttl: number): Promise<void>;
  ttl(key: string): Promise<number>;
  keys(pattern: string): Promise<string[]>;
  flushdb(): Promise<void>;
  ping(): Promise<string>;
  getStats(): RedisStats;
}

export interface RedisStats {
  connected: boolean;
  totalKeys: number;
  memoryUsage: number;
  lastPing: Date;
  connectionTime: Date;
}

// ============================================================================
// ИНТЕРФЕЙСЫ ОЧЕРЕДЕЙ
// ============================================================================

export interface IQueueService {
  addJob(job: QueueJob): Promise<string>;
  processJob(jobId: string): Promise<any>;
  getJob(jobId: string): Promise<QueueJob | null>;
  getJobs(status?: JobStatus, limit?: number): Promise<QueueJob[]>;
  removeJob(jobId: string): Promise<void>;
  clearQueue(): Promise<void>;
  pauseQueue(): Promise<void>;
  resumeQueue(): Promise<void>;
  getQueueStats(): Promise<QueueStats>;
}

export interface QueueJob {
  id: string;
  name: string;
  data: any;
  options?: QueueJobOptions;
  status: JobStatus;
  progressValue: number;
  attempts: number;
  maxAttempts: number;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  failedAt?: Date;
  error?: string;
  result?: any;
}

export interface QueueJobOptions {
  priority?: number;
  delay?: number;
  timeout?: number;
  retries?: number;
  removeOnComplete?: boolean;
  removeOnFail?: boolean;
}

export type JobStatus = 'waiting' | 'active' | 'completed' | 'failed' | 'delayed' | 'paused';

export interface QueueStats {
  totalJobs: number;
  jobsByStatus: Record<JobStatus, number>;
  activeJobs: number;
  completedJobs: number;
  failedJobs: number;
  averageProcessingTime: number;
  throughput: number;
}

// ============================================================================
// ИНТЕРФЕЙСЫ ПОЛЬЗОВАТЕЛЕЙ
// ============================================================================

export interface IUserService {
  createUser(data: CreateUserData): Promise<User>;
  getUserById(id: number): Promise<User>;
  getUserByEmail(email: string): Promise<User | null>;
  getUserByPhone(phone: string): Promise<User | null>;
  updateUser(id: number, data: UpdateUserData): Promise<User>;
  deleteUser(id: number): Promise<void>;
  searchUsers(filters: UserSearchFilters): Promise<PaginatedResponse<User>>;
  getUserStatistics(): Promise<UserStatistics>;
  bulkDeleteUsers(ids: number[]): Promise<BulkOperationResult>;
  bulkUpdateUsers(updates: Array<{ id: number; data: UpdateUserData }>): Promise<BulkOperationResult>;
  getProfile(_userId: number): Promise<unknown>;
}

export interface IDeliveryAddressService {
  createAddress(userId: number, data: DeliveryAddressData): Promise<DeliveryAddress>;
  getAddressById(id: number): Promise<DeliveryAddress>;
  getUserAddresses(userId: number, filters?: AddressFilters): Promise<DeliveryAddressesResponse>;
  updateAddress(id: number, data: Partial<DeliveryAddressData>): Promise<DeliveryAddress>;
  deleteAddress(id: number): Promise<void>;
  setDefaultAddress(userId: number, addressId: number): Promise<void>;
  bulkCreateAddresses(userId: number, addresses: DeliveryAddressData[]): Promise<BulkOperationResult>;
  bulkUpdateAddresses(updates: Array<{ id: number; data: Partial<DeliveryAddressData> }>): Promise<BulkOperationResult>;
  bulkDeleteAddresses(ids: number[]): Promise<BulkOperationResult>;
}

// ============================================================================
// CART INTERFACES (Moved/Defined)
// ============================================================================
export interface ICartService {
  addToCart(userId: number, productId: number, quantity: number): Promise<CartItem>;
  removeFromCart(userId: number, productId: number): Promise<void>;
  updateQuantity(userId: number, productId: number, quantity: number): Promise<CartItem>;
  getCart(userId: number): Promise<CartItemWithProduct[]>;
  clearCart(userId: number): Promise<void>;
  getCartItemCount(userId: number): Promise<number>;
  addMultipleToCart(userId: number, items: Array<{ productId: number; quantity: number }>): Promise<CartItem[]>;
  removeMultipleFromCart(userId: number, productIds: number[]): Promise<void>;
}

export interface CartItem extends BaseEntity {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItemWithProduct extends CartItem {
  product: Product;
}

// ============================================================================
// FAVORITES INTERFACES (Moved/Defined)
// ============================================================================
export interface IFavoritesService {
  addToFavorites(userId: number, productId: number): Promise<FavoriteItem>;
  removeFromFavorites(userId: number, productId: number): Promise<void>;
  getFavorites(userId: number): Promise<FavoriteItemWithProduct[]>;
  clearFavorites(userId: number): Promise<void>;
  isInFavorites(userId: number, productId: number): Promise<boolean>;
  getFavoritesCount(userId: number): Promise<number>;
  addMultipleToFavorites(userId: number, productIds: number[]): Promise<FavoriteItem[]>;
  removeMultipleFromFavorites(userId: number, productIds: number[]): Promise<void>;
}

export interface FavoriteItem extends BaseEntity {
  id: number;
  userId: number;
  productId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface FavoriteItemWithProduct extends FavoriteItem {
  product: Product;
}

// ============================================================================
// PRODUCTS INTERFACES (Moved/Defined)
// ============================================================================
export interface IProductService {
  createProduct(dto: CreateProductDto, files?: Express.Multer.File[]): Promise<Product>;
  getProductById(id: number): Promise<Product>;
  getAllProducts(filters?: Partial<ProductFilters>, pagination?: PaginationOptions): Promise<ProductListResponse>;
  updateProduct(id: number, dto: Partial<CreateProductDto>, files?: Express.Multer.File[]): Promise<Product>;
  deleteProduct(id: number): Promise<void>;
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  getProductsBySubCategory(subCategoryId: number): Promise<Product[]>;
  getProductsByType(typeId: number): Promise<Product[]>;
  getNewProducts(): Promise<Product[]>;
  getDiscountedProducts(): Promise<Product[]>;
  findProductsByIds(ids: number[]): Promise<Product[]>;
  searchProducts(query: string, filters?: Partial<ProductFilters>, pagination?: PaginationOptions): Promise<ProductListResponse>;
  getCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | null>;
  getNewProducts(): Promise<Product[]>;
  getDiscountedProducts(): Promise<Product[]>;
}

export interface Product extends BaseEntity {
  id: number;
  name: string;
  name_eng: string;
  name_ru: string;
  price: number;
  sku: string;
  categoryId: number;
  subCategoryId?: number;
  typeId?: number;
  stockQuantity: number;
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

export interface Category extends BaseEntity {
  id: number;
  name: string;
  name_eng: string;
  name_ru: string;
  description: string;
  parentId?: number;
  isActive: boolean;
  products?: Product[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductDto {
  name: string;
  name_eng: string;
  name_ru: string;
  price: number;
  sku: string;
  categoryId: number;
  subCategoryId?: number;
  typeId?: number;
  stockQuantity: number;
  description: string;
  img?: string[];
  colors: string[];
  size: Array<{ size: string; price: number }>;
  deliveryDate: string;
  isNew?: boolean;
  discount?: number;
  isAvailable: boolean;
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

// ============================================================================
// ORDERS INTERFACES (Moved/Defined)
// ============================================================================
export interface IOrderService {
  createOrder(userId: number, orderData: CreateOrderDto): Promise<Order>;
  getOrderById(id: number): Promise<Order>;
  getUserOrders(userId: number, page?: number, limit?: number): Promise<PaginatedResponse<Order>>;
  updateOrderStatus(id: number, status: OrderStatus): Promise<Order>;
  cancelOrder(id: number): Promise<Order>;
  getOrderStatistics(userId: number): Promise<OrderStatistics>;
}

export interface Order extends BaseEntity {
  id: number;
  userId: number;
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

export interface OrderStatistics {
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  ordersByStatus: Record<OrderStatus, number>;
}

// ============================================================================
// PROMOCODES INTERFACES (Moved/Defined)
// ============================================================================
export interface IPromocodeService {
  createPromocode(data: CreatePromocodeDto): Promise<Promocode>;
  getPromocodeById(id: number): Promise<Promocode>;
  getPromocodes(filters: PromocodeFilters, pagination: PaginationOptions): Promise<PromocodeListResponse>;
  updatePromocode(id: number, data: Partial<CreatePromocodeDto>): Promise<Promocode>;
  deletePromocode(id: number): Promise<void>;
  activatePromocode(id: number): Promise<Promocode>;
  deactivatePromocode(id: number): Promise<Promocode>;
  validatePromocode(code: string, amount: number): Promise<PromocodeValidationResult>;
  applyPromocode(code: string, amount: number): Promise<PromocodeUsage>;
  getPromocodeStatistics(): Promise<PromocodeStats>;
  bulkActivatePromocodes(ids: number[]): Promise<BulkOperationResult>;
  bulkDeactivatePromocodes(ids: number[]): Promise<BulkOperationResult>;
  bulkDeletePromocodes(ids: number[]): Promise<BulkOperationResult>;
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
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItemWithProduct extends CartItem {
  product: Product;
}

export interface FavoriteItem extends BaseEntity {
  id: number;
  userId: number;
  productId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface FavoriteItemWithProduct extends FavoriteItem {
  product: Product;
}

export interface Product extends BaseEntity {
  id: number;
  name: string;
  name_eng: string;
  name_ru: string;
  price: number;
  sku: string;
  categoryId: number;
  subCategoryId?: number;
  typeId?: number;
  stockQuantity: number;
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

export interface Category extends BaseEntity {
  id: number;
  name: string;
  name_eng: string;
  name_ru: string;
  description: string;
  parentId?: number;
  isActive: boolean;
  products?: Product[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Order extends BaseEntity {
  id: number;
  userId: number;
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
  name: string;
  name_eng: string;
  name_ru: string;
  price: number;
  sku: string;
  categoryId: number;
  subCategoryId?: number;
  typeId?: number;
  stockQuantity: number;
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
// ENUMS
// ============================================================================

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

// ============================================================================
// ЭКСПОРТ ДЛЯ ОБРАТНОЙ СОВМЕСТИМОСТИ
// ============================================================================

export * from './cache/cache.service';
