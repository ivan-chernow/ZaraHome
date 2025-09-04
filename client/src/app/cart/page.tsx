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
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CloseIcon from "@mui/icons-material/Close";
import { addCartItem, removeCartItem, deleteCartItem, setCartItemQuantity, type CartItem as CartItemType } from "@/entities/cart/model/cartItems.slice";
import { useGetProductsByIdsQuery, type Product } from "@/entities/product/api/products.api";
import { findProductById } from "@/entities/category/lib/catalog.utils";
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
      const key = `${item.productId}-${item.quantity}-${item.size ?? ''}-${item.color ?? ''}`;
      currentItemsMap.set(key, (currentItemsMap.get(key) || 0) + 1);
    });

    // Заполняем мапы новыми товарами
    newItems.forEach(item => {
      const key = `${item.productId}-${item.quantity}-${item.size ?? ''}-${item.color ?? ''}`;
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
  const categories = useSelector((s: RootState) => s.catalog.categories);
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

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  const getFullImageUrl = (path?: string): string | undefined => {
    if (!path) return undefined;
    try {
      const cleanPath = path.replace(/^\/+/, "");
      return `${API_URL}/${cleanPath}`;
    } catch {
      return path;
    }
  };

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
                (() => {
                  const groups = cartItems.reduce((acc: Record<number, CartItemType[]>, item) => {
                    acc[item.id] = acc[item.id] ? [...acc[item.id], item] : [item];
                    return acc;
                  }, {} as Record<number, CartItemType[]>);

                  const handleDec = (item: CartItemType) => dispatch(removeCartItem({ id: item.id, size: item.size, color: item.color }));
                  const handleInc = (item: CartItemType) => dispatch(addCartItem({ id: item.id, price: item.price, img: item.img, size: item.size, color: item.color }));
                  const handleDel = (item: CartItemType) => dispatch(deleteCartItem({ id: item.id, size: item.size, color: item.color }));
                  const handleSetQty = (item: CartItemType, qty: number) => dispatch(setCartItemQuantity({ id: item.id, size: item.size, color: item.color, quantity: qty }));

                  const groupKeys = Object.keys(groups);
                  return groupKeys.map((productIdStr, groupIdx) => {
                    const productId = Number(productIdStr);
                    const variants = groups[productId];
                    const product = idToProduct[productId];
                    const totalForProduct = variants.reduce((sum, it) => sum + it.price * it.quantity, 0);
                    const totalQty = variants.reduce((sum, it) => sum + it.quantity, 0);

                    return (
                      <React.Fragment key={`group-${productId}`}>
                        <HorizontalLine width="720px" />
                        <li className="flex flex-col py-4">
                          <div className="flex items-start min-w-0 justify-between">
                            <div className="flex items-center min-w-0">
                              <img
                                alt={(product?.name_ru || `Товар #${productId}`)}
                                src={getFullImageUrl(product?.img?.[0]) || getFullImageUrl(variants[0]?.img) || "/assets/img/Catalog/product2.png"}
                                width={79}
                                height={79}
                                className="mr-4 rounded object-cover"
                              />
                              <div className="flex flex-col min-w-0">
                                <h4 className="font-bold text-[14px] leading-4 mb-[2px] truncate uppercase">{product?.name_eng ?? ''}</h4>
                                <p className="font-medium text-[#00000080] text-[12px] leading-4 truncate">{product?.name_ru ?? ''}</p>
                                <div className="mt-1 text-[12px] text-[#00000099]">Всего: {totalQty} шт.</div>
                              </div>
                            </div>
                            <span className="font-medium text-[16px] font-roboto whitespace-nowrap">
                              {totalForProduct.toLocaleString("ru-RU")} <span className="font-bold font-ysabeau text-[14px]">₽</span>
                            </span>
                          </div>

                          <div className="mt-3 ml-[95px] flex flex-col gap-2">
                            {variants.map((v) => (
                              <div key={`${v.id}-${v.size ?? ''}-${v.color ?? ''}`} className="flex items-center justify-between">
                                <div className="text-[12px] text-[#00000099] flex items-center gap-3">
                                  {v.size && <span>Размер: {product?.size?.[v.size!]?.size ?? v.size}</span>}
                                  {v.color && (
                                    <span className="flex items-center gap-1">
                                      Цвет: <span className="inline-block w-3 h-3 rounded-full border" style={{ backgroundColor: product?.colors?.[v.color!] }} />
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-3">
                                  <button
                                    aria-label="Уменьшить количество"
                                    onClick={() => handleDec(v)}
                                    className="w-7 h-7 flex items-center justify-center rounded-full bg-[#F2F2F2] text-[#6B7280] hover:bg-[#E5E7EB] transition transform hover:scale-105 active:scale-95 cursor-pointer leading-none"
                                  >
                                    <RemoveRoundedIcon fontSize="small" />
                                  </button>
                                  <input
                                    className="w-[56px] h-[30px] border border-[#E5E5E5] text-center text-[14px] rounded outline-none focus:border-gray-400"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    value={String(v.quantity)}
                                    onChange={(e) => {
                                      const raw = e.target.value.replace(/\D+/g, "");
                                      const numeric = parseInt(raw, 10);
                                      if (Number.isFinite(numeric) && numeric > 0) {
                                        handleSetQty(v, numeric);
                                      }
                                    }}
                                  />
                                  <button
                                    aria-label="Увеличить количество"
                                    onClick={() => handleInc(v)}
                                    className="w-7 h-7 flex items-center justify-center rounded-full bg-[#F2F2F2] text-[#6B7280] hover:bg-[#E5E7EB] transition transform hover:scale-105 active:scale-95 cursor-pointer leading-none"
                                  >
                                    <AddRoundedIcon fontSize="small" />
                                  </button>
                                  <button
                                    aria-label="Удалить вариант"
                                    onClick={() => handleDel(v)}
                                    className="ml-1 p-1 rounded-full bg-[#F2F2F2] text-[#6B7280] hover:bg-[#E5E7EB] transition-colors duration-150 transform hover:scale-105 active:scale-95 cursor-pointer"
                                  >
                                    <CloseIcon fontSize="small" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </li>
                        {groupIdx === groupKeys.length - 1 && <HorizontalLine width="720px" />}
                      </React.Fragment>
                    );
                  });
                })()
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
                          size: item.size,
                          color: item.color,
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
                        items: cartItems.map(item => {
                          const product = idToProduct[item.id] || findProductById(categories, item.id);
                          const productName = (product?.name_ru || product?.name_eng || `Товар #${item.id}`).toString();
                          let price = Number(item.price);
                          if (!Number.isFinite(price) || price <= 0) {
                            const sizeKey = item.size && product?.size ? item.size : (product?.size ? Object.keys(product.size)[0] : undefined);
                            const fallback = sizeKey && product?.size ? product.size[sizeKey]?.price : undefined;
                            price = Number(fallback) > 0 ? Number(fallback) : 1;
                          }
                          return {
                            productId: item.id,
                            productName,
                            quantity: Math.max(1, Math.floor(item.quantity || 1)),
                            price,
                            size: item.size,
                            color: item.color,
                          };
                        }),
                      } as const;

                      const createdOrder = await createOrder(orderData).unwrap();
                      
                      // Сохраняем ID созданного заказа в Redux store
                      dispatch(setCurrentOrderId(createdOrder.id));
                      
                      // После успешного создания заказа переходим к оформлению
                      router.push("/order");
                    } catch (error: any) {
                      const payload = error?.data || error;
                      console.error('Ошибка при создании заказа:', payload);
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
