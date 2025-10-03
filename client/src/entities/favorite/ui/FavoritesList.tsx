'use client';

import React, { memo } from 'react';
import ProductCard from '@/entities/product/ui/ProductCard';
import { ProductCardSkeleton } from '@/entities/product/ui/ProductCardSkeleton';
import { FavoritesListProps } from '../types/FavoritesListProps.types';

export const FavoritesList: React.FC<FavoritesListProps> = memo(
  ({ products, isLoading, skeletonCount = 4 }) => {
    return (
      <ul
        className="grid grid-cols-4 gap-4"
        role="list"
        aria-label={
          isLoading
            ? 'Загрузка избранных товаров'
            : `Избранные товары (${products.length})`
        }
      >
        {isLoading
          ? [...Array(skeletonCount)].map((_, index) => (
              <li key={`skeleton-${index}`}>
                <ProductCardSkeleton />
              </li>
            ))
          : products?.map(product => (
              <li key={`product-${product.id}`}>
                <ProductCard product={product} />
              </li>
            ))}
      </ul>
    );
  }
);

export default FavoritesList;
