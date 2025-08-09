"use client";

import React, { useCallback, useMemo } from "react";
import { Button } from "@mui/material";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { getLocalStorage, setLocalStorage } from "@/utils/storage";
import {
  useAddToCartMutation,
  useRemoveFromCartMutation,
} from "@/api/cart.api";
import {
  addCartItem,
  removeCartItem,
  setCartItems,
} from "@/store/features/cart/cartItems.slice";

interface CartButtonProps {
  productId: number;
  price: number;
  img?: string;
  size?: "default" | "small";
}

const CartButton = ({
  productId,
  price,
  img,
  size = "default",
}: CartButtonProps) => {
  const dispatch = useDispatch();
  const isSmall = size === "small";

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const cartItems = useSelector((state: RootState) => state.cartItems.items);

  const isInCart = useMemo(
    () => cartItems.some((item) => item.id === productId),
    [cartItems, productId]
  );

  const [addToCart] = useAddToCartMutation();
  const [removeFromCart] = useRemoveFromCartMutation();

  const handleAuthenticatedToggle = useCallback(async () => {
    try {
      if (isInCart) {
        dispatch(removeCartItem(productId));
        await removeFromCart(productId).unwrap();
      } else {
        dispatch(addCartItem({ id: productId, price, img }));
        await addToCart(productId).unwrap();
      }
    } catch (error) {
      // Rollback optimistic update
      if (isInCart) {
        dispatch(addCartItem({ id: productId, price, img }));
      } else {
        dispatch(removeCartItem(productId));
      }
      console.error("Ошибка при работе с корзиной:", error);
    }
  }, [isInCart, productId, price, img, addToCart, removeFromCart, dispatch]);

  const handleGuestToggle = useCallback(() => {
    const cart = getLocalStorage("cart", []);
    const updatedCart = isInCart
      ? cart.filter((item: any) => item.id !== productId)
      : [...cart, { id: productId, price, quantity: 1, img }];

    setLocalStorage("cart", updatedCart);
    dispatch(setCartItems(updatedCart));
  }, [isInCart, productId, price, img, dispatch]);

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
      disabled={typeof price !== "number"}
      sx={{
        backgroundColor: isInCart ? "white" : "black",
        borderColor: "black",
        color: isInCart ? "black" : "white",
        width: isSmall ? "120px" : "180px",
        height: isSmall ? "40px" : "50px",
        position: "absolute",
        bottom: isSmall ? 2 : 0,
        right: 2,
        textTransform: "uppercase",
        fontSize: isSmall ? "14px" : "18px",
        fontWeight: 600,
        fontFamily: "inherit",
        gap: "2px",
        transition:
          "background-color 0.3s ease-in, color 0.3s ease-in, border-color 0.3s ease-in",
        "& .MuiButton-endIcon img": {
          filter: isInCart ? "invert(1)" : "invert(0)",
          transition: "filter 0.3s ease-in",
        },
        "&:hover": {
          backgroundColor: isInCart ? "black" : "white",
          color: isInCart ? "white" : "black",
          border: "1px solid black",
        },
        "&:hover .MuiButton-endIcon img": {
          filter: isInCart ? "invert(0)" : "invert(1)",
        },
      }}
      endIcon={
        !isSmall ? (
          <Image
            alt="cart img"
            src="/assets/img/New%20Clothes/cart.svg"
            width={23}
            height={21}
          />
        ) : undefined
      }
    >
      {isSmall
        ? isInCart
          ? "В корзине"
          : "В корзину"
        : isInCart
        ? "в корзине"
        : "в корзину"}
    </Button>
  );
};

export default CartButton;
