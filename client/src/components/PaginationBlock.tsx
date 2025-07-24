import React from "react";
import Pagination from "@mui/material/Pagination";

interface PaginationBlockProps {
  count: number;
  page: number;
  onChange: (event: React.ChangeEvent<unknown>, value: number) => void;
}

const PaginationBlock: React.FC<PaginationBlockProps> = ({
  count,
  page,
  onChange,
}) => (
  <div className="flex justify-center mt-8">
    <Pagination
      count={count}
      page={page}
      onChange={onChange}
      color="primary"
      siblingCount={1}
      boundaryCount={1}
      sx={{
        "& .MuiPagination-ul": {
          justifyContent: "center",
          gap: "12px",
        },
        "& .MuiButtonBase-root": {
          borderRadius: "12px",
          minWidth: "44px",
          minHeight: "44px",
          fontWeight: 600,
          fontSize: "18px",
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

export default PaginationBlock;
