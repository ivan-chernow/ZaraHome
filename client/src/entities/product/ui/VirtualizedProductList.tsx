'use client';

import React, { memo, useMemo, useCallback } from 'react';
import { useVirtualization } from '@/shared/lib/hooks/useVirtualization';
import ProductCard from './ProductCard';
import type { Product } from '@/entities/product/api/products.api';

interface VirtualizedProductListProps {
  products: Product[];
  itemHeight?: number;
  containerHeight?: number;
  overscan?: number;
  className?: string;
}

const VirtualizedProductList = memo<VirtualizedProductListProps>(
  function VirtualizedProductList({
    products,
    itemHeight = 497, // высота ProductCard
    containerHeight = 600,
    overscan = 5,
    className = '',
  }) {
    // Мемоизируем продукты для предотвращения лишних ререндеров
    const memoizedProducts = useMemo(() => products, [products]);

    // Используем виртуализацию
    const { virtualItems, totalSize, containerRef } = useVirtualization(
      memoizedProducts,
      {
        itemHeight,
        containerHeight,
        overscan,
      }
    );

    // Мемоизированный рендер элемента
    const renderItem = useCallback(
      (virtualItem: any) => {
        const product = memoizedProducts[virtualItem.index];
        if (!product) return null;

        return (
          <div
            key={product.id}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <ProductCard product={product} />
          </div>
        );
      },
      [memoizedProducts]
    );

    if (memoizedProducts.length === 0) {
      return (
        <div className={`flex items-center justify-center h-64 ${className}`}>
          <p className="text-gray-500">Товары не найдены</p>
        </div>
      );
    }

    return (
      <div className={`relative ${className}`}>
        <div
          ref={containerRef}
          className="overflow-auto"
          style={{ height: `${containerHeight}px` }}
        >
          <div style={{ height: `${totalSize}px`, position: 'relative' }}>
            {virtualItems.map(renderItem)}
          </div>
        </div>
      </div>
    );
  }
);

export default VirtualizedProductList;
