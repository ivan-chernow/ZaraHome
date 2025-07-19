import React from "react";
import type { Product } from "@/api/products.api";
import SearchResultProductCard from "./SearchResultProductCard";

interface SearchResultsProps {
  products: Product[];
  isLoading?: boolean;
  searchValue: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  products,
  isLoading,
  searchValue,
}) => {
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
      <div className="grid grid-cols-4 gap-6 w-full">
        {products.map((product) => (
          <SearchResultProductCard
            key={product.id}
            product={product}
            searchText={searchValue}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
