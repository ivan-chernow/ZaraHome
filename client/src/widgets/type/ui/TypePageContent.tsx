'use client';
import React, { use } from 'react';
import ProductCard from '@/entities/product/ui/ProductCard';
import HomeIcon from '@/shared/ui/HomeIcon';
import { useGetCatalogQuery } from '@/entities/product/api/products.api';
import slugify from 'slugify';
import Link from 'next/link';
import { getProductsByType } from '@/entities/category/lib/catalog.utils';
import { useSorting } from '@/shared/lib/hooks/useSorting';
import SortButtons from '@/shared/ui/SortButtons';
import { ProductCardSkeleton } from '@/entities/product/ui/ProductCardSceleton';

interface TypePageContentProps {
  params: Promise<{ category: string; subCategory: string; type: string }>;
}

export const TypePageContent: React.FC<TypePageContentProps> = ({ params }) => {
  const {
    category: categorySlug,
    subCategory: subCategorySlug,
    type: typeSlug,
  } = use(params);
  const { data: categories } = useGetCatalogQuery();

  const customSlugify = (text: string) =>
    slugify(text.replace(/й/g, 'y').replace(/и$/g, 'i'), {
      lower: true,
      strict: true,
    });

  const currentCategory = categories?.find(
    cat => customSlugify(cat.name) === categorySlug
  );
  const currentSubCategory = currentCategory
    ? currentCategory.subCategories.find(
        subCat => customSlugify(subCat.name) === subCategorySlug
      )
    : undefined;
  const currentType = currentSubCategory
    ? currentSubCategory.types.find(
        type => customSlugify(type.name) === typeSlug
      )
    : undefined;

  const baseProducts = getProductsByType(currentType);

  // Используем хук сортировки
  const {
    sortType,
    sortedProducts: products,
    handleSortByPrice,
    handleSortByDate,
  } = useSorting({
    products: baseProducts,
  });

  const categoryName = currentCategory
    ? currentCategory.name
    : decodeURIComponent(categorySlug);
  const subCategoryName = currentSubCategory
    ? currentSubCategory.name
    : decodeURIComponent(subCategorySlug);
  const typeName = currentType
    ? currentType.name
    : decodeURIComponent(typeSlug);

  return (
    <div className="flex flex-col flex-1 pl-0">
      <div className="flex items-center mb-[39px]">
        <HomeIcon />
        <span className="mx-[6px] text-[#0000004D]">{' > '}</span>
        <Link
          href={`/products/category/${categorySlug}`}
          className="text-[#00000099] text-[14px] font-medium hover:underline"
        >
          {categoryName}
        </Link>
        <span className="mx-[6px] text-[#0000004D]">{' > '}</span>
        <Link
          href={`/products/category/${categorySlug}/${subCategorySlug}`}
          className="text-[#00000099] text-[14px] font-medium hover:underline"
        >
          {subCategoryName}
        </Link>
        <span className="mx-[6px] text-[#0000004D]">{' > '}</span>
        <span className="text-[#00000099] text-[14px] underline font-medium">
          {typeName}
        </span>
      </div>
      <div className="flex flex-col mb-[60px] w-full">
        <h3 className="font-light text-[42px]">{typeName}</h3>
        <SortButtons
          sortType={sortType}
          onSortByPrice={handleSortByPrice}
          onSortByDate={handleSortByDate}
          className="mt-[53px]"
        />
      </div>
      <div className="w-full min-h-[300px] flex items-center justify-center">
        {!categories ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
            {Array.from({ length: 9 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </ul>
        ) : products && products.length > 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
            {products.map(product => (
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

export default TypePageContent;
