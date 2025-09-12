import { useState, useEffect, useCallback } from 'react';
import {
  getLocalStorage,
  setLocalStorage,
  removeLocalStorage,
} from '../storage';

/**
 * Хук для работы с localStorage
 * @param key - ключ в localStorage
 * @param initialValue - начальное значение
 * @returns [значение, функция для установки значения, функция для удаления]
 */
export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] => {
  // Получаем значение из localStorage или используем начальное
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = getLocalStorage(key, initialValue);
      return item;
    } catch {
      // console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Функция для установки значения
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        // Позволяем value быть функцией, чтобы обновить состояние
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;

        // Сохраняем в состояние
        setStoredValue(valueToStore);

        // Сохраняем в localStorage
        setLocalStorage(key, valueToStore);
      } catch {
        // console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Функция для удаления значения
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      removeLocalStorage(key);
    } catch {
      // console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Синхронизация с изменениями в localStorage (например, из других вкладок)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch {
          // console.warn(`Error parsing localStorage value for key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue, removeValue];
};

/**
 * Хук для работы с localStorage с дебаунсингом
 * @param key - ключ в localStorage
 * @param initialValue - начальное значение
 * @param delay - задержка для дебаунсинга (по умолчанию 300ms)
 * @returns [значение, функция для установки значения, функция для удаления]
 */
export const useDebouncedLocalStorage = <T>(
  key: string,
  initialValue: T,
  delay: number = 300
): [T, (value: T | ((prev: T) => T)) => void, () => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = getLocalStorage(key, initialValue);
      return item;
    } catch {
      // console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Дебаунсинг для записи в localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      setLocalStorage(key, storedValue);
    }, delay);

    return () => clearTimeout(timer);
  }, [storedValue, key, delay]);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
      } catch {
        // console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [storedValue]
  );

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      removeLocalStorage(key);
    } catch {
      // console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};
