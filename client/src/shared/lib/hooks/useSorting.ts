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
    // Проверяем, что products существует и является массивом
    if (!Array.isArray(products)) {
      return [];
    }
    
    if (sortType === 'default') {
      return products;
    } else if (sortType === 'price') {
      return [...products].sort((a, b) => {
        // Проверяем, что у товаров есть необходимые поля
        if (!a || !b || !a.size || !b.size) {
          console.warn('Товар без размеров или цен:', { a: a?.id, b: b?.id });
          return 0;
        }
        
        // Получаем минимальные цены для сравнения с проверкой на пустые массивы
        const aPrices = Object.values(a.size).map((item: any) => item.price).filter(price => typeof price === 'number' && !isNaN(price));
        const bPrices = Object.values(b.size).map((item: any) => item.price).filter(price => typeof price === 'number' && !isNaN(price));
        
        // Если у товара нет цен, помещаем его в конец
        if (aPrices.length === 0 && bPrices.length === 0) return 0;
        if (aPrices.length === 0) return 1;
        if (bPrices.length === 0) return -1;
        
        const aMinPrice = Math.min(...aPrices);
        const bMinPrice = Math.min(...bPrices);
        
        // Логируем для отладки первые несколько сравнений
        if (Math.random() < 0.1) { // Логируем только 10% случаев
          console.log('Сравнение цен:', {
            a: { id: a.id, name: a.name_ru, minPrice: aMinPrice },
            b: { id: b.id, name: b.name_ru, minPrice: bMinPrice },
            result: aMinPrice - bMinPrice
          });
        }
        
        // Если цены одинаковые, сортируем по ID для стабильности
        if (aMinPrice === bMinPrice) {
          return a.id - b.id;
        }
        
        return aMinPrice - bMinPrice;
      });
    } else if (sortType === 'date') {
      return [...products].sort((a, b) => {
        // Проверяем, что у товаров есть необходимые поля
        if (!a || !b) {
          return 0;
        }
        
        const aDate = new Date(a.createdAt || 0).getTime();
        const bDate = new Date(b.createdAt || 0).getTime();
        
        // Если даты одинаковые, сортируем по ID для стабильности
        if (aDate === bDate) {
          return a.id - b.id;
        }
        
        return bDate - aDate; // Новые сначала
      });
    }
    return products;
  }, [products, sortType]);

  // Обработчики сортировки
  const handleSortByPrice = () => {
    const newSortType = sortType === 'price' ? 'default' : 'price';
    setSortType(newSortType);
    
    // Логируем для отладки
    if (newSortType === 'price') {
      console.log('Сортировка по цене включена');
      console.log('Товары для сортировки:', products.length);
    } else {
      console.log('Сортировка по цене отключена');
    }
  };

  const handleSortByDate = () => {
    const newSortType = sortType === 'date' ? 'default' : 'date';
    setSortType(newSortType);
    
    // Логируем для отладки
    if (newSortType === 'date') {
      console.log('Сортировка по дате включена');
      console.log('Товары для сортировки:', products.length);
    } else {
      console.log('Сортировка по дате отключена');
    }
  };

  return {
    sortType,
    sortedProducts,
    handleSortByPrice,
    handleSortByDate,
  };
}; 