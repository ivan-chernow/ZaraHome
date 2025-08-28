import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private readonly configService: NestConfigService) {}

  // ========================================
  // APPLICATION CONFIG
  // ========================================
  get nodeEnv(): string {
    return this.configService.get<string>('app.nodeEnv')!;
  }

  get port(): number {
    return this.configService.get<number>('app.port')!;
  }

  get apiPrefix(): string {
    return this.configService.get<string>('app.apiPrefix')!;
  }

  get globalPrefix(): string {
    return this.configService.get<string>('app.globalPrefix')!;
  }

  get isDevelopment(): boolean {
    return this.configService.get<boolean>('app.isDevelopment')!;
  }

  get isProduction(): boolean {
    return this.configService.get<boolean>('app.isProduction')!;
  }

  get isTest(): boolean {
    return this.configService.get<boolean>('app.isTest')!;
  }

  // ========================================
  // DATABASE CONFIG
  // ========================================
  get database() {
    return {
      host: this.configService.get<string>('database.host')!,
      port: this.configService.get<number>('database.port')!,
      username: this.configService.get<string>('database.username')!,
      password: this.configService.get<string>('database.password')!,
      database: this.configService.get<string>('database.database')!,
      synchronize: this.configService.get<boolean>('database.synchronize')!,
      logging: this.configService.get<boolean>('database.logging')!,
      migrationsRun: this.configService.get<boolean>('database.migrationsRun')!,
      entities: this.configService.get<string[]>('database.entities')!,
      migrations: this.configService.get<string[]>('database.migrations')!,
    };
  }

  // ========================================
  // JWT CONFIG
  // ========================================
  get jwt() {
    return {
      secret: this.configService.get<string>('jwt.secret')!,
      accessExpiresIn: this.configService.get<string>('jwt.accessExpiresIn')!,
      refreshExpiresIn: this.configService.get<string>('jwt.refreshExpiresIn')!,
    };
  }

  // ========================================
  // ADMIN CONFIG
  // ========================================
  get admin() {
    return {
      email: this.configService.get<string>('admin.email')!,
      password: this.configService.get<string>('admin.password')!,
    };
  }

  // ========================================
  // EMAIL CONFIG
  // ========================================
  get email() {
    return {
      host: this.configService.get<string>('email.host')!,
      port: this.configService.get<number>('email.port')!,
      user: this.configService.get<string>('email.user')!,
      pass: this.configService.get<string>('email.pass')!,
      from: this.configService.get<string>('email.from')!,
      secure: this.configService.get<boolean>('email.secure')!,
    };
  }

  // ========================================
  // FILE UPLOAD CONFIG
  // ========================================
  get fileUpload() {
    return {
      maxFileSize: this.configService.get<number>('fileUpload.maxFileSize')!,
      allowedFileTypes: this.configService.get<string[]>('fileUpload.allowedFileTypes')!,
      uploadPath: this.configService.get<string>('fileUpload.uploadPath')!,
    };
  }

  // ========================================
  // CACHE CONFIG
  // ========================================
  get cache() {
    return {
      ttlDefault: this.configService.get<number>('cache.ttlDefault')!,
      maxKeys: this.configService.get<number>('cache.maxKeys')!,
    };
  }

  // ========================================
  // RATE LIMITING CONFIG
  // ========================================
  get rateLimit() {
    return {
      ttl: this.configService.get<number>('rateLimit.ttl')!,
      maxRequests: this.configService.get<number>('rateLimit.maxRequests')!,
    };
  }

  // ========================================
  // CORS CONFIG
  // ========================================
  get cors() {
    return {
      origin: this.configService.get<string | string[]>('cors.origin')!,
      credentials: this.configService.get<boolean>('cors.credentials')!,
    };
  }

  // ========================================
  // LOGGING CONFIG
  // ========================================
  get logging() {
    return {
      level: this.configService.get<string>('logging.level')!,
      filePath: this.configService.get<string>('logging.filePath')!,
      maxSize: this.configService.get<string>('logging.maxSize')!,
      maxFiles: this.configService.get<string>('logging.maxFiles')!,
    };
  }

  // ========================================
  // SECURITY CONFIG
  // ========================================
  get security() {
    return {
      bcryptRounds: this.configService.get<number>('security.bcryptRounds')!,
      sessionSecret: this.configService.get<string>('security.sessionSecret')!,
    };
  }

  // ========================================
  // ENVIRONMENT SPECIFIC CONFIG
  // ========================================
  get environment() {
    if (this.isDevelopment) {
      return this.configService.get('development');
    } else if (this.isProduction) {
      return this.configService.get('production');
    } else if (this.isTest) {
      return this.configService.get('test');
    }
    return {};
  }

  // ========================================
  // UTILITY METHODS
  // ========================================
  get<T>(key: string): T | undefined {
    return this.configService.get<T>(key);
  }

  getOrThrow<T>(key: string): T {
    const value = this.configService.get<T>(key);
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
      if (!this.configService.get(key)) {
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
