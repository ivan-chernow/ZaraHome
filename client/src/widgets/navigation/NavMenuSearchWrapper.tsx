"use client";
import React, { useState, useMemo, useEffect } from "react";
import SearchInput from "../../features/search/ui/SearchInput";
import SearchResults from "../search/SearchResults";
import { useGetCatalogQuery } from "@/api/products.api";
import { getAllProducts } from "@/entities/category/lib/catalog.utils";
import type { Product } from "@/api/products.api";
import useDebounce from "@/shared/lib/hooks/useDebounce";

interface NavMenuSearchWrapperProps {
  children: React.ReactNode;
  alwaysShowChildren?: boolean;
}

const NavMenuSearchWrapper: React.FC<NavMenuSearchWrapperProps> = ({
  children,
  alwaysShowChildren = false,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebounce(searchValue, 500);
  const { data: categories, isLoading } = useGetCatalogQuery();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const allProducts = useMemo(() => {
    return categories ? getAllProducts(categories) : [];
  }, [categories]);

  useEffect(() => {
    if (debouncedSearchValue.trim()) {
      const lowercasedValue = debouncedSearchValue.toLowerCase();
      const results = allProducts.filter((product) => {
        const nameRuWords = product.name_ru.toLowerCase().split(" ");
        const nameEngWords = product.name_eng.toLowerCase().split(" ");

        return (
          nameRuWords.some((word) => word.startsWith(lowercasedValue)) ||
          nameEngWords.some((word) => word.startsWith(lowercasedValue))
        );
      });
      setFilteredProducts(results);
    } else {
      setFilteredProducts([]);
    }
  }, [debouncedSearchValue, allProducts]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <SearchInput value={searchValue} onChange={handleSearchChange} />
      {debouncedSearchValue.trim() && (
        <SearchResults
          products={filteredProducts}
          isLoading={isLoading}
          searchValue={debouncedSearchValue}
        />
      )}
      {(!debouncedSearchValue.trim() || alwaysShowChildren) && children}
    </div>
  );
};

export default NavMenuSearchWrapper;
