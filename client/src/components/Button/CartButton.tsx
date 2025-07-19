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
        transition: "all 0.3s ease-in",
        "&:hover": {
          backgroundColor: "white",
          color: "black",
          border: "1px solid black",
          "& .MuiButton-endIcon": {
            filter: "invert(3)",
          },
        },
      }}
      endIcon={
        !isSmall ? (
          <Image
            alt="cart img"
            src="/assets/img/New%20Clothes/cart.svg"
            width={23}
            height={21}
            style={{
              transition: "filter 0.3s ease-in",
            }}
          />
        ) : undefined
      }
    >
      {isSmall ? "В корзину" : "в корзину"}
    </Button>
  );
};

export default CartButton;
