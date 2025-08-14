/**
 * Утилиты для безопасной работы с localStorage
 * Предотвращают ошибки hydration при SSR
 */

export const getLocalStorage = (key: string, defaultValue: any = null) => {
  if (typeof window === 'undefined') {
    return defaultValue;
  }
  
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const setLocalStorage = (key: string, value: any) => {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Игнорируем ошибки записи в localStorage
  }
};

export const removeLocalStorage = (key: string) => {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    localStorage.removeItem(key);
  } catch {
    // Игнорируем ошибки удаления из localStorage
  }
};

export const clearLocalStorage = () => {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    localStorage.clear();
  } catch {
    // Игнорируем ошибки очистки localStorage
  }
}; 