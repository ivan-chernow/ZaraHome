import React, { useMemo } from "react";
import NewsBlockSection from "@/widgets/news/NewsBlockSection";
import ProductCard from "@/entities/product/ui/ProductCard";
import Container from "@mui/material/Container";
import { useGetCatalogQuery } from "@/entities/product/api/products.api";
import { getAllProducts } from "@/entities/category/lib/catalog.utils";
import slugify from "slugify";
import { ProductCardSkeleton } from "@/entities/product/ui/ProductCardSceleton";

const NewClothes: React.FC = () => {
  const { data: categories, isLoading } = useGetCatalogQuery();

  const allProducts = useMemo(() => {
    if (!categories) return [];
    return getAllProducts(categories);
  }, [categories]);

  const newArrivals = useMemo(() => {
    return allProducts
      .filter((p) => p.isNew)
      .sort(
        (a, b) =>
          new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
      )
      .slice(0, 3);
  }, [allProducts]);

  const discountedItems = useMemo(() => {
    return allProducts
      .filter((p) => p.discount && p.discount > 0)
      .sort(
        (a, b) =>
          new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
      )
      .slice(0, 3);
  }, [allProducts]);

  const customSlugify = (text: string) =>
    slugify(text.replace("й", "y"), { lower: true, strict: true });

  return (
    <section id="new-clothes" data-section="new-clothes" className="relative">
      <NewsBlockSection
        title="Новое поступление"
        subtitle="Коллекции этого сезона"
        btnText="Смотреть все новинки"
        bgImg="/assets/img/New%20Clothes/bg1.png"
        margin="0"
        categorySlug={customSlugify("Новинки")}
      />
      <Container maxWidth="lg">
        <ul className="flex items-center justify-center flex-wrap mt-[50px] ">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            : newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </ul>
      </Container>
      <NewsBlockSection
        title="Скидки до 70%"
        subtitle="На самые популярные товары"
        btnText="Смотреть все скидки"
        bgImg="/assets/img/Discount/bg1.png"
        margin="50px"
        categorySlug={customSlugify("Скидки")}
      />
      <Container maxWidth="lg">
        <ul className="flex items-center justify-center flex-wrap mt-[50px] ">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            : discountedItems.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </ul>
      </Container>
    </section>
  );
};

export default NewClothes;
