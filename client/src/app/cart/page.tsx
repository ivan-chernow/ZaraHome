"use client";

import React, { useEffect, useState } from "react";
import MainLayout from "@/widgets/layout/MainLayout";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import Container from "@mui/material/Container";
import MainButton from "@/shared/ui/Button/MainButton";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
  selectCartItems,
  selectCartTotalCount,
  selectCartTotalPrice,
} from "@/entities/cart/model/cartItems.slice";
import CartPageItem from "@/entities/cart/ui/CartPageItem";
import { useGetProductsByIdsQuery, type Product } from "@/entities/product/api/products.api";
import HorizontalLine from "@/shared/ui/HorizontalLine";
import Link from "next/link";

const Page = () => {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const cartItems = useSelector(selectCartItems);
  const totalCount = useSelector(selectCartTotalCount);
  const totalPrice = useSelector(selectCartTotalPrice);

  // Быстрый запрос названий товаров по id, чтобы сразу показать имена без skeleton
  const ids = cartItems.map((i) => i.id);
  const { data: productsByIds } = useGetProductsByIdsQuery(ids, {
    skip: !mounted || ids.length === 0,
  });

  const idToProduct: Record<number, Product> = (productsByIds || []).reduce(
    (acc, p) => {
      acc[p.id] = p;
      return acc;
    },
    {} as Record<number, Product>
  );

  return (
    <MainLayout>
      <section className="pb-[101px] pt-[45px]">
        <Container maxWidth="lg">
          <div className="flex items-center mb-[31px]">
            <Link href="/">
              <HomeOutlinedIcon
                fontSize="small"
                className="cursor-pointer hover:opacity-80 transition"
              />
            </Link>
            <span className="text-[#00000099] ml-[4px] mr-[6px]">&gt;</span>
            <span className="text-[14px] font-medium text-[#00000099] underline">
              Корзина
            </span>
          </div>

          <h3 className="text-[42px] font-light mb-[30px]">В вашей корзине</h3>

          <div className="flex items-start justify-between gap-6">
            <ul className="flex flex-col w-[720px]">
              {!mounted ? (
                Array.from({ length: 3 }).map((_, idx) => (
                  <React.Fragment key={idx}>
                    <HorizontalLine width="720px" />
                    <li className="flex items-start gap-4 py-6">
                      <div className="w-24 h-24 bg-gray-200 animate-pulse rounded" />
                      <div className="flex-1 space-y-3">
                        <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded" />
                        <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded" />
                      </div>
                    </li>
                    {idx === 2 && <HorizontalLine width="720px" />}
                  </React.Fragment>
                ))
              ) : cartItems.length === 0 ? (
                <li className="text-[#00000080] py-10">Ваша корзина пуста</li>
              ) : (
                cartItems.map((item, idx) => (
                  <React.Fragment key={item.id}>
                    <HorizontalLine width="720px" />
                    <CartPageItem item={item} product={idToProduct[item.id]} />
                    {idx === cartItems.length - 1 && (
                      <HorizontalLine width="720px" />
                    )}
                  </React.Fragment>
                ))
              )}
            </ul>

            <div className="flex flex-col w-[413px] min-h-[215px] drop-shadow-lg items-center justify-center bg-white p-6">
              <div className="mb-[8px] flex items-center justify-center w-full">
                <div className="h-px bg-[#E5E5E5] flex-1" />
                <p className="font-medium text-[#0000004D] mx-[10px]">Итого</p>
                <div className="h-px bg-[#E5E5E5] flex-1" />
              </div>

              {!mounted ? (
                <>
                  <div className="h-8 w-40 bg-gray-200 animate-pulse rounded mb-4" />
                  <div className="h-5 w-24 bg-gray-200 animate-pulse rounded mb-6" />
                  <div className="h-14 w-[358px] bg-gray-200 animate-pulse rounded" />
                </>
              ) : (
                <>
                  <p className="font-medium text-[32px] font-inter">
                    {totalPrice.toLocaleString("ru-RU")}{" "}
                    <span className="text-[24px] font-bold">₽</span>
                  </p>
                  <p className="font-medium mb-[28px]">
                    {totalCount}{" "}
                    {totalCount === 1
                      ? "товар"
                      : totalCount >= 2 && totalCount <= 4
                      ? "товара"
                      : "товаров"}
                  </p>
                  <div>
                    <MainButton
                      text="Перейти к оформлению"
                      disabled={cartItems.length === 0}
                      type="button"
                      onClick={() => router.push("/order")}
                      width="358px"
                      height="56px"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </Container>
      </section>
    </MainLayout>
  );
};

export default Page;
