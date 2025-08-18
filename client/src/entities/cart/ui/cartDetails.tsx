"use client";

import React, { RefObject, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useClickOutside } from "@/shared/lib/hooks/useClickOutside";
import { closeCart } from "@/entities/cart/model/cart.slice";
import { Fade } from "@mui/material";
import { createPortal } from "react-dom";
import { selectCartItems } from "@/entities/cart/model/cartItems.slice";
import CartItem from "./cartItem";
import CartEmpty from "./cartEmpty";
import HorizontalLine from "@/shared/ui/HorizontalLine";
import { useRouter } from "next/navigation";

interface CartDetailsProps {
  cartButtonRef: RefObject<HTMLDivElement | null>;
}

const CartDetails = ({ cartButtonRef }: CartDetailsProps) => {
  const dispatch = useDispatch();
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const cartItems = useSelector(selectCartItems);
  const router = useRouter();

  const cartRef = useClickOutside((event: MouseEvent) => {
    // Проверяем, что клик не был по кнопке корзины
    if (!cartButtonRef.current?.contains(event.target as Node)) {
      dispatch(closeCart());
    }
  });

  useEffect(() => {
    const calculatePosition = () => {
      if (cartButtonRef.current) {
        const rect = cartButtonRef.current.getBoundingClientRect();
        const cartWidth = 293; // The width of the cart details panel
        setPosition({
          top: rect.bottom + window.scrollY + 37,
          left: rect.right + window.scrollX - cartWidth, // Align right edge
        });
      }
    };

    calculatePosition();

    window.addEventListener("resize", calculatePosition);
    return () => window.removeEventListener("resize", calculatePosition);
  }, [cartButtonRef]);

  const cartContent = (
    <Fade in={true} timeout={500}>
      <div
        ref={cartRef}
        className="w-[325px] h-[336px] bg-white shadow-lg flex flex-col absolute cursor-default z-[99999] p-4 overflow-hidden"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          boxShadow:
            "0 8px 32px 0 rgba(31, 38, 135, 0.37), 0 1.5px 8px 0 rgba(60,60,60,0.10)",
          backdropFilter: "blur(2px)",
        }}
      >
        {cartItems.length === 0 ? (
          <div className="flex-1 w-full flex items-center justify-center">
            <CartEmpty />
          </div>
        ) : (
          <>
            <ul className="w-full flex-1 overflow-y-auto overflow-x-hidden no-scrollbar">
              {cartItems.map((item, idx) => (
                <React.Fragment key={item.id}>
                  <CartItem item={item} />
                  {idx !== cartItems.length - 1 && (
                    <HorizontalLine width="100%" />
                  )}
                </React.Fragment>
              ))}
            </ul>
            <button
              className="w-full mt-4 py-4 bg-black text-white font-bold text-[18px] rounded transition hover:bg-gray-900 cursor-pointer"
              tabIndex={0}
              aria-label="Перейти к оформлению"
              onClick={() => {
                dispatch(closeCart());
                router.push("/cart");
              }}
            >
              ПЕРЕЙТИ К ОФОРМЛЕНИЮ
            </button>
          </>
        )}
      </div>
    </Fade>
  );

  return createPortal(cartContent, document.body);
};

export default CartDetails;
