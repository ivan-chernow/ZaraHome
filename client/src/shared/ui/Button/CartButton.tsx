'use client';

import React, { useCallback, useMemo } from 'react';
import { Button } from '@mui/material';
import Image from 'next/image';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/shared/config/store/store';
import { getLocalStorage, setLocalStorage } from '@/shared/lib/storage';
import {
  useAddToCartMutation,
  useRemoveFromCartMutation,
} from '@/entities/cart/api/cart.api';
import {
  addCartItem,
  removeCartItem,
  setCartItems,
} from '@/entities/cart/model/cartItems.slice';

interface CartButtonProps {
  productId: number;
  price: number;
  img?: string;
  selectedSize?: string;
  selectedColor?: string;
  size?: 'default' | 'small';
  name_eng?: string;
  name_ru?: string;
}

const CartButton = ({
  productId,
  price,
  img,
  selectedSize,
  selectedColor,
  size = 'default',
  name_eng,
  name_ru,
}: CartButtonProps) => {
  const dispatch = useDispatch();
  const isSmall = size === 'small';

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const cartItems = useSelector((state: RootState) => state.cartItems.items);

  const isInCart = useMemo(
    () =>
      cartItems.some(
        item =>
          item.id === productId &&
          item.size === selectedSize &&
          item.color === selectedColor
      ),
    [cartItems, productId, selectedSize, selectedColor]
  );

  const [addToCart] = useAddToCartMutation();
  const [removeFromCart] = useRemoveFromCartMutation();

  const handleAuthenticatedToggle = useCallback(async () => {
    try {
      if (isInCart) {
        dispatch(
          removeCartItem({
            id: productId,
            size: selectedSize,
            color: selectedColor,
          })
        );
        await removeFromCart(productId).unwrap();
      } else {
        dispatch(
          addCartItem({
            id: productId,
            price,
            img,
            size: selectedSize,
            color: selectedColor,
            name_eng,
            name_ru,
          })
        );
        await addToCart(productId).unwrap();
      }
    } catch (error) {
      // Rollback optimistic update
      if (isInCart) {
        dispatch(
          addCartItem({
            id: productId,
            price,
            img,
            size: selectedSize,
            color: selectedColor,
            name_eng,
            name_ru,
          })
        );
      } else {
        dispatch(
          removeCartItem({
            id: productId,
            size: selectedSize,
            color: selectedColor,
          })
        );
      }
      const anyErr: any = error as any;
      console.error('Ошибка при работе с корзиной:', {
        raw: anyErr,
        status: anyErr?.status,
        data: anyErr?.data,
        message: anyErr?.error || anyErr?.message,
      });
    }
  }, [
    isInCart,
    productId,
    price,
    img,
    selectedSize,
    selectedColor,
    name_eng,
    name_ru,
    addToCart,
    removeFromCart,
    dispatch,
  ]);

  const handleGuestToggle = useCallback(() => {
    const cart = getLocalStorage('cart', []);
    const updatedCart = isInCart
      ? cart.filter(
          (item: any) =>
            !(
              item.id === productId &&
              item.size === selectedSize &&
              item.color === selectedColor
            )
        )
      : [
          ...cart,
          {
            id: productId,
            price,
            quantity: 1,
            img,
            size: selectedSize,
            color: selectedColor,
            name_eng,
            name_ru,
          },
        ];

    setLocalStorage('cart', updatedCart);
    dispatch(setCartItems(updatedCart));
  }, [
    isInCart,
    productId,
    price,
    img,
    selectedSize,
    selectedColor,
    name_eng,
    name_ru,
    dispatch,
  ]);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (isAuthenticated) {
        handleAuthenticatedToggle();
      } else {
        handleGuestToggle();
      }
    },
    [isAuthenticated, handleAuthenticatedToggle, handleGuestToggle]
  );

  return (
    <Button
      onClick={handleClick}
      variant="outlined"
      disabled={false}
      aria-label={isInCart ? 'Удалить из корзины' : 'Добавить в корзину'}
      aria-pressed={isInCart}
      aria-disabled={false}
      sx={{
        backgroundColor: isInCart ? 'white' : 'black',
        borderColor: 'black',
        color: isInCart ? 'black' : 'white',
        width: isSmall ? '120px' : '180px',
        height: isSmall ? '40px' : '50px',
        position: 'absolute',
        bottom: isSmall ? 2 : 0,
        right: 2,
        textTransform: 'uppercase',
        fontSize: isSmall ? '14px' : '18px',
        fontWeight: 600,
        fontFamily: 'inherit',
        gap: '2px',
        transition:
          'background-color 0.3s ease-in, color 0.3s ease-in, border-color 0.3s ease-in',
        '& .MuiButton-endIcon img': {
          filter: isInCart ? 'invert(1)' : 'invert(0)',
          transition: 'filter 0.3s ease-in',
        },
        '&:hover': {
          backgroundColor: isInCart ? 'black' : 'white',
          color: isInCart ? 'white' : 'black',
          border: '1px solid black',
        },
        '&:hover .MuiButton-endIcon img': {
          filter: isInCart ? 'invert(0)' : 'invert(1)',
        },
      }}
      endIcon={
        !isSmall ? (
          <Image
            alt="cart img"
            src="/assets/img/New%20Clothes/cart.svg"
            width={23}
            height={21}
            role="presentation"
            loading="lazy"
          />
        ) : undefined
      }
    >
      {isSmall
        ? isInCart
          ? 'В корзине'
          : 'В корзину'
        : isInCart
          ? 'в корзине'
          : 'в корзину'}
    </Button>
  );
};

export default CartButton;
