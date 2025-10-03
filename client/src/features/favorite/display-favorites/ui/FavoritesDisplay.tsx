'use client';

import React, { memo } from 'react';
import { FavoritesList } from '@/entities/favorite/ui/FavoritesList';
import { FavoritesEmptyState } from '@/entities/favorite/ui/FavoritesEmptyState';
import { useFavoriteSync } from '@/features/favorite/sync-favorites/hooks/useFavoriteSync';

export const FavoritesDisplay: React.FC = memo(() => {
  const { favoriteProducts, isLoading, shouldShowList } = useFavoriteSync();

  return shouldShowList ? (
    <FavoritesList products={favoriteProducts} isLoading={isLoading} />
  ) : (
    <FavoritesEmptyState />
  );
});

export default FavoritesDisplay;
