import React from "react";

interface PaginationStatsProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  className?: string;
}

const PaginationStats: React.FC<PaginationStatsProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  className = "",
}) => {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className={`text-center text-sm text-gray-600 ${className}`}>
      <p>
        Показано {startItem}-{endItem} из {totalItems} товаров
        {totalPages > 1 && ` (страница ${currentPage} из ${totalPages})`}
      </p>
    </div>
  );
};

export default PaginationStats;
