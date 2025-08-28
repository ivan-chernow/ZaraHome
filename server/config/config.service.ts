import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  private readonly nestConfigService: NestConfigService;

  constructor(nestConfigService: NestConfigService) {
    this.nestConfigService = nestConfigService;
  }

  // ========================================
  // APPLICATION CONFIG
  // ========================================
  get nodeEnv(): string {
    return this.nestConfigService.get<string>('app.nodeEnv')!;
  }

  get port(): number {
    return this.nestConfigService.get<number>('app.port')!;
  }

  get apiPrefix(): string {
    return this.nestConfigService.get<string>('app.apiPrefix')!;
  }

  get globalPrefix(): string {
    return this.nestConfigService.get<string>('app.globalPrefix')!;
  }

  get isDevelopment(): boolean {
    return this.nestConfigService.get<boolean>('app.isDevelopment')!;
  }

  get isProduction(): boolean {
    return this.nestConfigService.get<boolean>('app.isProduction')!;
  }

  get isTest(): boolean {
    return this.nestConfigService.get<boolean>('app.isTest')!;
  }

  // ========================================
  // DATABASE CONFIG
  // ========================================
  get database() {
    return {
      host: this.nestConfigService.get<string>('database.host')!,
      port: this.nestConfigService.get<number>('database.port')!,
      username: this.nestConfigService.get<string>('database.username')!,
      password: this.nestConfigService.get<string>('database.password')!,
      database: this.nestConfigService.get<string>('database.database')!,
      synchronize: this.nestConfigService.get<boolean>('database.synchronize')!,
      logging: this.nestConfigService.get<boolean>('database.logging')!,
      migrationsRun: this.nestConfigService.get<boolean>('database.migrationsRun')!,
      entities: this.nestConfigService.get<string[]>('database.entities')!,
      migrations: this.nestConfigService.get<string[]>('database.migrations')!,
    };
  }

  // ========================================
  // JWT CONFIG
  // ========================================
  get jwt() {
    return {
      secret: this.nestConfigService.get<string>('jwt.secret')!,
      accessExpiresIn: this.nestConfigService.get<string>('jwt.accessExpiresIn')!,
      refreshExpiresIn: this.nestConfigService.get<string>('jwt.refreshExpiresIn')!,
    };
  }

  // ========================================
  // ADMIN CONFIG
  // ========================================
  get admin() {
    return {
      email: this.nestConfigService.get<string>('admin.email')!,
      password: this.nestConfigService.get<string>('admin.password')!,
    };
  }

  // ========================================
  // EMAIL CONFIG
  // ========================================
  get email() {
    return {
      host: this.nestConfigService.get<string>('email.host')!,
      port: this.nestConfigService.get<number>('email.port')!,
      user: this.nestConfigService.get<string>('email.user')!,
      pass: this.nestConfigService.get<string>('email.pass')!,
      from: this.nestConfigService.get<string>('email.from')!,
      secure: this.nestConfigService.get<boolean>('email.secure')!,
    };
  }

  // ========================================
  // FILE UPLOAD CONFIG
  // ========================================
  get fileUpload() {
    return {
      maxFileSize: this.nestConfigService.get<number>('fileUpload.maxFileSize')!,
      allowedFileTypes: this.nestConfigService.get<string[]>('fileUpload.allowedFileTypes')!,
      uploadPath: this.nestConfigService.get<string>('fileUpload.uploadPath')!,
    };
  }

  // ========================================
  // CACHE CONFIG
  // ========================================
  get cache() {
    return {
      ttlDefault: this.nestConfigService.get<number>('cache.ttlDefault')!,
      maxKeys: this.nestConfigService.get<number>('cache.maxKeys')!,
    };
  }

  // ========================================
  // RATE LIMITING CONFIG
  // ========================================
  get rateLimit() {
    return {
      ttl: this.nestConfigService.get<number>('rateLimit.ttl')!,
      maxRequests: this.nestConfigService.get<number>('rateLimit.maxRequests')!,
    };
  }

  // ========================================
  // CORS CONFIG
  // ========================================
  get cors() {
    return {
      origin: this.nestConfigService.get<string | string[]>('cors.origin')!,
      credentials: this.nestConfigService.get<boolean>('cors.credentials')!,
    };
  }

  // ========================================
  // LOGGING CONFIG
  // ========================================
  get logging() {
    return {
      level: this.nestConfigService.get<string>('logging.level')!,
      filePath: this.nestConfigService.get<string>('logging.filePath')!,
      maxSize: this.nestConfigService.get<string>('logging.maxSize')!,
      maxFiles: this.nestConfigService.get<string>('logging.maxFiles')!,
    };
  }

  // ========================================
  // SECURITY CONFIG
  // ========================================
  get security() {
    return {
      bcryptRounds: this.nestConfigService.get<number>('security.bcryptRounds')!,
      sessionSecret: this.nestConfigService.get<string>('security.sessionSecret')!,
    };
  }

  // ========================================
  // ENVIRONMENT SPECIFIC CONFIG
  // ========================================
  get environment() {
    if (this.isDevelopment) {
      return this.nestConfigService.get('development');
    } else if (this.isProduction) {
      return this.nestConfigService.get('production');
    } else if (this.isTest) {
      return this.nestConfigService.get('test');
    }
    return {};
  }

  // ========================================
  // UTILITY METHODS
  // ========================================
  get<T>(key: string): T | undefined {
    return this.nestConfigService.get<T>(key);
  }

  getOrThrow<T>(key: string): T {
    const value = this.nestConfigService.get<T>(key);
    if (value === undefined) {
      throw new Error(`Configuration key "${key}" is required but not set`);
    }
    return value;
  }

  // ========================================
  // VALIDATION METHODS
  // ========================================
  validateRequired(keys: string[]): void {
    const missingKeys: string[] = [];
    
    for (const key of keys) {
      if (!this.nestConfigService.get(key)) {
        missingKeys.push(key);
      }
    }

    if (missingKeys.length > 0) {
      throw new Error(`Missing required configuration keys: ${missingKeys.join(', ')}`);
    }
  }

  // ========================================
  // ENVIRONMENT CHECKS
  // ========================================
  requireProduction(): void {
    if (!this.isProduction) {
      throw new Error('This configuration is only available in production environment');
    }
  }

  requireDevelopment(): void {
    if (!this.isDevelopment) {
      throw new Error('This configuration is only available in development environment');
    }
  }

  requireTest(): void {
    if (!this.isTest) {
      throw new Error('This configuration is only available in test environment');
    }
  }
}
