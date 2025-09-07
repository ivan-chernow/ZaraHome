"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import Image from "next/image";
import VerticalLine from "@/shared/ui/VerticalLine";
import Logo from "@/shared/ui/Logo";
import CartDetails from "@/entities/cart/ui/cartDetails";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { toggleCart } from "@/entities/cart/model/cart.slice";
import {
  openModalAuth,
  setView,
  logout,
} from "@/features/auth/model/auth.slice";
import { usePathname } from "next/navigation";
import { RootState, AppDispatch } from "@/shared/config/store/store";
import {
  selectCartTotalCount,
  selectCartTotalPrice,
} from "@/entities/cart/model/cartItems.slice";
import { useGetCartQuery } from "@/entities/cart/api/cart.api";
import { setCartItems } from "@/entities/cart/model/cartItems.slice";

const Header: React.FC = () => {
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
  const { data: serverCart, isLoading: isCartLoading } = useGetCartQuery(
    undefined,
    {
      skip: !isAuthenticated,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  );

  useEffect(() => {
    if (isAuthenticated && Array.isArray(serverCart)) {
      const toItems = serverCart.map((p) => ({
        id: p.id,
        price: (() => {
          const sizes = p.size as any;
          const first =
            sizes && typeof sizes === "object"
              ? (Object.values(sizes)[0] as any)
              : null;
          return first && typeof first.price === "number" ? first.price : 0;
        })(),
        quantity: 1,
        img: Array.isArray(p.img) ? p.img[0] : undefined,
      }));
      dispatch(setCartItems(toItems));
    }
  }, [isAuthenticated, serverCart, dispatch]);

  // Избегаем ошибок гидратации: рендерим счетчики только после монтирования на клиенте
  const [mounted, setMounted] = useState(false);

  // На сервере всегда показываем 0, на клиенте читаем из localStorage
  const [initialValues, setInitialValues] = useState({ count: 0, price: 0 });

  useEffect(() => {
    setMounted(true);

    // Читаем значения из localStorage после монтирования
    try {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        const cartItems = JSON.parse(savedCart);
        if (Array.isArray(cartItems) && cartItems.length > 0) {
          const count = cartItems.reduce(
            (sum, item) => sum + (item.quantity || 0),
            0
          );
          const price = cartItems.reduce(
            (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
            0
          );
          setInitialValues({ count, price });
        }
      }
    } catch (error) {
      console.warn("Failed to load cart from localStorage:", error);
    }
  }, []);

  // Мемоизируем значения, чтобы избежать прыжков при обновлении страницы
  const displayCount = useMemo(() => {
    if (mounted) {
      if (totalCount === 0) return 0;
      if (totalCount > 0) return totalCount;
    }
    return initialValues.count;
  }, [mounted, totalCount, initialValues.count]);

  const displayPrice = useMemo(() => {
    if (mounted) {
      if (totalCount === 0) return 0;
      if (totalPrice > 0) return totalPrice;
    }
    return initialValues.price;
  }, [mounted, totalCount, totalPrice, initialValues.price]);

  const isProfilePage = pathname?.startsWith("/profile");
  const isCartOrOrderPage = pathname === "/cart" || pathname === "/order";

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
    <header id="header" data-section="header" className="bg-white drop-shadow-md py-[20px] px-[5px] relative ">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <div className="inline-block">
          <Link
            href="https://wa.me/78001236543"
            className="font-inter text-[20px] hover:text-black transition-colors duration-200 ease-in"
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
            className={`flex items-center mx-7 ${
              isCartOrOrderPage
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer hover:scale-105 hover:text-black duration-200 ease-in"
            }`}
            onClick={() => {
              if (isCartOrOrderPage) return;
              dispatch(toggleCart());
            }}
          >
            <div className="relative duration-200 ease-in">
              <Image
                src="/assets/img/Header/cart.svg"
                alt="Корзина"
                width={25}
                height={25}
              />
              <div className="absolute -top-2 -right-2 w-5 h-5">
                <div
                  className="absolute border-2 border-black rounded-full w-5 h-5 bg-white"
                  style={{ zIndex: 1 }}
                ></div>
                <span
                  className="absolute inset-0 flex items-center justify-center text-black text-[12px] font-bold tabular-nums"
                  style={{ zIndex: 2 }}
                >
                  {!mounted || isCartLoading ? (
                    <span className="animate-pulse bg-gray-200 rounded-full w-5 h-5 block" />
                  ) : (
                    displayCount
                  )}
                </span>
              </div>
            </div>
            <p
              className="ml-[16px] font-roboto font-medium tabular-nums"
              style={{ minWidth: 72, textAlign: "left" }}
            >
              {!mounted || isCartLoading ? (
                <span className="animate-pulse bg-gray-200 rounded w-12 h-5 inline-block" />
              ) : (
                `${displayPrice}₽`
              )}
            </p>
          </div>
          <VerticalLine height="57px" />
        </div>
        {isOpenCart && <CartDetails cartButtonRef={cartButtonRef} />}
      </div>
    </header>
  );
};

export default Header;
