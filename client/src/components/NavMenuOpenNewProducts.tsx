"use client";

import { useMemo } from "react";
import { Container } from "@mui/material";
import { useGetCatalogQuery } from "@/api/products.api";
import { getAllProducts } from "@/store/features/catalog/catalog.utils";
import type { Product } from "@/api/products.api";
import NavMenuProductCard from "./NavMenuProductCard";
import NavMenuSearchWrapper from "./NavMenuSearchWrapper";

const NavMenuOpenNewProducts = () => {
  const { data: categories } = useGetCatalogQuery();

  const latestNewProducts: Product[] = useMemo(() => {
    if (!categories) return [];
    const allNewProducts = getAllProducts(categories)
      .filter((p) => p.isNew)
      .sort(
        (a, b) =>
          new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
      );

    for (let i = allNewProducts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allNewProducts[i], allNewProducts[j]] = [
        allNewProducts[j],
        allNewProducts[i],
      ];
    }

    return allNewProducts.slice(0, 4);
  }, [categories]);

  return (
    <div className="absolute top-0 left-0 w-screen bg-white z-50 h-auto shadow-[0_4px_20px_rgba(0,0,0,0.25)]">
      <Container maxWidth="lg">
        <div className="flex flex-col items-center">
          <NavMenuSearchWrapper alwaysShowChildren={true}>
            <div className="grid grid-cols-4 gap-6 w-full py-8">
              {latestNewProducts.map((product) => (
                <NavMenuProductCard key={product.id} product={product} />
              ))}
            </div>
          </NavMenuSearchWrapper>
        </div>
      </Container>
    </div>
  );
};

export default NavMenuOpenNewProducts;
