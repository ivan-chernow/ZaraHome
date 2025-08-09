"use client";

import React from "react";
import MainLayout from "@/layout/MainLayout";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import Container from "@mui/material/Container";
import MainButton from "@/components/Button/MainButton";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
  selectCartItems,
  selectCartTotalCount,
  selectCartTotalPrice,
} from "@/store/features/cart/cartItems.slice";
import CartPageItem from "@/components/Cart/CartPageItem";
import HorizontalLine from "@/components/ui/HorizontalLine";

const Page = () => {
  const router = useRouter();

  const cartItems = useSelector(selectCartItems);
  const totalCount = useSelector(selectCartTotalCount);
  const totalPrice = useSelector(selectCartTotalPrice);

  return (
    <MainLayout>
      <section className="pb-[101px] pt-[45px]">
        <Container maxWidth="lg">
          <div className="flex items-center mb-[31px]">
            <HomeOutlinedIcon fontSize="small" />
            <span className="text-[#00000099] ml-[4px] mr-[6px]">&gt;</span>
            <span className="text-[14px] font-medium text-[#00000099] underline">
              Корзина
            </span>
          </div>

          <h3 className="text-[42px] font-light mb-[30px]">В вашей корзине</h3>

          <div className="flex items-start justify-between gap-6">
            <ul className="flex flex-col w-[720px]">
              {cartItems.length === 0 ? (
                <li className="text-[#00000080] py-10">Ваша корзина пуста</li>
              ) : (
                cartItems.map((item, idx) => (
                  <React.Fragment key={item.id}>
                    <HorizontalLine width="720px" />
                    <CartPageItem item={item} />
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
            </div>
          </div>
        </Container>
      </section>
    </MainLayout>
  );
};

export default Page;
