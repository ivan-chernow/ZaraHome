'use client';

import React, { useMemo } from 'react';
import { Container } from '@mui/material';
import { useGetCatalogQuery } from '@/entities/product/api/products.api';
import { getAllProducts } from '@/entities/category/lib/catalog.utils';
import NavMenuProductCard from './NavMenuProductCard';
import type { Product } from '@/entities/product/api/products.api';
import NavMenuSearchWrapper from './NavMenuSearchWrapper';
import PaginationBlock from '../../shared/ui/pagination/PaginationBlock';
import PaginationStats from '../../shared/ui/pagination/PaginationStats';
import { usePagination } from '@/shared/lib/hooks/usePagination';

interface NavMenuPaginationProps {
  filterType: 'discount' | 'new';
  pageSize?: number;
}

const NavMenuPagination: React.FC<NavMenuPaginationProps> = ({
  filterType,
  pageSize = 8,
}) => {
  const { data: categories } = useGetCatalogQuery();

  // Фильтруем и сортируем продукты
  const filteredProducts: Product[] = useMemo(() => {
    if (!categories) return [];

    const allProducts = getAllProducts(categories);

    if (filterType === 'discount') {
      return allProducts
        .filter((p: Product) => p.discount && p.discount > 0)
        .sort((a: Product, b: Product) => b.discount! - a.discount!);
    } else if (filterType === 'new') {
      return allProducts
        .filter(p => p.isNew)
        .sort(
          (a, b) =>
            new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
        );
    }

    return [];
  }, [categories, filterType]);

  // Используем хук пагинации
  const {
    currentPage,
    totalPages,
    paginatedItems: paginatedProducts,
    handlePageChange,
  } = usePagination(filteredProducts, {
    totalItems: filteredProducts.length,
    pageSize,
  });

  // Получаем заголовок в зависимости от типа фильтра
  const getTitle = () => {
    return filterType === 'discount' ? 'Товары со скидкой' : 'Новые товары';
  };

  return (
    <div className="absolute top-0 left-0 w-screen bg-white z-50 h-auto shadow-[0_4px_20px_rgba(0,0,0,0.25)]">
      <Container maxWidth="lg">
        <div className="flex flex-col items-center">
          <NavMenuSearchWrapper alwaysShowChildren={true}>
            <div className="w-full py-8">
              {/* Заголовок */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-semibold mb-2">{getTitle()}</h3>
                <PaginationStats
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filteredProducts.length}
                  pageSize={pageSize}
                  className="mb-4"
                />
              </div>

              {/* Сетка товаров */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-6">
                {paginatedProducts.map((product: Product) => (
                  <NavMenuProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Пагинация - показываем только если есть больше одной страницы */}
              {totalPages > 1 && (
                <PaginationBlock
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  size="small"
                  className="mt-4"
                />
              )}

              {/* Сообщение если товаров нет */}
              {filteredProducts.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    {filterType === 'discount'
                      ? 'Товары со скидкой не найдены'
                      : 'Новые товары не найдены'}
                  </p>
                </div>
              )}
            </div>
          </NavMenuSearchWrapper>
        </div>
      </Container>
    </div>
  );
};

export default NavMenuPagination;
