import { Injectable, Logger } from '@nestjs/common';

export interface CacheOptions {
  ttl?: number; // время жизни в секундах
  prefix?: string; // префикс для ключа
}

interface CacheItem<T> {
  value: T;
  expiresAt: number;
}

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  private readonly defaultTTL = 3600; // 1 час
  private readonly cache = new Map<string, CacheItem<any>>();

  /**
   * Получить значение из кеша
   */
  async get<T>(key: string, prefix?: string): Promise<T | null> {
    try {
      const fullKey = this.buildKey(key, prefix);
      const item = this.cache.get(fullKey);

      if (!item) {
        this.logger.debug(`Cache MISS: ${fullKey}`);
        return null;
      }

      // Проверяем TTL
      if (Date.now() > item.expiresAt) {
        this.cache.delete(fullKey);
        this.logger.debug(`Cache EXPIRED: ${fullKey}`);
        return null;
      }

      this.logger.debug(`Cache HIT: ${fullKey}`);
      return item.value;
    } catch (error) {
      this.logger.error(`Error getting cache key ${key}:`, error.message);
      return null;
    }
  }

  /**
   * Установить значение в кеш
   */
  async set<T>(key: string, value: T, options?: CacheOptions): Promise<void> {
    try {
      const fullKey = this.buildKey(key, options?.prefix);
      const ttl = options?.ttl || this.defaultTTL;
      const expiresAt = Date.now() + ttl * 1000;

      this.cache.set(fullKey, { value, expiresAt });
      this.logger.debug(`Cache SET: ${fullKey} (TTL: ${ttl}s)`);
    } catch (error) {
      this.logger.error(`Error setting cache key ${key}:`, error.message);
    }
  }

  /**
   * Удалить значение из кеша
   */
  async delete(key: string, prefix?: string): Promise<void> {
    try {
      const fullKey = this.buildKey(key, prefix);
      this.cache.delete(fullKey);
      this.logger.debug(`Cache DELETE: ${fullKey}`);
    } catch (error) {
      this.logger.error(`Error deleting cache key ${key}:`, error.message);
    }
  }

  /**
   * Удалить все ключи с определенным префиксом
   */
  async deleteByPrefix(prefix: string): Promise<void> {
    try {
      const keysToDelete: string[] = [];

      for (const key of this.cache.keys()) {
        if (key.startsWith(`${prefix}:`)) {
          keysToDelete.push(key);
        }
      }

      keysToDelete.forEach(key => this.cache.delete(key));
      this.logger.debug(
        `Cache CLEAR by prefix: ${prefix} (${keysToDelete.length} keys)`
      );
    } catch (error) {
      this.logger.error(
        `Error clearing cache by prefix ${prefix}:`,
        error.message
      );
    }
  }

  /**
   * Получить или установить значение (get-or-set pattern)
   */
  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    options?: CacheOptions
  ): Promise<T> {
    const cached = await this.get<T>(key, options?.prefix);

    if (cached !== null) {
      return cached;
    }

    const value = await factory();
    await this.set(key, value, options);
    return value;
  }

  /**
   * Инвалидировать кеш для определенного типа данных
   */
  async invalidatePattern(pattern: string): Promise<void> {
    try {
      // Упрощенная реализация - очищаем весь кеш
      this.cache.clear();
      this.logger.debug(`Cache INVALIDATE pattern: ${pattern}`);
    } catch (error) {
      this.logger.error(
        `Error invalidating cache pattern ${pattern}:`,
        error.message
      );
    }
  }

  /**
   * Получить статистику кеша
   */
  async getStats(): Promise<{ keys: number; memory: string }> {
    try {
      const keys = this.cache.size;
      const memory = `${Math.round(keys * 0.1)} KB`; // Примерная оценка

      return { keys, memory };
    } catch (error) {
      this.logger.error('Error getting cache stats:', error.message);
      return { keys: 0, memory: '0 KB' };
    }
  }

  /**
   * Очистить весь кеш
   */
  async clear(): Promise<void> {
    try {
      this.cache.clear();
      this.logger.debug('Cache CLEAR: all');
    } catch (error) {
      this.logger.error('Error clearing cache:', error.message);
    }
  }

  /**
   * Построить полный ключ кеша
   */
  private buildKey(key: string, prefix?: string): string {
    if (prefix) {
      return `${prefix}:${key}`;
    }
    return key;
  }

  /**
   * Проверить доступность кеша
   */
  async isHealthy(): Promise<boolean> {
    try {
      // Простая проверка - пробуем записать и прочитать тестовое значение
      const testKey = 'health-check';
      const testValue = { timestamp: Date.now() };

      await this.set(testKey, testValue, { ttl: 60 });
      const result = await this.get(testKey);

      return result !== null;
    } catch (error) {
      this.logger.error('Cache health check failed:', error.message);
      return false;
    }
  }

  /**
   * Очистить истекшие ключи
   */
  private cleanupExpiredKeys(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));

    if (keysToDelete.length > 0) {
      this.logger.debug(`Cleaned up ${keysToDelete.length} expired cache keys`);
    }
  }
}
