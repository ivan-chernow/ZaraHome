"use client";
import React, { use, useState } from "react";
import FavoriteButton from "@/components/Button/FavoriteButton";
import VerticalLine from "@/components/ui/VerticalLine";
import Image from "next/image";
import HorizontalLine from "@/components/ui/HorizontalLine";
import OftenBought from "@/components/OftenBought";
import WhyUs from "@/section/WhyUs";
import Help from "@/section/Help";
import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  CircularProgress,
  Container,
} from "@mui/material";
import Color from "@/components/Color";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setActiveColor } from "@/store/features/catalog/productCard.slice";
import HomeIcon from "@/components/ui/HomeIcon";
import MainButton from "@/components/Button/MainButton";
import { useGetCatalogQuery } from "@/api/products.api";
import {
  findProductPathById,
  customSlugify,
} from "@/store/features/catalog/catalog.utils";
import SliderSwiper from "@/components/ui/SliderSwiper";
import Link from "next/link";

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = use(params);
  const { data: categories, isLoading } = useGetCatalogQuery();
  const dispatch = useDispatch();
  const activeColors = useSelector(
    (state: RootState) => state.productCard.activeColors
  );

  console.log("Resolved params:", resolvedParams);
  console.log("Categories data:", categories);
  console.log("Product ID being searched:", resolvedParams.id);

  const pathData = findProductPathById(categories, resolvedParams.id);

  console.log("Path data found:", pathData);

  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    pathData?.product.size ? Object.keys(pathData.product.size)[0] : undefined
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (!pathData) {
    return (
      <div>
        <h3 className="font-light text-[32px] mb-[1px]">Товар не найден</h3>
      </div>
    );
  }

  const { product, category, subCategory, type } = pathData;
  const activeColor = activeColors[product.id];

  if (selectedSize === undefined && product.size) {
    setSelectedSize(Object.keys(product.size)[0]);
  }

  const handleSizeChange = (event: SelectChangeEvent<string>) =>
    setSelectedSize(event.target.value);
  const handleColorClick = (color: string) =>
    dispatch(setActiveColor({ productId: product.id, color }));
  const getPriceBySize = (sizeKey: string) =>
    product.size?.[sizeKey]?.price || 0;
  const getSizeName = (sizeKey: string) =>
    product.size?.[sizeKey]?.size || sizeKey;

  const categorySlug = customSlugify(category.name);
  const subCategorySlug = customSlugify(subCategory.name);
  const typeSlug = type ? customSlugify(type.name) : "";

  return (
    <div className="flex flex-col ml-[10px]">
      <div className="flex items-center mb-[39px] text-[14px] text-[#0000004D] flex-wrap">
        <Link href="/" className="flex items-center hover:underline">
          <HomeIcon />
        </Link>
        <span className="mx-1">{">"}</span>
        <Link href="/products" className="hover:underline">
          Каталог товаров
        </Link>
        <span className="mx-1">{">"}</span>
        <Link
          href={`/products/category/${categorySlug}`}
          className="hover:underline"
        >
          {category.name}
        </Link>
        {subCategory.name && (
          <>
            <span className="mx-1">{">"}</span>
            <Link
              href={`/products/category/${categorySlug}/${subCategorySlug}`}
              className="hover:underline"
            >
              {subCategory.name}
            </Link>
          </>
        )}
        {type && type.name && (
          <>
            <span className="mx-1">{">"}</span>
            <Link
              href={`/products/category/${categorySlug}/${subCategorySlug}/${typeSlug}`}
              className="hover:underline"
            >
              {type.name}
            </Link>
          </>
        )}
        <span className="mx-1">{">"}</span>
        <span className="text-[#00000099] underline font-medium">
          {product.name_ru}
        </span>
      </div>
      <h3 className="font-light text-[42px] mb-[1px]">{product.name_eng}</h3>
      <p className="mb-[46px] font-medium text-[18px] text-[#00000080]">
        {product.name_ru}
      </p>
      <div className="flex justify-between ">
        <div className="w-[470px] shrink-0 mr-[15px]">
          <SliderSwiper
            product={product}
            isHovered={false}
            quantity={product.img.length}
            width={470}
            height={479}
          />
        </div>
        <div className="flex flex-col max-w-[440px]">
          <p className="font-light mb-[11px]">Выберите цвет</p>
          <div className="mb-[24px] flex flex-row ">
            {Object.keys(product.colors).map((color) => (
              <Color
                key={color}
                color={product.colors[color as keyof typeof product.colors]}
                isActive={activeColor === color}
                onClick={() => handleColorClick(color)}
                display="opacity-100"
              />
            ))}
          </div>
          <p className="font-light mb-[12px]">Выберите размер</p>
          <FormControl fullWidth>
            <Select
              value={selectedSize || ""}
              onChange={handleSizeChange}
              renderValue={(selected) => {
                if (!selected) return null;
                const price = getPriceBySize(selected as string);
                const sizeName = getSizeName(selected as string);
                return (
                  <div className="relative w-full h-full flex items-center font-medium font-ysabeau text-[25px]">
                    <div className="font-medium font-ysabeau text-[16px] flex-1">
                      {sizeName}
                    </div>
                    <div className="font-medium font-roboto text-[22px] z-10 flex items-center mr-[32px]">
                      {price.toLocaleString("ru-RU")}{" "}
                      <span className="font-bold font-ysabeau text-[20px] ml-1">
                        ₽
                      </span>
                    </div>
                    <div className="absolute right-[22px] w-px bg-[#0000001A] h-100 "></div>
                  </div>
                );
              }}
              sx={{
                fontSize: "18px",
                fontWeight: "500",
                fontFamily: "Ysabeau",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                "& .MuiSelect-icon": {
                  fontSize: 27,
                  right: 18,
                },
              }}
            >
              {product.size &&
                Object.keys(product.size).map((sizeKey) => {
                  const price = getPriceBySize(sizeKey);
                  const sizeName = getSizeName(sizeKey);
                  return (
                    <MenuItem
                      key={sizeKey}
                      value={sizeKey}
                      sx={{
                        fontSize: "16px",
                        fontWeight: "500",
                        fontFamily: "Ysabeau SC",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      {sizeName}
                      <span
                        className="font-medium text-[22px] font-roboto"
                        style={{ marginLeft: 12 }}
                      >
                        {price.toLocaleString("ru-RU")}{" "}
                        <span className="font-bold text-[20px] font-ysabeau">
                          ₽
                        </span>
                      </span>
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>
          <div className="flex items-center mt-[35px]">
            <div className="mr-4">
              <FavoriteButton productId={product.id} />
            </div>
            <MainButton
              text="ДОБАВИТЬ В КОРЗИНУ"
              disabled={false}
              onClick={() => {}}
              type="button"
              height="56px"
              width="400px"
            />
          </div>
          <div className="flex items-center mb-[30px] mt-[23px]">
            <Image
              src="/assets/img/delivery.svg"
              alt="delivery"
              width={24}
              height={22}
              className="mr-[16px]"
            />
            <VerticalLine height="35px" />
            <div className="flex flex-col ml-[16px]">
              <p className="font-medium text-[#00000080]">
                Ориентировочная дата доставки:
              </p>
              <p className="font-semibold text-[24px]">
                {product.deliveryDate}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Container maxWidth="md">
        <div className="my-12">
          <HorizontalLine width="100%" />
          <p className="font-light mt-8 text-lg text-center">
            {product.description}
          </p>
        </div>
        <OftenBought />
        <WhyUs />
        <Help title="Вам необходима наша помощь?" style="flex-start" />
      </Container>
    </div>
  );
};

export default Page;
