"use client";

import React, { useState, useMemo } from "react";
import { Container } from "@mui/material";
import { useGetCatalogQuery } from "@/api/products.api";
import { getAllProducts } from "@/entities/category/lib/catalog.utils";
import NavMenuProductCard from "./NavMenuProductCard";
import type { Product } from "@/api/products.api";
import NavMenuSearchWrapper from "./NavMenuSearchWrapper";
import PaginationBlock from "../../shared/ui/pagination/PaginationBlock";
import PaginationStats from "../../shared/ui/pagination/PaginationStats";
import { usePagination } from "@/shared/lib/hooks/usePagination";
import SearchInput from "../../features/search/ui/SearchInput";

interface NavMenuSearchProps {
  pageSize?: number;
}

const NavMenuSearch: React.FC<NavMenuSearchProps> = ({ pageSize = 8 }) => {
  const { data: categories } = useGetCatalogQuery();
  const [searchValue, setSearchValue] = useState("");

  // Получаем все продукты
  const allProducts: Product[] = useMemo(() => {
    if (!categories) return [];
    return getAllProducts(categories);
  }, [categories]);

  // Фильтруем продукты по поисковому запросу
  const filteredProducts: Product[] = useMemo(() => {
    if (!searchValue.trim()) return [];

    const searchLower = searchValue.toLowerCase();
    return allProducts.filter((product) => {
      const nameMatch = product.name_ru.toLowerCase().includes(searchLower);
      const descriptionMatch = product.description
        ?.toLowerCase()
        .includes(searchLower);

      return nameMatch || descriptionMatch;
    });
  }, [allProducts, searchValue]);

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  return (
    <div className="absolute top-0 left-0 w-screen bg-white z-50 h-auto shadow-[0_4px_20px_rgba(0,0,0,0.25)]">
      <Container maxWidth="lg">
        <div className="flex flex-col items-center">
          <NavMenuSearchWrapper alwaysShowChildren={true}>
            <div className="w-full py-8">
              {/* Поисковая строка */}
              <div className="mb-6">
                <SearchInput
                  value={searchValue}
                  onChange={handleSearchChange}
                  placeholder="Поиск товаров..."
                />
              </div>

              {/* Результаты поиска */}
              {searchValue.trim() && (
                <>
                  {/* Статистика поиска */}
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-semibold mb-2">
                      Результаты поиска: &ldquo;{searchValue}&rdquo;
                    </h3>
                    <PaginationStats
                      currentPage={currentPage}
                      totalPages={totalPages}
                      totalItems={filteredProducts.length}
                      pageSize={pageSize}
                      className="mb-4"
                    />
                  </div>

                  {/* Сетка товаров */}
                  {filteredProducts.length > 0 ? (
                    <>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-6">
                        {paginatedProducts.map((product: Product) => (
                          <NavMenuProductCard
                            key={product.id}
                            product={product}
                          />
                        ))}
                      </div>

                      {/* Пагинация */}
                      <PaginationBlock
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        size="small"
                        className="mt-4"
                      />
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">
                        По вашему запросу &ldquo;{searchValue}&rdquo; ничего не
                        найдено.
                      </p>
                      <p className="text-gray-400 text-sm mt-2">
                        Попробуйте изменить запрос или поискать что-то другое.
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* Приветственное сообщение */}
              {!searchValue.trim() && (
                <div className="text-center py-8">
                  <h3 className="text-2xl font-semibold mb-4">Поиск товаров</h3>
                  <p className="text-gray-600 mb-4">
                    Введите название товара или описание для поиска
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                    {allProducts.slice(0, 8).map((product: Product) => (
                      <NavMenuProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </NavMenuSearchWrapper>
        </div>
      </Container>
    </div>
  );
};

export default NavMenuSearch;
