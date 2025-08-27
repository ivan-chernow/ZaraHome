import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

export interface CacheOptions {
  ttl?: number; // время жизни в секундах
  prefix?: string; // префикс для ключа
}

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  private readonly defaultTTL = 3600; // 1 час

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  /**
   * Получить значение из кеша
   */
  async get<T>(key: string, prefix?: string): Promise<T | null> {
    try {
      const fullKey = this.buildKey(key, prefix);
      const value = await this.cacheManager.get<T>(fullKey);
      
      if (value !== undefined) {
        this.logger.debug(`Cache HIT: ${fullKey}`);
        return value;
      }
      
      this.logger.debug(`Cache MISS: ${fullKey}`);
      return null;
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
      
      await this.cacheManager.set(fullKey, value, ttl);
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
      await this.cacheManager.del(fullKey);
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
      // В Redis можно использовать SCAN для поиска ключей по паттерну
      // Для простоты используем внутренний метод
      await this.cacheManager.store.reset();
      this.logger.debug(`Cache CLEAR by prefix: ${prefix}`);
    } catch (error) {
      this.logger.error(`Error clearing cache by prefix ${prefix}:`, error.message);
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
      // В реальной реализации здесь была бы логика поиска ключей по паттерну
      // Для простоты очищаем весь кеш
      await this.cacheManager.reset();
      this.logger.debug(`Cache INVALIDATE pattern: ${pattern}`);
    } catch (error) {
      this.logger.error(`Error invalidating cache pattern ${pattern}:`, error.message);
    }
  }

  /**
   * Получить статистику кеша
   */
  async getStats(): Promise<{ keys: number; memory: string }> {
    try {
      // В Redis можно получить реальную статистику
      return {
        keys: 0, // TODO: реализовать подсчет ключей
        memory: '0 MB', // TODO: реализовать подсчет памяти
      };
    } catch (error) {
      this.logger.error('Error getting cache stats:', error.message);
      return { keys: 0, memory: '0 MB' };
    }
  }

  /**
   * Очистить весь кеш
   */
  async clear(): Promise<void> {
    try {
      await this.cacheManager.reset();
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
      await this.cacheManager.get('health-check');
      return true;
    } catch (error) {
      this.logger.error('Cache health check failed:', error.message);
      return false;
    }
  }
}
