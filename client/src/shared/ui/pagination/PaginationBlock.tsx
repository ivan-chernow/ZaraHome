import React from "react";
import Pagination from "@mui/material/Pagination";

interface PaginationBlockProps {
  count: number;
  page: number;
  onChange: (event: React.ChangeEvent<unknown>, value: number) => void;
  size?: "small" | "medium" | "large";
  variant?: "outlined" | "text";
  className?: string;
}

const PaginationBlock: React.FC<PaginationBlockProps> = ({
  count,
  page,
  onChange,
  size = "medium",
  variant = "outlined",
  className = "",
}) => {
  // Не показываем пагинацию если страница одна
  if (count <= 1) {
    return null;
  }

  return (
    <div className={`flex justify-center mt-8 ${className}`}>
      <Pagination
        count={count}
        page={page}
        onChange={onChange}
        color="primary"
        size={size}
        variant={variant}
        siblingCount={1}
        boundaryCount={1}
        sx={{
          "& .MuiPagination-ul": {
            justifyContent: "center",
            gap: size === "small" ? "8px" : "12px",
          },
          "& .MuiButtonBase-root": {
            borderRadius: size === "small" ? "8px" : "12px",
            minWidth: size === "small" ? "36px" : "44px",
            minHeight: size === "small" ? "36px" : "44px",
            fontWeight: 600,
            fontSize: size === "small" ? "14px" : "18px",
            border: "1.5px solid #000",
            color: "#000",
            backgroundColor: "#fff",
            transition: "all 0.2s",
            "&:hover": {
              backgroundColor: "#000",
              color: "#fff",
              borderColor: "#000",
            },
          },
          "& .Mui-selected": {
            backgroundColor: "#000 !important",
            color: "#fff !important",
            borderColor: "#000 !important",
          },
        }}
      />
    </div>
  );
};

export default PaginationBlock;
