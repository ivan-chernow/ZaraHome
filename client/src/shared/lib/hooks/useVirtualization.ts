import { useState, useEffect, useRef, useMemo, useCallback } from 'react';

interface UseVirtualizationOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

interface VirtualizationResult {
  virtualItems: Array<{
    index: number;
    start: number;
    end: number;
    size: number;
  }>;
  totalSize: number;
  scrollToIndex: (index: number) => void;
  scrollToOffset: (offset: number) => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

/**
 * Хук для виртуализации больших списков
 * @param items - массив элементов для виртуализации
 * @param options - опции виртуализации
 * @returns объект с виртуализированными элементами и функциями управления
 */
export const useVirtualization = <T>(
  items: T[],
  options: UseVirtualizationOptions
): VirtualizationResult => {
  const { itemHeight, containerHeight, overscan = 5 } = options;
  
  const [scrollOffset, setScrollOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Вычисляем видимые элементы
  const virtualItems = useMemo(() => {
    const startIndex = Math.floor(scrollOffset / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + overscan,
      items.length - 1
    );

    const visibleStartIndex = Math.max(0, startIndex - overscan);
    const visibleEndIndex = Math.min(endIndex, items.length - 1);

    const result = [];
    for (let i = visibleStartIndex; i <= visibleEndIndex; i++) {
      result.push({
        index: i,
        start: i * itemHeight,
        end: (i + 1) * itemHeight,
        size: itemHeight,
      });
    }

    return result;
  }, [scrollOffset, itemHeight, containerHeight, overscan, items.length]);

  // Общий размер всех элементов
  const totalSize = useMemo(() => items.length * itemHeight, [items.length, itemHeight]);

  // Обработчик скролла
  const handleScroll = useCallback((e: Event) => {
    const target = e.target as HTMLDivElement;
    setScrollOffset(target.scrollTop);
  }, []);

  // Подписка на события скролла
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Функция для прокрутки к определенному индексу
  const scrollToIndex = useCallback((index: number) => {
    const container = containerRef.current;
    if (!container) return;

    const offset = index * itemHeight;
    container.scrollTop = offset;
    setScrollOffset(offset);
  }, [itemHeight]);

  // Функция для прокрутки к определенному смещению
  const scrollToOffset = useCallback((offset: number) => {
    const container = containerRef.current;
    if (!container) return;

    container.scrollTop = offset;
    setScrollOffset(offset);
  }, []);

  return {
    virtualItems,
    totalSize,
    scrollToIndex,
    scrollToOffset,
    containerRef,
  };
};

/**
 * Хук для виртуализации с динамической высотой элементов
 * @param items - массив элементов
 * @param options - опции виртуализации
 * @returns объект с виртуализированными элементами
 */
export const useDynamicVirtualization = <T>(
  items: T[],
  options: Omit<UseVirtualizationOptions, 'itemHeight'> & {
    getItemHeight: (index: number) => number;
  }
) => {
  const { containerHeight, overscan = 5, getItemHeight } = options;
  
  const [scrollOffset, setScrollOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemHeights = useRef<number[]>([]);

  // Вычисляем высоты элементов
  useEffect(() => {
    itemHeights.current = items.map((_, index) => getItemHeight(index));
  }, [items, getItemHeight]);

  // Вычисляем позиции элементов
  const itemPositions = useMemo(() => {
    const positions: number[] = [];
    let currentPosition = 0;
    
    for (let i = 0; i < items.length; i++) {
      positions[i] = currentPosition;
      currentPosition += itemHeights.current[i] || 0;
    }
    
    return positions;
  }, [items.length]);

  // Вычисляем видимые элементы
  const virtualItems = useMemo(() => {
    const startIndex = itemPositions.findIndex(pos => pos + (itemHeights.current[itemPositions.indexOf(pos)] || 0) > scrollOffset);
    const endIndex = itemPositions.findIndex(pos => pos > scrollOffset + containerHeight);
    
    const visibleStartIndex = Math.max(0, startIndex - overscan);
    const visibleEndIndex = Math.min(endIndex === -1 ? items.length - 1 : endIndex + overscan, items.length - 1);

    const result = [];
    for (let i = visibleStartIndex; i <= visibleEndIndex; i++) {
      const height = itemHeights.current[i] || 0;
      result.push({
        index: i,
        start: itemPositions[i],
        end: itemPositions[i] + height,
        size: height,
      });
    }

    return result;
  }, [scrollOffset, containerHeight, overscan, items.length, itemPositions]);

  // Общий размер
  const totalSize = useMemo(() => {
    return itemPositions[items.length - 1] + (itemHeights.current[items.length - 1] || 0);
  }, [itemPositions, items.length]);

  // Обработчик скролла
  const handleScroll = useCallback((e: Event) => {
    const target = e.target as HTMLDivElement;
    setScrollOffset(target.scrollTop);
  }, []);

  // Подписка на события скролла
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Функция для прокрутки к определенному индексу
  const scrollToIndex = useCallback((index: number) => {
    const container = containerRef.current;
    if (!container) return;

    const offset = itemPositions[index] || 0;
    container.scrollTop = offset;
    setScrollOffset(offset);
  }, [itemPositions]);

  // Функция для прокрутки к определенному смещению
  const scrollToOffset = useCallback((offset: number) => {
    const container = containerRef.current;
    if (!container) return;

    container.scrollTop = offset;
    setScrollOffset(offset);
  }, []);

  return {
    virtualItems,
    totalSize,
    scrollToIndex,
    scrollToOffset,
    containerRef,
  };
};