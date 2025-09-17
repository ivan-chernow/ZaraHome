'use client';

import React from 'react';
import MainLayout from '@/widgets/layout/MainLayout';
import { FavoritePageContent } from '@/widgets/favorite/ui/FavoritePageContent';

const FavoritePage: React.FC = () => (
  <MainLayout>
    <FavoritePageContent />
  </MainLayout>
);

export default FavoritePage;