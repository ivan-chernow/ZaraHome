import { useState, useCallback, useRef, useEffect, useMemo } from 'react';

/**
 * Хуки для поиска
 */

interface SearchOptions<T> {
  searchFields: (keyof T)[];
  caseSensitive?: boolean;
  minSearchLength?: number;
  debounceDelay?: number;
  maxResults?: number;
}

interface SearchState<T> {
  query: string;
  results: T[];
  isSearching: boolean;
  hasSearched: boolean;
  totalResults: number;
}

/**
 * Хук для поиска по массиву данных
 * @param data - массив данных для поиска
 * @param options - опции поиска
 * @returns объект с состоянием поиска и методами
 */
export const useSearch = <T extends Record<string, any>>(
  data: T[],
  options: SearchOptions<T>
) => {
  const {
    searchFields,
    caseSensitive = false,
    minSearchLength = 1,
    debounceDelay = 300,
    maxResults = 100,
  } = options;

  const [state, setState] = useState<SearchState<T>>({
    query: '',
    results: [],
    isSearching: false,
    hasSearched: false,
    totalResults: 0,
  });

  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const searchIndexRef = useRef<Map<string, T[]>>(new Map());

  // Создание поискового индекса
  const createSearchIndex = useCallback((items: T[]) => {
    const index = new Map<string, T[]>();

    items.forEach(item => {
      searchFields.forEach(field => {
        const value = item[field];
        if (value && typeof value === 'string') {
          const searchValue = caseSensitive ? value : value.toLowerCase();
          const words = searchValue.split(/\s+/);

          words.forEach(word => {
            if (word.length >= minSearchLength) {
              if (!index.has(word)) {
                index.set(word, []);
              }
              index.get(word)!.push(item);
            }
          });
        }
      });
    });

    return index;
  }, [searchFields, caseSensitive, minSearchLength]);

  // Обновление поискового индекса при изменении данных
  useEffect(() => {
    searchIndexRef.current = createSearchIndex(data);
  }, [data, createSearchIndex]);

  // Выполнение поиска
  const performSearch = useCallback((query: string) => {
    if (query.length < minSearchLength) {
      setState(prevState => ({
        ...prevState,
        query,
        results: [],
        isSearching: false,
        hasSearched: false,
        totalResults: 0,
      }));
      return;
    }

    setState(prevState => ({
      ...prevState,
      isSearching: true,
    }));

    const searchQuery = caseSensitive ? query : query.toLowerCase();
    const searchWords = searchQuery.split(/\s+/).filter(word => word.length >= minSearchLength);

    if (searchWords.length === 0) {
      setState(prevState => ({
        ...prevState,
        query,
        results: [],
        isSearching: false,
        hasSearched: true,
        totalResults: 0,
      }));
      return;
    }

    // Поиск по индексу
    const resultsMap = new Map<T, number>();
    const index = searchIndexRef.current;

    searchWords.forEach(word => {
      const items = index.get(word) || [];
      items.forEach(item => {
        resultsMap.set(item, (resultsMap.get(item) || 0) + 1);
      });
    });

    // Сортируем результаты по релевантности
    const sortedResults = Array.from(resultsMap.entries())
      .filter(([, score]) => score === searchWords.length) // Только полные совпадения
      .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
      .map(([item]) => item)
      .slice(0, maxResults);

    setState(prevState => ({
      ...prevState,
      query,
      results: sortedResults,
      isSearching: false,
      hasSearched: true,
      totalResults: sortedResults.length,
    }));
  }, [caseSensitive, minSearchLength, maxResults]);

  // Дебаунсированный поиск
  const search = useCallback((query: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      performSearch(query);
    }, debounceDelay);
  }, [performSearch, debounceDelay]);

  // Очистка поиска
  const clearSearch = useCallback(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    setState(prevState => ({
      ...prevState,
      query: '',
      results: [],
      isSearching: false,
      hasSearched: false,
      totalResults: 0,
    }));
  }, []);

  // Очистка таймаута при размонтировании
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return {
    query: state.query,
    results: state.results,
    isSearching: state.isSearching,
    hasSearched: state.hasSearched,
    totalResults: state.totalResults,
    search,
    clearSearch,
  };
};

/**
 * Хук для поиска с фильтрацией
 * @param data - массив данных
 * @param searchOptions - опции поиска
 * @param filterOptions - опции фильтрации
 * @returns объект с результатами поиска и фильтрации
 */
export const useSearchWithFilters = <T extends Record<string, any>>(
  data: T[],
  searchOptions: SearchOptions<T>,
  filterOptions: {
    filters: Record<string, (value: any) => boolean>;
    activeFilters: Record<string, any>;
  }
) => {
  const searchHook = useSearch(data, searchOptions);

  // Фильтрация результатов поиска
  const filteredResults = useMemo(() => {
    const { filters, activeFilters } = filterOptions;
    
    return searchHook.results.filter(item => {
      return Object.entries(activeFilters).every(([key, value]) => {
        if (!value) return true;
        const filterFn = filters[key];
        return filterFn ? filterFn(item[key]) : true;
      });
    });
  }, [searchHook.results, filterOptions]);

  return {
    ...searchHook,
    filteredResults,
  };
};

/**
 * Хук для поиска с автодополнением
 * @param data - массив данных
 * @param searchOptions - опции поиска
 * @param suggestionsOptions - опции автодополнения
 * @returns объект с результатами поиска и предложениями
 */
export const useSearchWithSuggestions = <T extends Record<string, any>>(
  data: T[],
  searchOptions: SearchOptions<T>,
  suggestionsOptions: {
    maxSuggestions?: number;
    suggestionFields: (keyof T)[];
  }
) => {
  const searchHook = useSearch(data, searchOptions);
  const { maxSuggestions = 5, suggestionFields } = suggestionsOptions;

  // Генерация предложений
  const suggestions = useMemo(() => {
    if (searchHook.query.length < searchOptions.minSearchLength) {
      return [];
    }

    const suggestionsSet = new Set<string>();
    const query = searchOptions.caseSensitive ? searchHook.query : searchHook.query.toLowerCase();

    data.forEach(item => {
      suggestionFields.forEach(field => {
        const value = item[field];
        if (value && typeof value === 'string') {
          const searchValue = searchOptions.caseSensitive ? value : value.toLowerCase();
          
          if (searchValue.includes(query)) {
            suggestionsSet.add(value);
          }
        }
      });
    });

    return Array.from(suggestionsSet).slice(0, maxSuggestions);
  }, [data, searchHook.query, searchOptions, suggestionFields, maxSuggestions]);

  return {
    ...searchHook,
    suggestions,
  };
};

/**
 * Хук для поиска с историей
 * @param data - массив данных
 * @param searchOptions - опции поиска
 * @param historyOptions - опции истории
 * @returns объект с результатами поиска и историей
 */
export const useSearchWithHistory = <T extends Record<string, any>>(
  data: T[],
  searchOptions: SearchOptions<T>,
  historyOptions: {
    maxHistoryItems?: number;
    storageKey?: string;
  }
) => {
  const searchHook = useSearch(data, searchOptions);
  const { maxHistoryItems = 10, storageKey = 'search-history' } = historyOptions;

  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(storageKey);
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  // Сохранение в историю
  const saveToHistory = useCallback((query: string) => {
    if (query.length < searchOptions.minSearchLength) return;

    setSearchHistory(prevHistory => {
      const newHistory = [query, ...prevHistory.filter(item => item !== query)]
        .slice(0, maxHistoryItems);
      
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(storageKey, JSON.stringify(newHistory));
        } catch {
          // Игнорируем ошибки localStorage
        }
      }
      
      return newHistory;
    });
  }, [searchOptions.minSearchLength, maxHistoryItems, storageKey]);

  // Поиск с сохранением в историю
  const searchWithHistory = useCallback((query: string) => {
    searchHook.search(query);
    saveToHistory(query);
  }, [searchHook, saveToHistory]);

  // Очистка истории
  const clearHistory = useCallback(() => {
    setSearchHistory([]);
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(storageKey);
      } catch {
        // Игнорируем ошибки localStorage
      }
    }
  }, [storageKey]);

  return {
    ...searchHook,
    searchHistory,
    search: searchWithHistory,
    clearHistory,
  };
};
