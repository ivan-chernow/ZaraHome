import { useCallback, useRef } from 'react';

/**
 * Хук для создания обработчиков событий
 */

/**
 * Создает мемоизированный обработчик клика
 * @param handler - функция обработчик
 * @param deps - зависимости
 * @returns мемоизированная функция
 */
export const useClickHandler = <T extends (...args: any[]) => any>(
  handler: T
): T => {
  return useCallback((...args: Parameters<T>) => handler(...args), [handler]);
};

/**
 * Создает мемоизированный обработчик изменения
 * @param handler - функция обработчик
 * @param deps - зависимости
 * @returns мемоизированная функция
 */
export const useChangeHandler = <T extends (...args: any[]) => any>(
  handler: T
): T => {
  return useCallback((...args: Parameters<T>) => handler(...args), [handler]);
};

/**
 * Создает мемоизированный обработчик отправки формы
 * @param handler - функция обработчик
 * @param deps - зависимости
 * @returns мемоизированная функция
 */
export const useSubmitHandler = <T extends (...args: any[]) => any>(
  handler: T
): T => {
  return useCallback((...args: Parameters<T>) => handler(...args), [handler]);
};

/**
 * Создает мемоизированный обработчик наведения мыши
 * @param handler - функция обработчик
 * @param deps - зависимости
 * @returns мемоизированная функция
 */
export const useMouseHandler = <T extends (...args: any[]) => any>(
  handler: T
): T => {
  return useCallback((...args: Parameters<T>) => handler(...args), [handler]);
};

/**
 * Создает мемоизированный обработчик клавиатуры
 * @param handler - функция обработчик
 * @param deps - зависимости
 * @returns мемоизированная функция
 */
export const useKeyboardHandler = <T extends (...args: any[]) => any>(
  handler: T
): T => {
  return useCallback((...args: Parameters<T>) => handler(...args), [handler]);
};

/**
 * Создает обработчик с предотвращением множественных вызовов
 * @param handler - функция обработчик
 * @param delay - задержка между вызовами
 * @returns функция с защитой от множественных вызовов
 */
export const useThrottledHandler = <T extends (...args: any[]) => any>(
  handler: T,
  delay: number = 300
): T => {
  const lastCallRef = useRef<number>(0);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCallRef.current >= delay) {
        lastCallRef.current = now;
        return handler(...args);
      }
    },
    [handler, delay]
  ) as T;
};

/**
 * Создает обработчик с отменой предыдущих вызовов
 * @param handler - функция обработчик
 * @param delay - задержка
 * @returns функция с отменой предыдущих вызовов
 */
export const useDebouncedHandler = <T extends (...args: any[]) => any>(
  handler: T,
  delay: number = 300
): T => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        handler(...args);
      }, delay);
    },
    [handler, delay]
  ) as T;
};

/**
 * Создает обработчик с возможностью отмены
 * @param handler - функция обработчик
 * @param delay - задержка
 * @returns объект с обработчиком и функцией отмены
 */
export const useCancellableHandler = <T extends (...args: any[]) => any>(
  handler: T,
  delay: number = 300
) => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  const cancellableHandler = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        handler(...args);
      }, delay);
    },
    [handler, delay]
  );

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  return { handler: cancellableHandler, cancel };
};
