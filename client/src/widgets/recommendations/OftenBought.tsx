import React, { useMemo } from "react";
import Container from "@mui/material/Container";
import ProductCard from "@/entities/product/ui/ProductCard";
import { useGetCatalogQuery } from "@/entities/product/api/products.api";
import { getAllProducts } from "@/entities/category/lib/catalog.utils";
import CircularProgress from "@mui/material/CircularProgress";

const OftenBought: React.FC = () => {
  const { data: categories, isLoading, error } = useGetCatalogQuery();

  const randomProducts = useMemo(() => {
    if (!categories) return [];

    const allProducts = getAllProducts(categories);

    // Алгоритм тасования Фишера-Йейтса
    for (let i = allProducts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allProducts[i], allProducts[j]] = [allProducts[j], allProducts[i]];
    }

    return allProducts.slice(0, 3);
  }, [categories]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <CircularProgress />
      </div>
    );
  }

  if (error || !randomProducts.length) {
    return null; // или можно отобразить сообщение об ошибке
  }

  return (
    <section className="mt-[40px]">
      <Container maxWidth="lg">
        <h2 className="mb-[47px] font-light text-[42px] text-right">
          Часто с этим товаром покупают
        </h2>
        <ul className="flex  items-center justify-center mb-[60px]">
          {randomProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              cartButtonSize="small"
            />
          ))}
        </ul>
      </Container>
    </section>
  );
};

export default OftenBought;
