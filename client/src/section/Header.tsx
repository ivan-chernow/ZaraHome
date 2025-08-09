"use client";

import React, { useRef } from "react";
import Image from "next/image";
import VerticalLine from "@/components/ui/VerticalLine";
import Container from "@mui/material/Container";
import Logo from "@/components/ui/Logo";
import CartDetails from "@/components/Cart/cartDetails";
import Link from "next/link";
import { AppDispatch, RootState } from "@/store/store";
import { toggleCart } from "@/store/features/cart/cart.slice";
import { useSelector, useDispatch } from "react-redux";
import {
  openModalAuth,
  setView,
  logout,
} from "@/store/features/auth/auth.slice";
import { usePathname } from "next/navigation";
import {
  selectCartTotalCount,
  selectCartTotalPrice,
} from "@/store/features/cart/cartItems.slice";

const Header = () => {
  const pathname = usePathname();
  const dispatch: AppDispatch = useDispatch();
  const { isOpenCart } = useSelector((state: RootState) => state.cart);
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const cartButtonRef = useRef<HTMLDivElement>(null);
  const totalCount = useSelector((state: RootState) =>
    selectCartTotalCount(state)
  );
  const totalPrice = useSelector((state: RootState) =>
    selectCartTotalPrice(state)
  );

  const isProfilePage = pathname?.startsWith("/profile");

  const handleUserIconClick = () => {
    if (isProfilePage) {
      // Если мы в профиле, выполняем выход
      dispatch(logout());
      window.location.href = "/";
    } else if (isAuthenticated && user) {
      // Если пользователь авторизован, перенаправляем в личный кабинет
      const path = user.role === "admin" ? "/profile/admin" : "/profile";
      window.location.href = path;
    } else {
      // Если не авторизован, открываем модальное окно входа
      dispatch(openModalAuth());
      dispatch(setView("login"));
    }
  };

  return (
    <header className="bg-white drop-shadow-md py-[20px] px-[5px] relative ">
      <Container maxWidth="lg" className="flex items-center justify-between">
        <div className="inline-block">
          <Link
            href="https://wa.me/78001236543"
            className="font-inter text-[20px] hover:text-[#00000080] transition-colors duration-200 ease-in"
            target="_blank"
          >
            8 (800) 123 65 43 <span className="text-green-400">(WhatsApp)</span>
          </Link>
          <p className="font-ysabeau text-[#00000080] text-[16px]">
            Работаем сегодня с 9:00 до 20:00
          </p>
        </div>
        <Logo />
        <div className="flex items-center">
          <VerticalLine height="57px" />
          <Image
            src={
              isProfilePage
                ? "/assets/img/Header/logout.svg"
                : "/assets/img/Header/user.svg"
            }
            alt={isProfilePage ? "Выйти" : "Войти"}
            width={19}
            height={20}
            className="mx-[22px] cursor-pointer hover:scale-120 duration-200 ease-in"
            onClick={handleUserIconClick}
          />
          <VerticalLine height="57px" />
          <Link href="/favorite">
            <Image
              src="/assets/img/Header/favorite.svg"
              alt="Logo"
              width={22}
              height={20}
              className="mx-[22px] cursor-pointer  hover:scale-120 duration-200 ease-in"
            />
          </Link>
          <VerticalLine height="57px" />
          <div
            ref={cartButtonRef}
            className="flex items-center mx-7 cursor-pointer "
            onClick={() => dispatch(toggleCart())}
          >
            <div className="relative hover:scale-110 duration-200 ease-in">
              <Image
                src="/assets/img/Header/cart.svg"
                alt="Корзина"
                width={25}
                height={25}
              />
              <div className="absolute -top-2 -right-2 flex items-center justify-center">
                <div className="absolute border-2 border-black rounded-full w-5 h-5"></div>
                <span className="relative text-black text-[14px] font-bold">
                  {totalCount}
                </span>
              </div>
            </div>
            <p className="ml-[16px] font-roboto font-medium">{totalPrice}₽</p>
          </div>
          <VerticalLine height="57px" />
        </div>
        {isOpenCart && <CartDetails cartButtonRef={cartButtonRef} />}
      </Container>
    </header>
  );
};

export default Header;
