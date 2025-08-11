"use client";
import React, { useMemo, useState, useCallback, useEffect } from "react";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import Container from "@mui/material/Container";
import MainLayout from "@/layout/MainLayout";
import HorizontalLine from "@/components/ui/HorizontalLine";
import { IconButton, TextField } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import ClearIcon from "@mui/icons-material/Clear";
import MainButton from "@/components/Button/MainButton";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { openModalAuth, setView } from "@/store/features/auth/auth.slice";
import {
  selectCartItems,
  selectCartTotalPrice,
  CartItem,
} from "@/store/features/cart/cartItems.slice";
import { useApplyPromocodeMutation } from "@/api/promocodes.api";
import { Alert } from "@mui/material";
import DeliveryAddress from "@/section/DeliveryAddress";

const Page = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const { selectedAddress } = useSelector((state: RootState) => state.delivery);
  const cartItems = useSelector(
    (state: RootState) => selectCartItems(state) as CartItem[]
  );
  const cartTotal = useSelector(
    (state: RootState) => selectCartTotalPrice(state) as number
  );

  const totalCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const handleLoginClick = () => {
    dispatch(setView("login"));
    dispatch(openModalAuth());
  };

  const handleRegisterClick = () => {
    dispatch(setView("signup"));
    dispatch(openModalAuth());
  };

  const isCartEmpty = cartItems.length === 0;

  // Промокод
  const [promo, setPromo] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<'card'>("card");
  const [applyPromocode, { isLoading: isApplying }] =
    useApplyPromocodeMutation();
  const [promoError, setPromoError] = useState<string | null>(null);
  const [applied, setApplied] = useState<null | {
    code: string;
    discount: number;
    finalAmount: number;
  }>(null);

  const clearPromo = useCallback(() => {
    setPromo("");
    setPromoError(null);
    setApplied(null);
  }, []);

  const handleApplyPromo = useCallback(async () => {
    setPromoError(null);
    setApplied(null);
    const code = promo.trim();
    if (!code) {
      setPromoError("Введите промокод");
      return;
    }
    try {
      const res = await applyPromocode({
        code,
        orderAmount: cartTotal,
      }).unwrap();
      if (!res.isValid) {
        setPromoError(res.message || "Промокод недействителен");
        return;
      }
      setApplied({
        code,
        discount: res.discount,
        finalAmount: res.finalAmount,
      });
    } catch (e: any) {
      const msg = e?.data?.message || "Промокод недействителен";
      setPromoError(msg);
    }
  }, [promo, cartTotal, applyPromocode]);

  // Адреса доставки
  // DeliveryAddress компонент сам загружает адреса и синхронизирует выбранный адрес с Redux

  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ pt: "45px" }}>
        <div className="flex items-center mb-[31px]">
          <Link href="/" aria-label="На главную" className="flex items-center">
            <HomeOutlinedIcon fontSize="small" sx={{ color: "gray" }} />
          </Link>
          <span className="text-[#00000099] ml-[4px] mr-[6px]">{">"}</span>
          <Link
            href="/cart"
            className="text-[14px] font-medium text-[#00000099] hover:text-black transition-colors duration-200 ease-in"
          >
            Корзина
          </Link>
          <span className="text-[#00000099] ml-[4px] mr-[6px]">{">"}</span>
          <span className="text-[14px] font-medium text-[#00000099] underline">
            Оформление заказа
          </span>
        </div>
        <p className="font-light text-[42px] mb-[32px]">Оформление заказа</p>

        {mounted && !isAuthenticated ? (
          <div className="bg-white drop-shadow-lg p-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="text-sm text-[#00000099]">
              Для оформления заказа нужно войти в аккаунт. Если у вас нет
              аккаунта, пожалуйста, зарегистрируйтесь.
            </div>
            <div className="flex items-center gap-3">
              <MainButton
                text="Войти"
                type="button"
                width="160px"
                height="44px"
                disabled={false}
                onClick={handleLoginClick}
              />
              <MainButton
                text="Зарегистрироваться"
                type="button"
                width="220px"
                height="44px"
                disabled={false}
                onClick={handleRegisterClick}
              />
            </div>
          </div>
        ) : null}

        {mounted && isAuthenticated && (
          <div className="flex items-center justify-between mb-[89px]">
            <div className="mb-[19px] ">
              <DeliveryAddress hideHeader hideLimitInfo compact />
              <div className="flex items-center mt-0 mb-0">
                <p className="font-medium text-[#0000004D] mr-[5px] mb-0">
                  Способ оплаты
                </p>
                <HorizontalLine width="615px" />
              </div>
              <div
                className="bg-white drop-shadow-lg flex items-center justify-between h-[74px] px-[30px] cursor-pointer"
                onClick={() => setPaymentMethod('card')}
              >
                <div className="flex items-center">
                  <div className="mr-[29px] bg-white w-[20px] h-[20px] rounded-full drop-shadow-lg relative flex items-center justify-center">
                    <span
                      className={`rounded-full w-[12px] h-[12px] transition-colors duration-300 ${
                        paymentMethod === 'card' ? 'bg-black' : 'bg-gray-300'
                      }`}
                    ></span>
                  </div>
                  <div className="flex flex-col">
                    <p className="font-semibold mb-[4px]">
                      Картами российких банков
                    </p>
                    <p className=" text-[#00000080] text-[14px]">
                      Без комиссий и прочей лабуды!
                    </p>
                  </div>
                </div>
                <Image
                  src="/assets/img/Order/mir.svg"
                  alt="img"
                  width={104}
                  height={31}
                />
              </div>
            </div>

            {isAuthenticated && (
              <div className="flex flex-col w-[413px] h-auto drop-shadow-lg items-center justify-start bg-white py-[22px]">
                <div className="mb-[16px] flex items-center justify-center">
                  <HorizontalLine width="141px" />
                  <p className="font-medium text-[#0000004D] mx-[10px]">
                    Промокод
                  </p>
                  <HorizontalLine width="146px" />
                </div>
                {!!promoError && (
                  <div className="w-full mb-2">
                    <Alert severity="error">{promoError}</Alert>
                  </div>
                )}
                <TextField
                  value={promo}
                  onChange={(e) => setPromo(e.target.value.toUpperCase())}
                  placeholder="Введите промокод"
                  disabled={!!applied || isApplying}
                  sx={{ width: "359px", height: "48px" }}
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        edge="end"
                        size="small"
                        onClick={clearPromo}
                        aria-label="Очистить промокод"
                        disabled={!!applied || isApplying}
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    ),
                  }}
                />
                <div className="mt-[18px]">
                  <MainButton
                    text={applied ? "Промокод применён" : "Применить промокод"}
                    disabled={!!applied || isApplying}
                    type="button"
                    width="359px"
                    height="42px"
                    onClick={handleApplyPromo}
                  />
                </div>
                <div className="mb-[10px] flex items-center justify-center mt-[25px]">
                  <HorizontalLine width="141px" />
                  <p className="font-medium text-[#0000004D] mx-[10px]">
                    Ваша скидка
                  </p>
                  <HorizontalLine width="146px" />
                </div>
                <p className="font-roboto font-medium text-[32px] text-[#C26B6B] mb-[10px]">
                  {(applied ? applied.discount : 0).toLocaleString("ru-RU")}{" "}
                  <span className="font-ysabeau font-bold text-[24px]">₽</span>
                </p>
                <div className="mb-[10px] flex items-center justify-center ">
                  <HorizontalLine width="141px" />
                  <p className="font-medium text-[#0000004D] mx-[10px]">
                    Итого
                  </p>
                  <HorizontalLine width="146px" />
                </div>
                <p className="font-medium text-[32px] font-roboto">
                  {(applied ? applied.finalAmount : cartTotal).toLocaleString(
                    "ru-RU"
                  )}
                </p>
                <p className="font-medium mb-[28px]">{totalCount} товаров</p>
                <MainButton
                  text="Оплатить"
                  disabled={isCartEmpty}
                  type="button"
                  width="358px"
                  height="56px"
                />
              </div>
            )}
          </div>
        )}
      </Container>
    </MainLayout>
  );
};

export default Page;
