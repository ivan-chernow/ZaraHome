import { useCallback, useRef } from 'react';

/**
 * Хук для API вызовов с кэшированием и дебаунсингом
 */

interface ApiCacheOptions {
  ttl?: number; // время жизни кеша в миллисекундах
  maxSize?: number; // максимальный размер кеша
  cacheTime?: number; // время кеширования
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class ApiCache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private maxSize: number;

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize;
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > 5 * 60 * 1000) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  set(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    // Очищаем кеш если он превышает максимальный размер
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }
}

// Глобальный кеш для API запросов
const apiCache = new ApiCache();

/**
 * Хук для кэширования API запросов
 * @param key - ключ для кеша
 * @param fetcher - функция для получения данных
 * @param options - опции кеширования
 * @returns объект с данными и функциями управления кешем
 */
export const useApiCache = <T>(
  key: string,
  fetcher: () => Promise<T>,
  options: ApiCacheOptions = {}
) => {
  const abortControllerRef = useRef<AbortController | null>(null);

  const getCachedData = useCallback((): T | null => {
    return apiCache.get(key) as T | null;
  }, [key]);

  const setCachedData = useCallback((data: T) => {
    apiCache.set(key, data, options.cacheTime || options.ttl);
  }, [key, options.cacheTime, options.ttl]);

  const clearCache = useCallback(() => {
    apiCache.delete(key);
  }, [key]);

  const fetchData = useCallback(async (): Promise<T> => {
    // Отменяем предыдущий запрос если он есть
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Создаем новый AbortController
    abortControllerRef.current = new AbortController();

    try {
      const data = await fetcher();
      setCachedData(data);
      return data;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw error;
      }
      throw error;
    }
  }, [fetcher, setCachedData]);

  const getData = useCallback(async (): Promise<T> => {
    // Сначала проверяем кеш
    const cachedData = getCachedData();
    if (cachedData !== null) {
      return cachedData;
    }

    // Если данных нет в кеше, делаем запрос
    return await fetchData();
  }, [getCachedData, fetchData]);

  return {
    getCachedData,
    setCachedData,
    clearCache,
    fetchData,
    getData,
  };
};

/**
 * Хук для дебаунсинга API запросов
 * @param fetcher - функция для получения данных
 * @param delay - задержка в миллисекундах
 * @returns дебаунсированная функция
 */
export const useDebouncedApiCall = <T extends (...args: any[]) => Promise<any>>(
  fetcher: T,
  delay: number = 300
): T => {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const abortControllerRef = useRef<AbortController | null>(null);

  return useCallback((...args: any[]) => {
    return new Promise<Awaited<ReturnType<T>>>((resolve, reject) => {
      // Отменяем предыдущий запрос
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Очищаем предыдущий таймаут
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Создаем новый AbortController
      abortControllerRef.current = new AbortController();

      timeoutRef.current = setTimeout(async () => {
        try {
          const result = await fetcher(...args);
          resolve(result);
        } catch (error) {
          if (error instanceof Error && error.name === 'AbortError') {
            // Запрос был отменен, не обрабатываем ошибку
            return;
          }
          reject(error);
        }
      }, delay);
    });
  }, [fetcher, delay]) as T;
};

/**
 * Хук для оптимизации множественных API запросов
 * @param requests - массив функций запросов
 * @param options - опции для оптимизации
 * @returns объект с функциями для управления запросами
 */
export const useBatchRequests = <T>(
  requests: Array<() => Promise<T>>,
  options: {
    batchSize?: number;
    delay?: number;
    cache?: boolean;
  } = {}
) => {
  const { batchSize = 5, delay = 100, cache = true } = options;
      // const dispatch = useDispatch();
  const cacheRef = useRef(new Map<string, T>());

  const executeBatch = useCallback(async (startIndex: number = 0): Promise<T[]> => {
    const batch = requests.slice(startIndex, startIndex + batchSize);
    const results: T[] = [];

    for (let i = 0; i < batch.length; i++) {
      const requestIndex = startIndex + i;
      const cacheKey = `request_${requestIndex}`;

      if (cache && cacheRef.current.has(cacheKey)) {
        results.push(cacheRef.current.get(cacheKey)!);
        continue;
      }

      try {
        const result = await batch[i]();
        if (cache) {
          cacheRef.current.set(cacheKey, result);
        }
        results.push(result);
      } catch (error) {
        // Error handling without console logging
        throw error;
      }

      // Добавляем задержку между запросами
      if (i < batch.length - 1 && delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    return results;
  }, [requests, batchSize, delay, cache]);

  const executeAll = useCallback(async (): Promise<T[]> => {
    const allResults: T[] = [];
    
    for (let i = 0; i < requests.length; i += batchSize) {
      const batchResults = await executeBatch(i);
      allResults.push(...batchResults);
    }

    return allResults;
  }, [executeBatch, requests.length, batchSize]);

  const clearCache = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  return {
    executeBatch,
    executeAll,
    clearCache,
  };
};
