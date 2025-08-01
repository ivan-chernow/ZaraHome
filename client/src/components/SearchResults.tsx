import React from "react";
import type { Product } from "@/api/products.api";
import SearchResultProductCard from "./SearchResultProductCard";
import PaginationBlock from "./PaginationBlock";
import PaginationStats from "./PaginationStats";
import { usePagination } from "@/hooks/usePagination";
import { useSorting } from "@/hooks/useSorting";
import SortButtons from "./SortButtons";

interface SearchResultsProps {
  products: Product[];
  isLoading?: boolean;
  searchValue: string;
  pageSize?: number;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  products,
  isLoading,
  searchValue,
  pageSize = 12,
}) => {
  // Используем хук сортировки
  const { sortType, sortedProducts, handleSortByPrice, handleSortByDate } =
    useSorting({
      products,
    });

  // Используем хук пагинации только если есть результаты поиска
  const {
    currentPage,
    totalPages,
    paginatedItems: paginatedProducts,
    handlePageChange,
  } = usePagination(sortedProducts, {
    totalItems: sortedProducts.length,
    pageSize,
  });

  if (isLoading) {
    return (
      <div className="py-[50px] text-center text-gray-500">
        <p>Идет поиск...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-[50px] text-center text-gray-500">
        <p>По вашему запросу ничего не найдено.</p>
        <p>Попробуйте изменить запрос или поискать что-то другое.</p>
      </div>
    );
  }

  return (
    <div className="py-[50px]">
      {/* Статистика поиска */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">
          Результаты поиска: &ldquo;{searchValue}&rdquo;
        </h3>
        <PaginationStats
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={sortedProducts.length}
          pageSize={pageSize}
          className="mb-4"
        />
      </div>

      {/* Кнопки сортировки */}
      <div className="mb-6">
        <SortButtons
          sortType={sortType}
          onSortByPrice={handleSortByPrice}
          onSortByDate={handleSortByDate}
        />
      </div>

      {/* Сетка товаров */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full mb-8">
        {paginatedProducts.map((product) => (
          <SearchResultProductCard
            key={product.id}
            product={product}
            searchText={searchValue}
          />
        ))}
      </div>

      {/* Пагинация - показываем только если есть больше одной страницы */}
      {totalPages > 1 && (
        <PaginationBlock
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default SearchResults;
