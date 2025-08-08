import React from "react";
import { Button } from "@mui/material";
import Image from "next/image";

interface CartButtonProps {
  size?: "default" | "small";
}

const CartButton = ({ size = "default" }: CartButtonProps) => {
  const isSmall = size === "small";

  return (
    <Button
      variant="outlined"
      sx={{
        backgroundColor: "black",
        borderColor: "black",
        color: "white",
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
        // Базовый стиль иконки: задаём явный filter и transition, чтобы анимация была синхронной с текстом
        "& .MuiButton-endIcon img": {
          filter: "invert(0)",
          transition: "filter 0.3s ease-in",
        },
        "&:hover": {
          backgroundColor: "white",
          color: "black",
          border: "1px solid black",
        },
        // Ховер-стиль для изображения иконки: меняем filter одновременно с цветом текста
        "&:hover .MuiButton-endIcon img": {
          filter: "invert(1)",
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
      {isSmall ? "В корзину" : "в корзину"}
    </Button>
  );
};

export default CartButton;
