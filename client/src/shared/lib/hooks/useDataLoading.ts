import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Хуки для загрузки данных
 */

interface LoadingState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  retryCount: number;
}

interface LoadingOptions {
  retryAttempts?: number;
  retryDelay?: number;
  cacheTime?: number;
  staleTime?: number;
}

/**
 * Хук для загрузки данных
 * @param fetcher - функция для загрузки данных
 * @param options - опции загрузки
 * @returns объект с состоянием загрузки и методами
 */
export const useDataLoading = <T>(
  fetcher: () => Promise<T>,
  options: LoadingOptions = {}
) => {
  const {
    retryAttempts = 3,
    retryDelay = 1000,
    cacheTime = 5 * 60 * 1000, // 5 минут
    staleTime = 1 * 60 * 1000, // 1 минута
  } = options;

  const [state, setState] = useState<LoadingState<T>>({
    data: null,
    loading: false,
    error: null,
    retryCount: 0,
  });

  const cacheRef = useRef<{
    data: T | null;
    timestamp: number;
    staleTime: number;
  }>({
    data: null,
    timestamp: 0,
    staleTime: 0,
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Проверка кеша
  const getCachedData = useCallback((): T | null => {
    const now = Date.now();
    const { data, timestamp } = cacheRef.current;

    if (data && (now - timestamp) < cacheTime) {
      return data;
    }

    return null;
  }, [cacheTime]);

  // Проверка актуальности данных
  const isDataStale = useCallback((): boolean => {
    const now = Date.now();
    const { timestamp } = cacheRef.current;

    return (now - timestamp) > cacheTime;
  }, [cacheTime]);

  // Загрузка данных
  const loadData = useCallback(async (forceRefresh: boolean = false) => {
    // Отменяем предыдущий запрос
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Проверяем кеш если не принудительное обновление
    if (!forceRefresh) {
      const cachedData = getCachedData();
      if (cachedData && !isDataStale()) {
        setState(prevState => ({
          ...prevState,
          data: cachedData,
          loading: false,
          error: null,
        }));
        return cachedData;
      }
    }

    setState(prevState => ({
      ...prevState,
      loading: true,
      error: null,
    }));

    // Создаем новый AbortController
    abortControllerRef.current = new AbortController();

    try {
      const data = await fetcher();
      
      // Сохраняем в кеш
      cacheRef.current = {
        data,
        timestamp: Date.now(),
        staleTime,
      };

      setState(prevState => ({
        ...prevState,
        data,
        loading: false,
        error: null,
        retryCount: 0,
      }));

      return data;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // Запрос был отменен
        return;
      }

      setState(prevState => ({
        ...prevState,
        loading: false,
        error: error as Error,
      }));

      throw error;
    }
  }, [fetcher, getCachedData, isDataStale, staleTime]);

  // Повторная попытка загрузки
  const retry = useCallback(async () => {
    if (state.retryCount >= retryAttempts) {
      return;
    }

    setState(prevState => ({
      ...prevState,
      retryCount: prevState.retryCount + 1,
    }));

    // Задержка перед повторной попыткой
    await new Promise(resolve => {
      retryTimeoutRef.current = setTimeout(resolve, retryDelay * state.retryCount);
    });

    try {
      await loadData(true);
    } catch {
      // Ошибка уже обработана в loadData
    }
  }, [state.retryCount, retryAttempts, retryDelay, loadData]);

  // Обновление данных
  const refresh = useCallback(() => {
    return loadData(true);
  }, [loadData]);

  // Очистка кеша
  const clearCache = useCallback(() => {
    cacheRef.current = {
      data: null,
      timestamp: 0,
      staleTime: 0,
    };
  }, []);

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    retryCount: state.retryCount,
    loadData,
    retry,
    refresh,
    clearCache,
    isDataStale: isDataStale(),
  };
};

/**
 * Хук для загрузки данных с зависимостями
 * @param fetcher - функция для загрузки данных
 * @param deps - зависимости
 * @param options - опции загрузки
 * @returns объект с состоянием загрузки
 */
export const useDataLoadingWithDeps = <T>(
  fetcher: (...deps: any[]) => Promise<T>,
  deps: any[],
  options: LoadingOptions = {}
) => {
  const loadingHook = useDataLoading(fetcher, options);

  useEffect(() => {
    loadingHook.loadData();
  }, [loadingHook, deps]);

  return loadingHook;
};

/**
 * Хук для загрузки данных с интервалом
 * @param fetcher - функция для загрузки данных
 * @param interval - интервал в миллисекундах
 * @param options - опции загрузки
 * @returns объект с состоянием загрузки
 */
export const useDataLoadingWithInterval = <T>(
  fetcher: () => Promise<T>,
  interval: number,
  options: LoadingOptions = {}
) => {
  const loadingHook = useDataLoading(fetcher, options);
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    // Первоначальная загрузка
    loadingHook.loadData();

    // Устанавливаем интервал
    intervalRef.current = setInterval(() => {
      loadingHook.refresh();
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [interval, loadingHook]);

  return loadingHook;
};

/**
 * Хук для загрузки данных при видимости элемента
 * @param fetcher - функция для загрузки данных
 * @param options - опции загрузки
 * @returns объект с состоянием загрузки и ref для элемента
 */
export const useDataLoadingOnVisible = <T>(
  fetcher: () => Promise<T>,
  options: LoadingOptions = {}
) => {
  const loadingHook = useDataLoading(fetcher, options);
  const elementRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          loadingHook.loadData();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [isVisible, loadingHook]);

  return {
    ...loadingHook,
    elementRef,
    isVisible,
  };
};
