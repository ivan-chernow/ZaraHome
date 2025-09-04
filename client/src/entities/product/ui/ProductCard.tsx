"use client";
import React, { useEffect, useState } from "react";
import CartButton from "@/shared/ui/Button/CartButton";
import Link from "next/link";
import { RootState } from "@/shared/config/store/store";
import { useSelector, useDispatch } from "react-redux";
import { setActiveColor } from "@/entities/favorite/model/productCard.slice";
import SliderSwiper from "../../../shared/ui/SliderSwiper";
import FavoriteButton from "../../../shared/ui/Button/FavoriteButton";
import Color from "../../../shared/ui/Color";
import New from "../../../shared/ui/New";
import { Product } from "@/entities/product/api/products.api";
import Discount from "../../../widgets/discount/Discount";

interface ProductCardProps {
  product: Product;
  cartButtonSize?: "default" | "small";
}

const ProductCard = ({
  product,
  cartButtonSize = "default",
}: ProductCardProps) => {
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);
  const activeColors = useSelector(
    (state: RootState) => state.productCard.activeColors
  );

  useEffect(() => {
    if (product && product.colors && Object.keys(product.colors).length > 0) {
      dispatch(
        setActiveColor({
          productId: product.id,
          color: Object.keys(product.colors)[0],
        })
      );
    }
  }, [product, dispatch]);

  if (!product || !product.colors) return null;

  const activeColor = activeColors[product.id];

  const handleColorClick = (color: string) => {
    dispatch(setActiveColor({ productId: product.id, color }));
  };

  return (
    <li
      className="
      w-[300px] h-[497px]
      mr-[-1px]
      bg-white
      relative
      group
      transition-all
      duration-300
      ease-in-out
      hover:shadow-xl
      overflow-hidden
      hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="mb-[18px] relative overflow-hidden"
        style={{ width: "auto", height: 326, background: "transparent" }}
      >
        <SliderSwiper product={product} isHovered={isHovered} quantity={3} />
        <div
          className={`absolute right-0 bottom-[-2.2px] z-10 transition-all duration-300  ease-in-out ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <FavoriteButton productId={product.id} />
        </div>
      </div>
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-y-1">
        {product.isNew && <New />}
        {Number(product.discount) > 0 && (
          <Discount discount={Number(product.discount)} />
        )}
      </div>

      <div className="flex px-[10px]">
        {Object.entries(product.colors).map(([key, color]) => (
          <Color
            display={isHovered ? "opacity-100" : "opacity-0"}
            color={color}
            key={key}
            onClick={() => handleColorClick(key)}
            isActive={activeColor === key}
          />
        ))}
      </div>

      <Link
        href={`/products/${product.id}`}
        className="
        inline-block
        font-bold
        text-[18px]
        underline
        mb-1
        transition-colors
        duration-200
        group-hover:text-gray-700
        cursor-pointer
        px-[10px]
      "
      >
        {product.name_eng}
      </Link>

      <p
        className="
        font-medium
        text-[#00000080]
        mb-auto
        transition-colors
        duration-200
        group-hover:text-gray-600
        px-[10px]
      "
      >
        {product.name_ru}
      </p>

      <div
        className="
        flex
        justify-between
        mt-4
        px-[10px]
      "
      >
        <p
          className="
          font-medium
          text-[24px]
          font-inter
          flex
          items-baseline
        "
        >
          {Object.values(product.size)[0]?.price?.toLocaleString("ru-RU") ||
            "-"}{" "}
          <span className="font-bold text-[18px] ml-0.5">₽</span>
        </p>

        <CartButton
          size={cartButtonSize}
          productId={product.id}
          price={Object.values(product.size)[0]?.price}
          img={product.img?.[0]}
          selectedSize={Object.keys(product.size)?.[0]}
          selectedColor={activeColor}
        />
      </div>

      <div
        className="
      absolute
      inset-0
      bg-black
      opacity-0
      group-hover:opacity-5
      pointer-events-none
      transition-opacity
      duration-300
    "
      ></div>
    </li>
  );
};

export default ProductCard;
