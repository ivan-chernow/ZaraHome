"use client";
import React, { use, useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import HomeIcon from "@/components/ui/HomeIcon";
import { useGetCatalogQuery } from "@/api/products.api";
import { getProductsByCategory } from "@/store/features/catalog/catalog.utils";
import CircularProgress from "@mui/material/CircularProgress";
import Pagination from "@mui/material/Pagination";
import slugify from "slugify";
import { getAllProducts } from "@/store/features/catalog/catalog.utils";
import { useRouter, useSearchParams } from "next/navigation";

const PAGE_SIZE = 12;

const Page = ({ params }: { params: Promise<{ category: string }> }) => {
  const { category: categorySlug } = use(params);
  const { data: categories, isLoading, error } = useGetCatalogQuery();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Получаем текущую страницу из query-параметра
  const initialPage = Number(searchParams.get("page")) || 1;
  const [page, setPage] = useState(initialPage);
  const prevCategory = useRef<string | undefined>(undefined);

  useEffect(() => {
    setPage(Number(searchParams.get("page")) || 1);
  }, [searchParams]);

  // Сброс страницы только если категория реально меняется
  useEffect(() => {
    if (prevCategory.current && prevCategory.current !== categorySlug) {
      setPage(1);
      router.push("?page=1", { scroll: false });
    }
    prevCategory.current = categorySlug;
  }, [categorySlug, router]);

  const customSlugify = (text: string) =>
    slugify(text.replace("й", "y"), { lower: true, strict: true });

  const products = useMemo(() => {
    if (!categories) return [];
    if (categorySlug === "novinki") {
      return getAllProducts(categories).filter((p) => p.isNew);
    } else if (categorySlug === "skidki") {
      return getAllProducts(categories).filter((p) => Number(p.discount) > 0);
    } else {
      const currentCategory = categories.find(
        (cat) => customSlugify(cat.name) === categorySlug
      );
      return getProductsByCategory(currentCategory);
    }
  }, [categories, categorySlug]);

  const totalPages = useMemo(
    () => Math.ceil(products.length / PAGE_SIZE),
    [products]
  );
  const paginatedProducts = useMemo(
    () => products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [products, page]
  );

  const categoryName = useMemo(() => {
    if (!categories) return decodeURIComponent(categorySlug);
    const found = categories.find(
      (cat) => customSlugify(cat.name) === categorySlug
    );
    return found ? found.name : decodeURIComponent(categorySlug);
  }, [categories, categorySlug]);

  const handlePageChange = (_: any, value: number) => {
    setPage(value);
    router.push(`?page=${value}`, { scroll: false });
    // Скроллим к началу списка
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[500px]">
        <CircularProgress />
      </div>
    );
  }

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
        {paginatedProducts && paginatedProducts.length > 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
            {paginatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ul>
        ) : (
          <p className="text-center text-lg">Товаров нет</p>
        )}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            siblingCount={1}
            boundaryCount={1}
            sx={{
              "& .MuiPagination-ul": {
                justifyContent: "center",
                gap: "12px",
              },
              "& .MuiButtonBase-root": {
                borderRadius: "12px",
                minWidth: "44px",
                minHeight: "44px",
                fontWeight: 600,
                fontSize: "18px",
                border: "1.5px solid #000",
                color: "#000",
                backgroundColor: "#fff",
                transition: "all 0.2s",
                "&:hover": {
                  backgroundColor: "#000",
                  color: "#fff",
                  borderColor: "#000",
                },
              },
              "& .Mui-selected": {
                backgroundColor: "#000 !important",
                color: "#fff !important",
                borderColor: "#000 !important",
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Page;
