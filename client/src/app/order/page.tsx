"use client";
import React, { useMemo, useState, useCallback } from "react";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import Container from "@mui/material/Container";
import MainLayout from "@/layout/MainLayout";
import HorizontalLine from "@/components/ui/HorizontalLine";
import { IconButton, TextField } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
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
import { useGetDeliveryAddressesQuery } from "@/api/profile.api";
import type { DeliveryAddressDto } from "@/api/types/profile.types";
import { Alert } from "@mui/material";

const Page = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
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
  const { data: addresses = [], isLoading: isAddrLoading } =
    useGetDeliveryAddressesQuery(undefined, {
      skip: !isAuthenticated,
    });
  const primary: DeliveryAddressDto | undefined = addresses[0];
  const secondary: DeliveryAddressDto | undefined = addresses[1];
  const formatFullName = (a: DeliveryAddressDto | undefined) => {
    if (!a) return "";
    return `${a.lastName} ${a.firstName} ${a.patronymic}`.trim();
  };
  const formatAddress = (a: DeliveryAddressDto | undefined) => {
    if (!a) return "";
    const parts: string[] = ["Россия", a.region, a.city];
    const street = a.street ? `ул.${a.street}` : "";
    const house = a.house ? `д.${a.house}` : "";
    const building = a.building ? `корп.${a.building}` : "";
    const apartment = a.apartment ? `кв.${a.apartment}` : "";
    const tail = [street, house, building, apartment]
      .filter(Boolean)
      .join(", ");
    if (tail) parts.push(tail);
    return parts.filter(Boolean).join(", ");
  };

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

        {!isAuthenticated ? (
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

        {isAuthenticated && (
          <div className="flex items-start justify-between mb-[89px]">
            <div className="mb-[19px] ">
              <div className="bg-white  drop-shadow-lg  flex items-center justify-between h-[74px] px-[30px] max-w-[728px]">
                <div className="flex items-center">
                  <div className="bg-white w-[20px] h-[20px] rounded-full drop-shadow-lg mr-[29px] relative flex items-center justify-center">
                    <span className="bg-gray-300 rounded-full w-[12px] h-[12px]"></span>
                  </div>
                  <div className="flex flex-col">
                    <p className="font-semibold mb-[4px]">
                      {isAddrLoading
                        ? "Загрузка..."
                        : formatFullName(primary) || "Адрес не указан"}
                    </p>
                    <p className="text-[14px] text-[#00000080]">
                      {isAddrLoading ? "" : formatAddress(primary)}
                    </p>
                  </div>
                </div>
                <ModeEditOutlinedIcon
                  fontSize="medium"
                  sx={{ color: "gray" }}
                />
              </div>
              <div className="bg-white  drop-shadow-lg  flex items-center justify-between h-[74px] px-[30px] mt-[10px] mb-[42px] max-w-[728px]">
                <div className="flex items-center">
                  <div className="mr-[29px] bg-white w-[20px] h-[20px] rounded-full drop-shadow-lg relative flex items-center justify-center">
                    <span className="bg-gray-300 rounded-full w-[12px] h-[12px] flex items-center justify-center">
                      <span className="bg-black rounded-full w-[6px] h-[6px]"></span>
                    </span>
                  </div>
                  <p className="font-semibold">
                    {formatFullName(secondary) || "Другой адрес"}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-start">
                <p className="font-medium text-[#0000004D] mr-[5px] mb-[19px]">
                  Ваши данные
                </p>
                <HorizontalLine width="620px" />
              </div>

              <form action="" className="flex items-center  mb-[41px]">
                <div className="flex flex-col mr-[23px]">
                  <div className="flex flex-col pb-[22px]">
                    <label
                      htmlFor=""
                      className="pl-[20px] mb-[5px] text-[14px] font-medium text-[#00000099]"
                    >
                      Ваше имя
                    </label>
                    <TextField sx={{ width: "350px", height: "48px" }} />
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor=""
                      className="pl-[20px] mb-[5px] text-[14px] font-medium text-[#00000099]"
                    >
                      Ваше отчество
                    </label>
                    <TextField sx={{ width: "350px", height: "48px" }} />
                  </div>
                </div>
                <div className="flex-col">
                  <div className="flex flex-col pb-[22px]">
                    <label
                      htmlFor=""
                      className="pl-[20px] mb-[5px] text-[14px] font-medium text-[#00000099]"
                    >
                      Ваша фамилия
                    </label>
                    <TextField sx={{ width: "350px", height: "48px" }} />
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor=""
                      className="pl-[20px] mb-[5px] text-[14px] font-medium text-[#00000099]"
                    >
                      Номер телефона
                    </label>
                    <div className="flex items-center">
                      <TextField
                        sx={{
                          width: "72px",
                          marginRight: "6px",
                          height: "48px",
                        }}
                      />
                      <TextField sx={{ width: "270px", height: "48px" }} />
                    </div>
                  </div>
                </div>
              </form>
              <div className="flex items-center ">
                <p className="font-medium text-[#0000004D] mr-[5px] mb-[28px] ">
                  Адрес доставки
                </p>
                <HorizontalLine width="600px" />
              </div>
              <form action="" className="flex items-center  mb-[41px]">
                <div className="mr-[23px] flex flex-col">
                  <div className="flex flex-col mb-[21px]">
                    <label
                      htmlFor=""
                      className="mb-[5px] pl-[20px] text-[14px] font-medium text-[#00000099]"
                    >
                      Область
                    </label>
                    <TextField sx={{ width: "350px", height: "48px" }} />
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor=""
                      className="mb-[5px] pl-[20px] text-[14px] font-medium text-[#00000099]"
                    >
                      Улица
                    </label>
                    <TextField sx={{ width: "350px", height: "48px" }} />
                  </div>
                </div>
                <div className="">
                  <div className="flex flex-col mb-[21px]">
                    <label
                      htmlFor=""
                      className="mb-[5px] pl-[20px] text-[14px] font-medium text-[#00000099]"
                    >
                      Город
                    </label>
                    <TextField sx={{ width: "350px", height: "48px" }} />
                  </div>
                  <div className="flex items-center">
                    <div className="flex flex-col items-center justify-center mr-[26px]">
                      <label
                        htmlFor=""
                        className="mb-[5px] text-[14px] font-medium text-[#00000099]"
                      >
                        Корпус
                      </label>
                      <TextField sx={{ width: "100px", height: "48px" }} />
                    </div>
                    <div className="flex flex-col items-center justify-center mr-[26px]">
                      <label
                        htmlFor=""
                        className="mb-[5px] text-[14px] font-medium text-[#00000099] "
                      >
                        Дом
                      </label>
                      <TextField sx={{ width: "100px", height: "48px" }} />
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      <label
                        htmlFor=""
                        className="mb-[5px] text-[14px] font-medium text-[#00000099]"
                      >
                        Квартира
                      </label>
                      <TextField sx={{ width: "100px", height: "48px" }} />
                    </div>
                  </div>
                </div>
              </form>
              <div className="flex items-center ">
                <p className="font-medium text-[#0000004D] mr-[5px] mb-[28px] ">
                  Способ оплаты
                </p>
                <HorizontalLine width="615px" />
              </div>
              <div className="bg-white  drop-shadow-lg  flex items-center justify-between h-[74px] px-[30px]">
                <div className="flex items-center">
                  <div className="mr-[29px] bg-white w-[20px] h-[20px] rounded-full drop-shadow-lg relative flex items-center justify-center">
                    <span className="bg-gray-300 rounded-full w-[12px] h-[12px] flex items-center justify-center">
                      <span className="bg-black rounded-full w-[6px] h-[6px]"></span>
                    </span>
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
