'use client';
import React, { use, useState } from 'react';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import HomeIcon from '@/components/ui/HomeIcon';
import { useGetCatalogQuery } from '@/api/products.api';
import CircularProgress from '@mui/material/CircularProgress';
import slugify from 'slugify';
import Link from 'next/link';
import { getProductsBySubCategory } from '@/store/features/catalog/catalog.utils';

type SortType = 'price_asc' | 'price_desc' | 'date_desc' | null;

const Page = ({ params }: { params: Promise<{ category: string, subCategory: string }> }) => {
  const { category: categorySlug, subCategory: subCategorySlug } = use(params);
  const { data: categories } = useGetCatalogQuery();
  const [sortType, setSortType] = useState<SortType>(null);

  const customSlugify = (text: string) => slugify(text.replace(/й/g, 'y').replace(/и$/g, 'i'), { lower: true, strict: true });

  const currentCategory = categories?.find(cat => customSlugify(cat.name) === categorySlug);
  const currentSubCategory = currentCategory?.subCategories.find(subCat => customSlugify(subCat.name) === subCategorySlug);
  
  const products = getProductsBySubCategory(currentSubCategory);

  const handleSortClick = (type: SortType) => {
    if (sortType === type) {
      setSortType(null);
    } else {
      setSortType(type);
    }
  };

  const categoryName = currentCategory ? currentCategory.name : decodeURIComponent(categorySlug);
  const subCategoryName = currentSubCategory ? currentSubCategory.name : decodeURIComponent(subCategorySlug);

  return (
    <div className="flex flex-col flex-1 pl-0">
      <div className="flex items-center mb-[39px]">
        <HomeIcon />
        <span className="mx-[6px] text-[#0000004D]">{'>'}</span>
        <Link href={`/products/category/${categorySlug}`} className="text-[#00000099] text-[14px] font-medium hover:underline">
          {categoryName}
        </Link>
        <span className="mx-[6px] text-[#0000004D]">{'>'}</span>
        <span className="text-[#00000099] text-[14px] underline font-medium">
          {subCategoryName}
        </span>
      </div>
      {/* Заголовок категории и сортировка + иконки справа */}
      <div className="flex flex-col mb-[60px] w-full">
        <h3 className="font-light text-[42px]">{subCategoryName}</h3>
        <div className="flex items-center justify-end mt-[53px]">
          <div 
            onClick={() => handleSortClick('price_asc')}
            className={`flex items-center mr-[12px] cursor-pointer transition-all ease-in-out duration-300 hover:underline ${sortType === 'price_asc' ? 'text-blue-600' : ''}`}
          >
            <Image src="/assets/img/Catalog/cheap.png" alt="cheap" width={24} height={24} />
            <p className="text-[14px] font-semibold mr-[3px]">Сначала дешевые</p>
          </div>
          <div 
            onClick={() => handleSortClick('date_desc')}
            className={`flex items-center cursor-pointer transition-all ease-in-out duration-300 hover:underline ${sortType === 'date_desc' ? 'text-blue-600' : ''}`}
          >
            <Image src="/assets/img/Catalog/Time_later.svg" alt="later" width={24} height={24} />
            <p className="text-[14px] font-semibold mr-[5px]">Добавлены позже</p>
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