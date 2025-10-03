'use client';

import React, { use, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import ProductCard from '@/entities/product/ui/ProductCard';
import HomeIcon from '@/shared/ui/HomeIcon';
import { useGetCatalogQuery } from '@/entities/product/api/products.api';
import { getProductsBySubCategory } from '@/entities/category/lib/catalog.utils';
import Skeleton from '@mui/material/Skeleton';
import slugify from 'slugify';
import { useRouter, useSearchParams } from 'next/navigation';
import PaginationBlock from '@/shared/ui/pagination/PaginationBlock';
import { usePagination } from '@/shared/lib/hooks/usePagination';
import { useSorting } from '@/shared/lib/hooks/useSorting';
import { SectionTitle } from '@/shared/ui/SectionTitle';

const PAGE_SIZE = 12;

const ProductCardSkeleton = () => (
  <li className="w-[300px] h-[497px] mr-[-1px] bg-white relative group overflow-hidden rounded-xl shadow animate-pulse flex flex-col">
    <div
      className="mb-[18px] relative overflow-hidden"
      style={{ width: 'auto', height: 326 }}
    >
      <Skeleton
        variant="rectangular"
        width={300}
        height={326}
        className="rounded-xl"
      />
      <div className="absolute right-0 bottom-[-2.2px] z-10">
        <Skeleton variant="circular" width={56} height={56} />
      </div>
    </div>
    <div className="absolute top-2 left-2 z-10 flex flex-col gap-y-1">
      <Skeleton
        variant="rectangular"
        width={40}
        height={24}
        className="rounded"
      />
      <Skeleton
        variant="rectangular"
        width={40}
        height={24}
        className="rounded"
      />
    </div>
    <div className="flex px-[10px] gap-x-2 mb-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} variant="circular" width={24} height={24} />
      ))}
    </div>
    <Skeleton variant="text" width={180} height={28} className="ml-2" />
    <Skeleton variant="text" width={120} height={20} className="ml-2 mb-auto" />
    <div className="flex justify-between mt-4 px-[10px] items-end">
      <Skeleton variant="text" width={80} height={32} />
      <Skeleton
        variant="rectangular"
        width={56}
        height={40}
        className="rounded"
      />
    </div>
  </li>
);

interface SubCategoryPageContentProps {
  params: Promise<{ category: string; subCategory: string }>;
}

export const SubCategoryPageContent: React.FC<SubCategoryPageContentProps> = ({
  params,
}) => {
  const { category: categorySlug, subCategory: subCategorySlug } = use(params);
  const { data: categories, isLoading, error } = useGetCatalogQuery();
  const router = useRouter();
  const searchParams = useSearchParams();

  const prevSubCategory = useRef<string | undefined>(undefined);

  // Сброс страницы только если подкатегория реально меняется
  useEffect(() => {
    if (
      prevSubCategory.current &&
      prevSubCategory.current !== subCategorySlug
    ) {
      // Сбрасываем страницу в URL
      const params = new URLSearchParams(searchParams);
      params.delete('page');
      router.push(`?${params.toString()}`, { scroll: false });
    }
    prevSubCategory.current = subCategorySlug;
  }, [subCategorySlug, router, searchParams]);

  const customSlugify = (text: string) =>
    slugify(text.replace('й', 'y'), { lower: true, strict: true });

  // Получаем продукты подкатегории
  const baseProducts = useMemo(() => {
    if (!categories) return [];
    const currentCategory = categories.find(
      cat => customSlugify(cat.name) === categorySlug
    );
    if (!currentCategory) return [];

    const currentSubCategory = currentCategory.subCategories?.find(
      sub => customSlugify(sub.name) === subCategorySlug
    );
    if (!currentSubCategory) return [];

    return getProductsBySubCategory(currentSubCategory);
  }, [categories, categorySlug, subCategorySlug]);

  // Используем хук сортировки
  const {
    sortType,
    sortedProducts: products,
    handleSortByPrice,
    handleSortByDate,
  } = useSorting({
    products: baseProducts,
  });

  // Используем хук пагинации
  const {
    currentPage,
    totalPages,
    paginatedItems: paginatedProducts,
    handlePageChange,
  } = usePagination(products, {
    totalItems: products.length,
    pageSize: PAGE_SIZE,
  });

  const subCategoryName = useMemo(() => {
    if (!categories) return decodeURIComponent(subCategorySlug);
    const currentCategory = categories.find(
      cat => customSlugify(cat.name) === categorySlug
    );
    if (!currentCategory) return decodeURIComponent(subCategorySlug);

    const currentSubCategory = currentCategory.subCategories?.find(
      sub => customSlugify(sub.name) === subCategorySlug
    );
    return currentSubCategory
      ? currentSubCategory.name
      : decodeURIComponent(subCategorySlug);
  }, [categories, categorySlug, subCategorySlug]);

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[500px]">
        <p className="text-red-500 text-lg">Ошибка загрузки товаров</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 pl-0">
      <div className="flex items-center mb-[39px]">
        <HomeIcon />
        <span className="mx-[6px] text-[#0000004D]">{' > '}</span>
        <span className="text-[#00000099] text-[14px] underline font-medium">
          {isLoading ? (
            <Skeleton variant="text" width={180} height={24} />
          ) : (
            subCategoryName
          )}
        </span>
      </div>

      {/* Заголовок подкатегории и сортировка + иконки справа */}
      <div className="flex flex-col mb-[60px] w-full">
        {isLoading ? (
          <Skeleton variant="text" width={320} height={48} />
        ) : (
          <SectionTitle title={subCategoryName} />
        )}

        {/* Кнопки сортировки или их скелетоны */}
        <div className="flex items-center justify-end mt-[53px]">
          {isLoading ? (
            <>
              <Skeleton
                variant="rectangular"
                width={170}
                height={32}
                className="rounded mr-[12px]"
              />
              <Skeleton
                variant="rectangular"
                width={170}
                height={32}
                className="rounded"
              />
            </>
          ) : (
            <>
              <button
                className={`flex items-center mr-[12px] cursor-pointer transition-all ease-in-out duration-300 hover:underline ${
                  sortType === 'price'
                    ? 'text-blue-600 font-semibold underline'
                    : ''
                }`}
                onClick={handleSortByPrice}
              >
                <Image
                  src="/assets/img/Catalog/cheap.png"
                  alt="cheap"
                  width={24}
                  height={24}
                />
                <p className="text-[14px] font-semibold mr-[3px]">
                  Сначала дешевые
                </p>
              </button>
              <button
                className={`flex items-center cursor-pointer transition-all ease-in-out duration-300 hover:underline ${
                  sortType === 'date'
                    ? 'text-blue-600 font-semibold underline'
                    : ''
                }`}
                onClick={handleSortByDate}
              >
                <Image
                  src="/assets/img/Catalog/Time_later.svg"
                  alt="later"
                  width={24}
                  height={24}
                />
                <p className="text-[14px] font-semibold mr-[5px]">
                  Добавлены позже
                </p>
              </button>
            </>
          )}
        </div>
      </div>

      <div className="w-full min-h-[300px] flex items-center justify-center">
        {isLoading ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </ul>
        ) : paginatedProducts && paginatedProducts.length > 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
            {paginatedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ul>
        ) : (
          <p className="text-center text-lg">Товаров нет</p>
        )}
      </div>

      {/* Пагинация - показываем только если есть больше одной страницы */}
      {!isLoading && totalPages > 1 && (
        <PaginationBlock
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default SubCategoryPageContent;
