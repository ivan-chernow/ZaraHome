import { CacheOptions } from './cache/cache.service';

// Интерфейсы для кеширования
export interface ICacheService {
  get<T>(key: string, prefix?: string): Promise<T | null>;
  set<T>(key: string, value: T, options?: CacheOptions): Promise<void>;
  delete(key: string, prefix?: string): Promise<void>;
  deleteByPrefix(prefix: string): Promise<void>;
  getOrSet<T>(key: string, factory: () => Promise<T>, options?: CacheOptions): Promise<T>;
  exists(key: string, prefix?: string): Promise<boolean>;
  increment(key: string, prefix?: string): Promise<number>;
  decrement(key: string, prefix?: string): Promise<number>;
  getStats(): Promise<CacheStats>;
  clear(): Promise<void>;
}

export interface CacheStats {
  totalKeys: number;
  hitRate: number;
  missRate: number;
  memoryUsage: number;
  averageTTL: number;
  oldestKey: string | null;
  newestKey: string | null;
}

// Интерфейсы для обработки изображений
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
  channels: number;
  space: string;
}

// Интерфейсы для загрузки файлов
export interface IFileUploadService {
  uploadFile(file: Express.Multer.File, options?: FileUploadOptions): Promise<FileUploadResult>;
  uploadMultipleFiles(files: Express.Multer.File[], options?: FileUploadOptions): Promise<FileUploadResult[]>;
  validateFile(file: Express.Multer.File): Promise<FileValidationResult>;
  deleteFile(filePath: string): Promise<void>;
  getFileInfo(filePath: string): Promise<FileInfo>;
}

export interface FileUploadOptions {
  destination?: string;
  allowedTypes?: string[];
  maxSize?: number;
  generateThumbnail?: boolean;
  compress?: boolean;
  encrypt?: boolean;
}

export interface FileUploadResult {
  originalName: string;
  filename: string;
  path: string;
  size: number;
  mimeType: string;
  uploadTime: number;
  checksum: string;
  thumbnailPath?: string;
}

export interface FileValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  metadata: FileMetadata;
}

export interface FileMetadata {
  size: number;
  mimeType: string;
  extension: string;
  lastModified: Date;
  checksum: string;
}

export interface FileInfo {
  path: string;
  size: number;
  exists: boolean;
  lastModified: Date;
  isDirectory: boolean;
}

// Интерфейсы для мониторинга
export interface IMonitoringService {
  recordMetric(name: string, value: number, tags?: Record<string, string>): Promise<void>;
  incrementCounter(name: string, tags?: Record<string, string>): Promise<void>;
  decrementCounter(name: string, tags?: Record<string, string>): Promise<void>;
  setGauge(name: string, value: number, tags?: Record<string, string>): Promise<void>;
  recordHistogram(name: string, value: number, tags?: Record<string, string>): Promise<void>;
  recordTiming(name: string, duration: number, tags?: Record<string, string>): Promise<void>;
  getMetrics(): Promise<MetricsData>;
  getHealthStatus(): Promise<HealthStatus>;
  getSystemStats(): Promise<Record<string, any>>;
}

export interface MetricsData {
  counters: Record<string, number>;
  gauges: Record<string, number>;
  histograms: Record<string, number[]>;
  timings: Record<string, number[]>;
}

export interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'degraded';
  checks: HealthCheck[];
  timestamp: Date;
  uptime: number;
}

export interface HealthCheck {
  name: string;
  status: 'healthy' | 'unhealthy';
  responseTime: number;
  error?: string;
  details?: Record<string, any>;
}

// Интерфейсы для логирования
export interface ILoggingService {
  log(level: string, message: string, context?: string, metadata?: Record<string, any>): void;
  error(message: string, error?: Error, context?: string, metadata?: Record<string, any>): void;
  warn(message: string, context?: string, metadata?: Record<string, any>): void;
  info(message: string, context?: string, metadata?: Record<string, any>): void;
  debug(message: string, context?: string, metadata?: Record<string, any>): void;
  setLogLevel(level: string): void;
  getLogLevel(): string;
}

// Интерфейсы для валидации
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
  normalizedValue?: any;
}

export interface BulkValidationResult {
  results: Record<string, ValidationResult>;
  summary: {
    total: number;
    valid: number;
    invalid: number;
    errors: string[];
  };
}

// Интерфейсы для утилит
export interface IUtilityService {
  generateUUID(): string;
  generateRandomString(length: number): string;
  hashString(value: string, algorithm?: string): string;
  compareHash(value: string, hash: string): boolean;
  formatBytes(bytes: number): string;
  formatDuration(ms: number): string;
  sleep(ms: number): Promise<void>;
  retry<T>(fn: () => Promise<T>, attempts: number, delay: number): Promise<T>;
  generateSecureToken(length?: number): string;
  generateNumericCode(length: number): string;
  slugify(text: string): string;
  truncateText(text: string, maxLength: number): string;
  capitalize(text: string): string;
  formatCurrency(amount: number, currency?: string): string;
  formatDate(date: Date, format?: string): string;
  generateChecksum(data: string): string;
  validateChecksum(data: string, checksum: string): boolean;
  debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void;
  throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void;
}

// Интерфейсы для конфигурации
export interface IConfigService {
  get<T>(key: string, defaultValue?: T): T;
  set(key: string, value: any): void;
  has(key: string): boolean;
  delete(key: string): boolean;
  getAll(): Record<string, any>;
  reload(): Promise<void>;
}

// Интерфейсы для событий
export interface IEventService {
  emit(event: string, data?: any): void;
  on(event: string, handler: (data?: any) => void): void;
  off(event: string, handler: (data?: any) => void): void;
  once(event: string, handler: (data?: any) => void): void;
  getEventCount(event: string): number;
  clearEvents(event?: string): void;
}

// Интерфейсы для Redis
export interface IRedisService {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttl?: number): Promise<void>;
  del(key: string): Promise<number>;
  exists(key: string): Promise<boolean>;
  expire(key: string, ttl: number): Promise<boolean>;
  ttl(key: string): Promise<number>;
  keys(pattern: string): Promise<string[]>;
  flushdb(): Promise<void>;
  ping(): Promise<string>;
}

// Интерфейсы для очередей
export interface IQueueService {
  addJob(queue: string, data: any, options?: QueueJobOptions): Promise<QueueJob>;
  processJob(queue: string, handler: (job: QueueJob) => Promise<any>): void;
  getJob(queue: string, jobId: string): Promise<QueueJob | null>;
  removeJob(queue: string, jobId: string): Promise<void>;
  getQueueStats(queue: string): Promise<QueueStats>;
  pauseQueue(queue: string): Promise<void>;
  resumeQueue(queue: string): Promise<void>;
  clearQueue(queue: string): Promise<void>;
}

export interface QueueJob {
  id: string;
  data: any;
  progressValue: number;
  status: 'waiting' | 'active' | 'completed' | 'failed';
  result?: any;
  error?: string;
  progress(progress: number): void;
  complete(result: any): void;
  fail(error: Error): void;
}

export interface QueueJobOptions {
  priority?: number;
  delay?: number;
  attempts?: number;
  backoff?: number;
  timeout?: number;
}

export interface QueueStats {
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
  paused: boolean;
}
