import { useState, useMemo } from 'react';

export type SortType = 'default' | 'price' | 'date';

interface UseSortingProps {
  products: any[];
}

interface UseSortingReturn {
  sortType: SortType;
  sortedProducts: any[];
  handleSortByPrice: () => void;
  handleSortByDate: () => void;
}

export const useSorting = ({ products }: UseSortingProps): UseSortingReturn => {
  const [sortType, setSortType] = useState<SortType>('default');

  // Сортируем продукты в зависимости от выбранного типа сортировки
  const sortedProducts = useMemo(() => {
    if (sortType === 'default') {
      return products;
    } else if (sortType === 'price') {
      return [...products].sort((a, b) => {
        // Получаем минимальные цены для сравнения
        const aPrices = Object.values(a.size).map((item: any) => item.price);
        const bPrices = Object.values(b.size).map((item: any) => item.price);
        const aMinPrice = Math.min(...aPrices);
        const bMinPrice = Math.min(...bPrices);
        return aMinPrice - bMinPrice;
      });
    } else if (sortType === 'date') {
      return [...products].sort((a, b) => {
        const aDate = new Date(a.createdAt || 0).getTime();
        const bDate = new Date(b.createdAt || 0).getTime();
        return bDate - aDate; // Новые сначала
      });
    }
    return products;
  }, [products, sortType]);

  // Обработчики сортировки
  const handleSortByPrice = () => {
    setSortType(sortType === 'price' ? 'default' : 'price');
  };

  const handleSortByDate = () => {
    setSortType(sortType === 'date' ? 'default' : 'date');
  };

  return {
    sortType,
    sortedProducts,
    handleSortByPrice,
    handleSortByDate,
  };
}; 