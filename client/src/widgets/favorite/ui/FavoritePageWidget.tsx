'use client';

import React, { memo } from 'react';
import { SectionTitle } from '@/shared/ui/SectionTitle';
import { FavoritesDisplay } from '@/features/favorite/display-favorites/ui/FavoritesDisplay';

export const FavoritePageWidget: React.FC = memo(() => {
  return (
    <div className="max-w-[1200px] mx-auto p-6">
      <SectionTitle title="Избранные товары" />
      <FavoritesDisplay />
    </div>
  );
});

export default FavoritePageWidget;
