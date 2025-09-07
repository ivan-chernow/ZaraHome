import { useEffect, useRef, useCallback, useState } from 'react';

/**
 * Хуки для мониторинга и оптимизации производительности
 */

/**
 * Хук для измерения времени выполнения функций
 * @param fn - функция для измерения
 * @param deps - зависимости
 * @returns функция с измерением времени выполнения
 */
export const usePerformanceMeasure = <T extends (...args: any[]) => any>(
  fn: T,
): T => {

  return useCallback((...args: Parameters<T>) => {
    const startTime = performance.now();
    const result = fn(...args);
    const endTime = performance.now();
    
    // Log only in development to avoid noise in production
    if (process.env.NODE_ENV === 'development') {
      console.log(`Function ${fn.name || 'anonymous'} took ${endTime - startTime} ms`);
    }
    
    return result;
  }, [fn]) as T;
};

/**
 * Хук для мониторинга FPS (кадров в секунду)
 * @param threshold - минимальный FPS для предупреждения
 * @returns текущий FPS
 */
export const useFPSMonitor = (threshold: number = 30) => {
  const [fps, setFps] = useState(0);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const measureFPS = () => {
      const now = performance.now();
      frameCountRef.current++;

      if (now - lastTimeRef.current >= 1000) {
        const currentFPS = Math.round((frameCountRef.current * 1000) / (now - lastTimeRef.current));
        setFps(currentFPS);

        if (currentFPS < threshold && process.env.NODE_ENV === 'development') {
          console.warn(`Low FPS detected: ${currentFPS} (threshold: ${threshold})`);
        }

        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }

      animationFrameRef.current = requestAnimationFrame(measureFPS);
    };

    animationFrameRef.current = requestAnimationFrame(measureFPS);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [threshold]);

  return fps;
};

/**
 * Хук для мониторинга использования памяти
 * @returns информация об использовании памяти
 */
export const useMemoryMonitor = () => {
  const [memoryInfo, setMemoryInfo] = useState<{
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  } | null>(null);

  useEffect(() => {
    const updateMemoryInfo = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        setMemoryInfo({
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit,
        });
      }
    };

    updateMemoryInfo();
    const interval = setInterval(updateMemoryInfo, 5000); // обновляем каждые 5 секунд

    return () => clearInterval(interval);
  }, []);

  return memoryInfo;
};

/**
 * Хук для мониторинга размера DOM
 * @returns количество DOM узлов
 */
export const useDOMMonitor = () => {
  const [nodeCount, setNodeCount] = useState(0);

  useEffect(() => {
    const updateNodeCount = () => {
      setNodeCount(document.querySelectorAll('*').length);
    };

    updateNodeCount();
    const interval = setInterval(updateNodeCount, 10000); // обновляем каждые 10 секунд

    return () => clearInterval(interval);
  }, []);

  return nodeCount;
};

/**
 * Хук для оптимизации ререндеров с помощью Intersection Observer
 * @param threshold - порог видимости
 * @returns объект с ref и состоянием видимости
 */
export const useIntersectionObserver = (threshold: number = 0.1) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      { threshold }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, hasIntersected]);

  return { ref, isIntersecting, hasIntersected };
};

/**
 * Хук для ленивой загрузки компонентов
 * @param importFn - функция импорта компонента
 * @param fallback - компонент загрузки
 * @returns ленивый компонент
 */
export const useLazyComponent = <T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback: React.ComponentType<any> = () => null
) => {
  const [Component, setComponent] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    importFn()
      .then((module) => {
        setComponent(() => module.default);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
      });
  }, [importFn]);

  if (isLoading) return fallback;
  if (error) return () => null;
  if (!Component) return fallback;

  return Component;
};

/**
 * Хук для оптимизации анимаций с помощью requestAnimationFrame
 * @param callback - функция анимации
 * @param deps - зависимости
 * @returns функция для запуска анимации
 */
export const useAnimationFrame = (
  callback: (time: number) => void,
) => {
  const requestRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | null>(null);

  const animate = useCallback((time: number) => {
    if (previousTimeRef.current !== null) {
      const deltaTime = time - previousTimeRef.current;
      callback(deltaTime);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }, [callback]);

  const startAnimation = useCallback(() => {
    if (requestRef.current !== null) {
      cancelAnimationFrame(requestRef.current);
    }
    requestRef.current = requestAnimationFrame(animate);
  }, [animate]);

  const stopAnimation = useCallback(() => {
    if (requestRef.current !== null) {
      cancelAnimationFrame(requestRef.current);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return { startAnimation, stopAnimation };
};