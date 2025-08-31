import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';
import { SHARED_CONSTANTS } from '../shared.constants';
import { IUtilityService } from '../shared.interfaces';

@Injectable()
export class UtilityService implements IUtilityService {
  private readonly logger = new Logger(UtilityService.name);

  generateUUID(): string {
    return uuidv4();
  }

  generateRandomString(length: number): string {
    if (length <= 0) {
      throw new Error('Длина должна быть положительным числом');
    }

    if (length > 1000) {
      throw new Error('Длина не может превышать 1000 символов');
    }

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
  }

  hashString(value: string, algorithm: string = 'sha256'): string {
    try {
      const hash = crypto.createHash(algorithm);
      hash.update(value);
      return hash.digest('hex');
    } catch (error) {
      this.logger.error(`Error hashing string: ${error.message}`);
      throw new Error('Ошибка хеширования строки');
    }
  }

  compareHash(value: string, hash: string): boolean {
    try {
      const computedHash = this.hashString(value);
      return computedHash === hash;
    } catch (error) {
      this.logger.error(`Error comparing hash: ${error.message}`);
      return false;
    }
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  formatDuration(milliseconds: number): string {
    if (milliseconds < 1000) {
      return `${milliseconds}ms`;
    }

    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}д ${hours % 24}ч ${minutes % 60}м ${seconds % 60}с`;
    } else if (hours > 0) {
      return `${hours}ч ${minutes % 60}м ${seconds % 60}с`;
    } else if (minutes > 0) {
      return `${minutes}м ${seconds % 60}с`;
    } else {
      return `${seconds}с`;
    }
  }

  async sleep(ms: number): Promise<void> {
    if (ms < 1 || ms > 60000) {
      throw new Error('Время ожидания должно быть от 1 до 60000 миллисекунд');
    }

    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async retry<T>(
    fn: () => Promise<T>, 
    attempts: number, 
    delay: number
  ): Promise<T> {
    if (attempts < 1 || attempts > 10) {
      throw new Error('Количество попыток должно быть от 1 до 10');
    }

    if (delay < 100 || delay > 30000) {
      throw new Error('Задержка должна быть от 100 до 30000 миллисекунд');
    }

    let lastError: Error | null = null;

    for (let i = 0; i < attempts; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        this.logger.warn(`Attempt ${i + 1} failed: ${error.message}`);
        
        if (i < attempts - 1) {
          await this.sleep(delay);
        }
      }
    }

    throw new Error(`Все ${attempts} попыток не удались. Последняя ошибка: ${lastError?.message}`);
  }

  // Дополнительные утилитарные методы
  generateSecureToken(length: number = 32): string {
    if (length < 16 || length > 128) {
      throw new Error('Длина токена должна быть от 16 до 128 символов');
    }

    return crypto.randomBytes(length).toString('hex');
  }

  generateNumericCode(length: number = 6): string {
    if (length < 4 || length > 10) {
      throw new Error('Длина кода должна быть от 4 до 10 символов');
    }

    let code = '';
    for (let i = 0; i < length; i++) {
      code += Math.floor(Math.random() * 10).toString();
    }
    
    return code;
  }

  slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) {
      return text;
    }
    
    return text.substring(0, maxLength).trim() + '...';
  }

  capitalizeFirst(text: string): string {
    if (!text) return text;
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  capitalize(text: string): string {
    if (!text) return text;
    return text.split(' ').map(word => this.capitalizeFirst(word)).join(' ');
  }

  formatCurrency(amount: number, currency: string = 'RUB'): string {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  formatDate(date: Date, format: string = 'human'): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));

    switch (format) {
      case 'iso':
        return date.toISOString();
      case 'date':
        return date.toLocaleDateString('ru-RU');
      case 'time':
        return date.toLocaleTimeString('ru-RU');
      case 'datetime':
        return date.toLocaleString('ru-RU');
      case 'human':
        if (diffDays === 0) {
          return 'Сегодня';
        } else if (diffDays === 1) {
          return 'Вчера';
        } else if (diffDays < 7) {
          return `${diffDays} дней назад`;
        } else {
          return date.toLocaleDateString('ru-RU');
        }
      default:
        return date.toLocaleString('ru-RU');
    }
  }

  generateChecksum(data: string | Buffer): string {
    const hash = crypto.createHash('md5');
    hash.update(data);
    return hash.digest('hex');
  }

  validateChecksum(data: string | Buffer, expectedChecksum: string): boolean {
    const actualChecksum = this.generateChecksum(data);
    return actualChecksum === expectedChecksum;
  }

  debounce<T extends (...args: any[]) => any>(
    func: T, 
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  throttle<T extends (...args: any[]) => any>(
    func: T, 
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
}
