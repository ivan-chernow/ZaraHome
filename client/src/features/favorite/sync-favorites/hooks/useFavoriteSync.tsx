'use client';

import { useMemo } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { RootState } from '@/shared/config/store/store';
import { useFavoriteDataSync } from './useFavoriteDataSync';
import { FavoriteSyncResult } from '../types/types';

/**
 * Основной хук для синхронизации избранных товаров
 * Объединяет данные из localStorage и сервера, управляет состоянием загрузки
 *
 * @returns Объект с данными избранного и состоянием
 */
export const useFavoriteSync = (): FavoriteSyncResult => {
  // Единый селектор для сокращения ререндеров
  const { isAuthenticated, rawUserId } = useSelector(
    (state: RootState) => ({
      isAuthenticated: state.auth.isAuthenticated,
      rawUserId: state.auth.user?.id,
    }),
    shallowEqual
  );
  const userId = useMemo(
    () => (rawUserId != null ? Number(rawUserId) : undefined),
    [rawUserId]
  );

  // Получение и синхронизация данных избранного
  const { favoriteProducts, isLoading } = useFavoriteDataSync(
    isAuthenticated,
    userId
  );

  // Логика отображения UI
  const shouldShowList = useMemo(
    () => isLoading || favoriteProducts.length > 0,
    [isLoading, favoriteProducts.length]
  );

  return {
    favoriteProducts,
    isLoading,
    isAuthenticated,
    userId,
    shouldShowList,
  };
};

export default useFavoriteSync;
