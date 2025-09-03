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
import { useCreateOrderMutation, useGetActiveOrderQuery } from "@/entities/order/api/orders.api";
import { useDispatch } from "react-redux";
import { setCurrentOrderId } from "@/entities/order/model/order.slice";
import HorizontalLine from "@/shared/ui/HorizontalLine";
import Link from "next/link";
import { RootState } from "@/shared/config/store/store";
import { openModalAuth, setView } from "@/features/auth/model/auth.slice";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const Page = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [mounted, setMounted] = useState(false);
  const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation();
  
  // Получаем активный заказ пользователя
  const { data: activeOrder } = useGetActiveOrderQuery();

  // Функция для проверки изменения товаров
  const haveItemsChanged = (currentItems: any[], newItems: any[]): boolean => {
    // Если количество товаров разное, значит товары изменились
    if (currentItems.length !== newItems.length) {
      return true;
    }

    // Создаем мапы для быстрого сравнения
    const currentItemsMap = new Map();
    const newItemsMap = new Map();

    // Заполняем мапы текущими товарами
    currentItems.forEach(item => {
      const key = `${item.productId}-${item.quantity}`;
      currentItemsMap.set(key, (currentItemsMap.get(key) || 0) + 1);
    });

    // Заполняем мапы новыми товарами
    newItems.forEach(item => {
      const key = `${item.productId}-${item.quantity}`;
      newItemsMap.set(key, (newItemsMap.get(key) || 0) + 1);
    });

    // Сравниваем мапы
    if (currentItemsMap.size !== newItemsMap.size) {
      return true;
    }

    for (const [key, count] of currentItemsMap) {
      if (newItemsMap.get(key) !== count) {
        return true;
      }
    }

    return false;
  };
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const cartItems = useSelector(selectCartItems);
  const { isAuthenticated } = useSelector((s: RootState) => s.auth);
  const totalCount = useSelector(selectCartTotalCount);
  const totalPrice = useSelector(selectCartTotalPrice);

  // Быстрый запрос названий товаров по id, чтобы сразу показать имена без skeleton
  const ids = cartItems.map((i) => i.id);
  const { data: productsByIds } = useGetProductsByIdsQuery(ids, {
    skip: !mounted || ids.length === 0,
  });
  const safeProducts: Product[] = Array.isArray(productsByIds) ? productsByIds : [];
  const idToProduct: Record<number, Product> = safeProducts.reduce(
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
                    {!isAuthenticated && (
                      <div className="w-full bg-gray-50 border border-gray-200 rounded p-3 mb-3 text-center">
                        <div className="flex items-center justify-center text-[#00000099] mb-1">
                          <LockOutlinedIcon fontSize="small" className="mr-1" />
                          <span className="text-sm">Войдите, чтобы оформить заказ</span>
                        </div>
                        <div className="text-xs text-[#6b7280]">Если у вас нет аккаунта — можно зарегистрироваться за минуту</div>
                      </div>
                    )}
                    <MainButton
                      text={isAuthenticated ? "Перейти к оформлению" : "Войти, чтобы оформить"}
                      disabled={cartItems.length === 0 || isCreatingOrder}
                      type="button"
                                        onClick={async () => {
                    if (!isAuthenticated) {
                      dispatch(setView('login'));
                      dispatch(openModalAuth());
                      return;
                    }
                    try {
                      // Если у пользователя уже есть активный заказ, проверяем, изменились ли товары
                      if (activeOrder && activeOrder.items) {
                        const currentItems = activeOrder.items;
                        const newItems = cartItems.map(item => ({
                          productId: item.id,
                          quantity: item.quantity,
                        }));
                        
                        // Проверяем, одинаковые ли товары и количества
                        const itemsChanged = haveItemsChanged(currentItems, newItems);
                        
                        // Если товары не изменились, используем существующий заказ
                        if (!itemsChanged) {
                          dispatch(setCurrentOrderId(activeOrder.id));
                          router.push("/order");
                          return;
                        }
                        
                        // Если товары изменились, создаем новый заказ (старый будет отменен на бэкенде)
                      }

                      // Создаем новый заказ со статусом "ожидает оплаты"
                      const orderData = {
                        items: cartItems.map(item => ({
                          productId: item.id,
                          productName: idToProduct[item.id]?.name_ru || "Товар",
                          quantity: item.quantity,
                          price: item.price,
                          size: '', // Размер не хранится в корзине
                          color: '', // Цвет не хранится в корзине
                        })),
                        totalPrice,
                        totalCount,
                        address: '', // Адрес будет указан на странице оформления
                        phone: '', // Телефон будет указан на странице оформления
                        comment: '', // Комментарий будет указан на странице оформления
                      };

                      const createdOrder = await createOrder(orderData).unwrap();
                      
                      // Сохраняем ID созданного заказа в Redux store
                      dispatch(setCurrentOrderId(createdOrder.id));
                      
                      // После успешного создания заказа переходим к оформлению
                      router.push("/order");
                    } catch (error) {
                      console.error('Ошибка при создании заказа:', error);
                      // Здесь можно добавить уведомление об ошибке
                    }
                  }}
                      width="358px"
                      height="56px"
                    />
                    {!isAuthenticated && (
                      <div className="mt-2 text-center text-sm">
                        <button
                          className="underline cursor-pointer text-[#00000099]"
                          onClick={() => {
                            dispatch(setView('signup'));
                            dispatch(openModalAuth());
                          }}
                        >
                          Зарегистрироваться
                        </button>
                      </div>
                    )}
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
