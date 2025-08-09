"use client";

import { useMemo } from "react";
import { Container } from "@mui/material";
import { useGetCatalogQuery } from "@/api/products.api";
import { getAllProducts } from "@/store/features/catalog/catalog.utils";
import NavMenuProductCard from "./NavMenuProductCard";
import type { Product } from "@/api/products.api";
import NavMenuSearchWrapper from "./NavMenuSearchWrapper";
import NavMenuGridSkeleton from "./skeleton/NavMenuGridSkeleton";

const NavMenuOpenDiscounts = () => {
  const { data: categories, isLoading } = useGetCatalogQuery();

  const latestDiscountedProducts: Product[] = useMemo(() => {
    const allProductsFromCategories = categories
      ? getAllProducts(categories)
      : [];
    const allDiscountedProducts = allProductsFromCategories
      .filter((p: Product) => p.discount && p.discount > 0)
      .sort((a: Product, b: Product) => b.discount! - a.discount!);

    for (let i = allDiscountedProducts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allDiscountedProducts[i], allDiscountedProducts[j]] = [
        allDiscountedProducts[j],
        allDiscountedProducts[i],
      ];
    }

    return allDiscountedProducts.slice(0, 4);
  }, [categories]);

  return (
    <div className="absolute top-0 left-0 w-screen bg-white z-50 h-auto shadow-[0_4px_20px_rgba(0,0,0,0.25)]">
      <Container maxWidth="lg">
        <div className="flex flex-col items-center">
          <NavMenuSearchWrapper>
            {isLoading ? (
              <NavMenuGridSkeleton items={4} />
            ) : (
              <div className="grid grid-cols-4 gap-6 w-full py-8">
                {latestDiscountedProducts.map((product: Product) => (
                  <NavMenuProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </NavMenuSearchWrapper>
        </div>
      </Container>
    </div>
  );
};

export default NavMenuOpenDiscounts;
