"use client";
import React, { use } from "react";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import HomeIcon from "@/components/ui/HomeIcon";
import { Product, useGetCatalogQuery } from "@/api/products.api";
import { getProductsByCategory } from "@/store/features/catalog/catalog.utils";
import CircularProgress from "@mui/material/CircularProgress";
import slugify from "slugify";
import { getAllProducts } from "@/store/features/catalog/catalog.utils";

const Page = ({ params }: { params: Promise<{ category: string }> }) => {
  const { category: categorySlug } = use(params);
  const { data: categories, isLoading } = useGetCatalogQuery();

  if (isLoading || !categories) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[500px]">
        <CircularProgress />
      </div>
    );
  }

  const customSlugify = (text: string) =>
    slugify(text.replace("й", "y"), { lower: true, strict: true });

  let products: Product[] = [];

  if (categorySlug === "novinki") {
    // Виртуальная категория "Новинки"
    products = getAllProducts(categories).filter((p) => p.isNew);
  } else if (categorySlug === "skidki") {
    // Виртуальная категория "Скидки"
    products = getAllProducts(categories).filter((p) => Number(p.discount) > 0);
  } else {
    // Обычная категория
    const currentCategory = categories?.find(
      (cat) => customSlugify(cat.name) === categorySlug
    );
    products = getProductsByCategory(currentCategory);
  }

  const categoryName =
    categories?.find((cat) => customSlugify(cat.name) === categorySlug)?.name ||
    decodeURIComponent(categorySlug);

  return (
    <div className="flex flex-col flex-1 pl-0">
      <div className="flex items-center mb-[39px]">
        <HomeIcon />
        <span className="mx-[6px] text-[#0000004D]">{">"}</span>
        <span className="text-[#00000099] text-[14px] underline font-medium">
          {categoryName}
        </span>
      </div>

      {/* Заголовок категории и сортировка + иконки справа */}
      <div className="flex flex-col mb-[60px] w-full">
        <h3 className="font-light text-[42px]">{categoryName}</h3>
        <div className="flex items-center justify-end mt-[53px]">
          <div
            className={`flex items-center mr-[12px] cursor-pointer transition-all ease-in-out duration-300 hover:underline `}
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
          </div>
          <div
            className={`flex items-center cursor-pointer transition-all ease-in-out duration-300 hover:underline `}
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
          </div>
        </div>
      </div>

      <div className="w-full min-h-[300px] flex items-center justify-center">
        {!categories ? (
          <CircularProgress />
        ) : products && products.length > 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ul>
        ) : (
          <p className="text-center text-lg">Товаров нет</p>
        )}
      </div>
    </div>
  );
};

export default Page;
