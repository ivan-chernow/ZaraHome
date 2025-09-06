import { useMemo } from 'react';

/**
 * Хук для работы с изображениями
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

/**
 * Создает полный URL для изображения
 * @param path - путь к изображению
 * @returns полный URL или undefined
 */
export const useImageUrl = (path?: string): string | undefined => {
  return useMemo(() => {
    if (!path) return undefined;
    
    try {
      const cleanPath = path.replace(/^\/+/, "");
      return `${API_URL}/${cleanPath}`;
    } catch {
      return path;
    }
  }, [path]);
};

/**
 * Создает массив полных URL для изображений
 * @param paths - массив путей к изображениям
 * @returns массив полных URL
 */
export const useImageUrls = (paths?: string[]): string[] => {
  return useMemo(() => {
    if (!Array.isArray(paths)) return [];
    
    return paths
      .map(path => {
        if (!path) return undefined;
        try {
          const cleanPath = path.replace(/^\/+/, "");
          return `${API_URL}/${cleanPath}`;
        } catch {
          return path;
        }
      })
      .filter((url): url is string => url !== undefined);
  }, [paths]);
};

/**
 * Получает первое доступное изображение из массива
 * @param paths - массив путей к изображениям
 * @param fallback - резервный путь
 * @returns URL первого изображения или fallback
 */
export const useFirstImageUrl = (paths?: string[], fallback?: string): string => {
  return useMemo(() => {
    if (!Array.isArray(paths) || paths.length === 0) {
      return fallback || "/assets/img/Catalog/product2.png";
    }
    
    const firstPath = paths[0];
    if (!firstPath) {
      return fallback || "/assets/img/Catalog/product2.png";
    }
    
    try {
      const cleanPath = firstPath.replace(/^\/+/, "");
      return `${API_URL}/${cleanPath}`;
    } catch {
      return firstPath;
    }
  }, [paths, fallback]);
};
