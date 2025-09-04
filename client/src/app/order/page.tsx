"use client";
import React, { useMemo, useState, useCallback, useEffect } from "react";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import Container from "@mui/material/Container";
import MainLayout from "@/widgets/layout/MainLayout";
import HorizontalLine from "@/shared/ui/HorizontalLine";
import { IconButton, TextField } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import ClearIcon from "@mui/icons-material/Clear";
import MainButton from "@/shared/ui/Button/MainButton";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/shared/config/store/store";
import { openModalAuth, setView } from "@/features/auth/model/auth.slice";
import { setCurrentOrderId, setOrderTotals } from "@/entities/order/model/order.slice";
import { useUpdateOrderMutation, useGetActiveOrderQuery } from "@/entities/order/api/orders.api";
import {
  selectCartItems,
  selectCartTotalPrice,
  CartItem,
} from "@/entities/cart/model/cartItems.slice";
import { useApplyPromocodeMutation } from "@/entities/promocode/api/promocodes.api";
import { Alert } from "@mui/material";
import DeliveryAddress from "@/features/profile/delivery-address/ui/DeliveryAddress";
import { useRouter } from "next/navigation";
import { useGetDeliveryAddressesQuery } from "@/entities/user/api/profile.api";

const Page = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const { selectedAddress } = useSelector((state: RootState) => state.delivery);
  const currentOrderId = useSelector((state: RootState) => state.order.currentOrderId);
  const cartItems = useSelector(
    (state: RootState) => selectCartItems(state) as CartItem[]
  );
  const cartTotal = useSelector(
    (state: RootState) => selectCartTotalPrice(state) as number
  );

  // Получаем адреса доставки (не подставляем [] по умолчанию, чтобы избежать мерцания UI)
  const {
    data: addresses,
    isLoading: isAddressesLoading,
    isFetching: isAddressesFetching,
  } = useGetDeliveryAddressesQuery();

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
  const [updateOrder, { isLoading: isUpdatingOrder }] = useUpdateOrderMutation();
  const [promoError, setPromoError] = useState<string | null>(null);
  
  // Получаем активный заказ пользователя
  const { data: activeOrder } = useGetActiveOrderQuery();
  const [applied, setApplied] = useState<null | {
    code: string;
    discount: number;
    finalAmount: number;
  }>(null);

  // Автоматически устанавливаем ID активного заказа, если он есть
  useEffect(() => {
    if (activeOrder && !currentOrderId) {
      dispatch(setCurrentOrderId(activeOrder.id));
    }
  }, [activeOrder, currentOrderId, dispatch]);

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
      // Сохраняем итоговую сумму в текущем заказе, чтобы страница оплаты показывала скидку
      dispatch(setOrderTotals({ totalPrice: res.finalAmount }));
    } catch (e: any) {
      const msg = e?.data?.message || "Промокод недействителен";
      setPromoError(msg);
    }
  }, [promo, cartTotal, applyPromocode, dispatch]);

  // Адреса доставки
  // DeliveryAddress компонент сам загружает адреса и синхронизирует выбранный адрес с Redux

  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ pt: "45px" }}>
        <div className="flex items-center mb-4">
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
        <p className="font-light text-[42px] mb-4">Оформление заказа</p>

        {mounted && !isAuthenticated ? (
          <div className="bg-white drop-shadow-lg p-6 mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
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
          <div className="flex items-start justify-between mb-4">
            <div className="mb-2 flex-1 mr-4">
              <DeliveryAddress hideHeader hideLimitInfo compact />
              
              {/* Показываем способ оплаты если есть адреса */}
              {addresses && addresses.length > 0 && (
                <>
                  <div className="flex items-center mt-3 mb-2">
                    <div className="flex-1"><HorizontalLine width="100%" /></div>
                    <p className="font-medium text-[#0000004D] mx-[10px] mb-0 whitespace-nowrap">
                      Способ оплаты
                    </p>
                    <div className="flex-1"><HorizontalLine width="100%" /></div>
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
                          Картами российских банков
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
                </>
              )}
            </div>

            {isAuthenticated && (
              <div className="flex flex-col w-[380px] h-auto drop-shadow-lg items-center justify-start bg-white py-6">
                {isAddressesLoading || isAddressesFetching || addresses === undefined ? (
                  // Скелетон на время загрузки адресов, чтобы не показывать "невозможно оформить заказ"
                  <div className="p-4 w-full">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
                      <div className="h-10 bg-gray-200 rounded w-full mb-3" />
                      <div className="h-10 bg-gray-200 rounded w-full" />
                    </div>
                  </div>
                ) : addresses && addresses.length === 0 ? (
                  <div className="text-center p-4">
                    <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-3">
                      <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Невозможно оформить заказ
                    </h3>
                    <p className="text-gray-600">
                      Сначала добавьте адрес доставки
                    </p>
                  </div>
                ) : (
                  <>
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
                    <div className="flex items-center mt-[25px] mb-[10px] w-full">
                      <div className="flex-1"><HorizontalLine width="100%" /></div>
                      <p className="font-medium text-[#0000004D] mx-[10px] mb-0 whitespace-nowrap">
                        Ваша скидка
                      </p>
                      <div className="flex-1"><HorizontalLine width="100%" /></div>
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
                      disabled={
                        isCartEmpty ||
                        isUpdatingOrder ||
                        !currentOrderId ||
                        !selectedAddress ||
                        !addresses ||
                        addresses.length === 0
                      }
                      type="button"
                      width="358px"
                      height="56px"
                      onClick={async () => {
                        try {
                          if (!currentOrderId) {
                            console.error('ID заказа не найден');
                            return;
                          }

                          if (!selectedAddress) {
                            console.error('Адрес доставки не выбран');
                            return;
                          }

                          // Обновляем существующий заказ с адресом доставки
                          const fullAddress = `${selectedAddress.region}, ${selectedAddress.city}, ${selectedAddress.street}${selectedAddress.building ? `, корп. ${selectedAddress.building}` : ''}, д. ${selectedAddress.house}${selectedAddress.apartment ? `, кв. ${selectedAddress.apartment}` : ''}`;
                          
                          await updateOrder({
                            id: currentOrderId,
                            address: fullAddress,
                            phone: selectedAddress.phone,
                            comment: '',
                          }).unwrap();
                          
                          // После успешного обновления заказа переходим к оплате
                          router.push("/payment");
                        } catch (error) {
                          console.error('Ошибка при обновлении заказа:', error);
                          // Здесь можно добавить уведомление об ошибке
                        }
                      }}
                    />
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </Container>
    </MainLayout>
  );
};

export default Page;
