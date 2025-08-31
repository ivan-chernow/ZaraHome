// Центральный экспорт всех компонентов shared модуля

// Константы
export * from './shared.constants';

// Интерфейсы (исключаем дублирующиеся типы)
export {
  AuthenticatedRequest,
  BaseEntity,
  BaseResponse,
  PaginationMeta,
  PaginatedResponse,
  SearchFilters,
  BulkOperationResult,
  ICacheService,
  CacheStats,
  CacheHealthCheck,
  IImageOptimizationService,
  ImageProcessingOptions,
  ImageMetadata,
  FileMetadata,
  FileInfo,
  IFileUploadService,
  UploadOptions,
  FileUploadResult,
  UploadStats,
  IValidationService,
  ValidationResult,
  BulkValidationResult,
  IUtilityService,
  UtilityOperation,
  BulkUtilityResult,
  IMonitoringService,
  MetricsData,
  HealthStatus,
  SystemStats,
  ILoggingService,
  LogEntry,
  IConfigService,
  DatabaseConfig,
  RedisConfig,
  JwtConfig,
  EmailConfig,
  UploadConfig,
  IEventService,
  EventHandler,
  EventStats,
  IRedisService,
  RedisStats,
  IQueueService,
  QueueJob,
  QueueJobOptions,
  QueueStats,
  IUserService,
  IDeliveryAddressService,
  ICartService,
  IFavoritesService,
  IProductService,
  IOrderService,
  IPromocodeService,
  IAuthService,
  IAdminService,
  User,
  DeliveryAddress,
  CartItem,
  CartItemWithProduct,
  FavoriteItem,
  FavoriteItemWithProduct,
  Product,
  Category,
  Order,
  OrderItem,
  Promocode,
  CreateUserData,
  UpdateUserData,
  DeliveryAddressData,
  CreateProductDto,
  CreateOrderDto,
  CreatePromocodeDto,
  UserSearchFilters,
  UserStatistics,
  AddressFilters,
  DeliveryAddressesResponse,
  ProductFilters,
  ProductSort,
  PaginationOptions,
  ProductListResponse,
  OrderStatistics,
  PromocodeFilters,
  PromocodeListResponse,
  PromocodeValidationResult,
  PromocodeUsage,
  PromocodeStats,
  PromocodeUsageData,
  UserRole,
  OrderStatus,
  ResourceNotFoundException,
  ConflictException,
  InternalServerException,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  ApiDefaultErrors
} from './shared.interfaces';

// Сервисы
export * from './services/image-optimization.service';
export * from './services/file-upload-error-handler.service';
export * from './services/validation.service';
export * from './services/utility.service';
export * from './services/monitoring.service';
export * from './services/response.service';

// Guards
export * from './guards/rate-limit.guard';

// Middleware
export * from './middleware/logging.middleware';

// DTOs
export * from './dto/cache.dto';
export * from './dto/validation.dto';
export * from './dto/utility.dto';

// Модуль
export * from './modules/shared.module';
