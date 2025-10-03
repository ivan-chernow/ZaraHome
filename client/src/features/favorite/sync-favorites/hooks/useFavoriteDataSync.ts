import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/shared/config/store/store';
import { useGetFavoritesQuery } from '@/entities/favorite/api/favorites.api';
import { useGetCatalogQuery } from '@/entities/product/api/products.api';
import { getAllProducts } from '@/entities/category/lib/catalog.utils';
import { getLocalStorage } from '@/shared/lib/storage';
import { setFavorites } from '@/entities/favorite/model/favorites.slice';
import { Product } from '@/entities/product/api/product.types';
import { FavoriteDataSyncResult } from '../types/types';

/**
 * Хук для получения и синхронизации данных избранного
 * Объединяет localStorage синхронизацию, получение данных и состояние загрузки
 */
export const useFavoriteDataSync = (
  isAuthenticated: boolean,
  userId?: number
): FavoriteDataSyncResult => {
  const dispatch = useDispatch();

  const favoriteIds = useSelector((state: RootState) => state.favorites.ids);

  // Получение ключа для localStorage
  const getStorageKey = useCallback(
    (forUser = isAuthenticated && userId) =>
      forUser ? `${'favorites'}:${userId}` : 'favorites',
    [isAuthenticated, userId]
  );

  // Загрузка избранного для текущего пользователя
  const loadFavoritesForCurrentUser = useCallback(() => {
    const storageKey = getStorageKey();
    const favorites: number[] = getLocalStorage(storageKey, []);
    dispatch(setFavorites(favorites));
  }, [getStorageKey, dispatch]);

  // Синхронизация с localStorage
  const syncWithStorage = useCallback(() => {
    const storageKey = getStorageKey();
    const storageFavorites: number[] = getLocalStorage(storageKey, []);

    const hasChanges =
      storageFavorites.length !== favoriteIds.length ||
      storageFavorites.some(id => !favoriteIds.includes(id));

    if (hasChanges) {
      dispatch(setFavorites(storageFavorites));
    }
  }, [getStorageKey, favoriteIds, dispatch]);

  // Получение каталога
  const {
    data: categories,
    isLoading: isLoadingCatalog,
    error: catalogError,
  } = useGetCatalogQuery();

  // Получение избранного с сервера
  const {
    data: serverFavorites = [],
    isLoading: isLoadingServer,
    isFetching: isFetchingServer,
    error: serverError,
  } = useGetFavoritesQuery(userId, {
    skip: !isAuthenticated || !userId,
  });

  // Маппинг локальных ID на продукты
  const localProducts = useMemo((): Product[] => {
    if (!categories || favoriteIds.length === 0) {
      return [];
    }

    try {
      const allProducts = getAllProducts(categories);
      return allProducts.filter(product =>
        favoriteIds.includes(product.id)
      ) as Product[];
    } catch (error) {
      console.error('Error mapping local favorites:', error);
      return [];
    }
  }, [categories, favoriteIds]);

  // Объединение локальных и серверных данных
  const favoriteProducts = useMemo((): Product[] => {
    const productMap = new Map<number, Product>();

    // Добавляем локальные продукты
    localProducts.forEach(product => {
      productMap.set(product.id, product);
    });

    // Серверные данные имеют приоритет
    if (Array.isArray(serverFavorites)) {
      (serverFavorites as Product[]).forEach(product => {
        productMap.set(product.id, product);
      });
    }

    return Array.from(productMap.values());
  }, [localProducts, serverFavorites]);

  // Определение состояния загрузки
  const isLoading = useMemo(() => {
    if (favoriteProducts.length > 0) {
      return false;
    }

    if (favoriteIds.length > 0 && isLoadingCatalog) {
      return true;
    }

    if (isAuthenticated && userId && (isLoadingServer || isFetchingServer)) {
      return true;
    }

    return isLoadingCatalog || (isAuthenticated && !!userId && isLoadingServer);
  }, [
    favoriteProducts.length,
    favoriteIds.length,
    isLoadingCatalog,
    isAuthenticated,
    userId,
    isLoadingServer,
    isFetchingServer,
  ]);

  // Метрики для аналитики
  const metrics = useMemo(
    () => ({
      favoriteCount: favoriteProducts.length,
      hasLocalFavorites: localProducts.length > 0,
      hasServerFavorites:
        Array.isArray(serverFavorites) && serverFavorites.length > 0,
    }),
    [favoriteProducts.length, localProducts.length, serverFavorites]
  );

  // Инициализация: префилл из localStorage при первом рендере
  useEffect(() => {
    const initialStorageKey = getStorageKey();
    const initialFavorites = getLocalStorage(initialStorageKey, []);
    if (initialFavorites.length > 0 && favoriteIds.length === 0) {
      dispatch(setFavorites(initialFavorites));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Синхронизация при изменении localStorage-ключа или локальных ids
  useEffect(() => {
    syncWithStorage();
  }, [syncWithStorage]);

  // Смена пользователя/статуса авторизации — заново читаем соответствующий ключ
  useEffect(() => {
    dispatch(setFavorites([]));
    loadFavoritesForCurrentUser();
  }, [isAuthenticated, userId, dispatch, loadFavoritesForCurrentUser]);

  // Логирование ошибок в development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      if (catalogError) {
        console.warn('Catalog loading error:', catalogError);
      }
      if (serverError) {
        console.warn('Server favorites error:', serverError);
      }
    }
  }, [catalogError, serverError]);

  return {
    favoriteProducts,
    isLoading,
    ...metrics,
  };
};
