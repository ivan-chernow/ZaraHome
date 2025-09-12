import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface UsePaginationProps {
  totalItems: number;
  pageSize: number;
  initialPage?: number;
}

interface UsePaginationReturn {
  currentPage: number;
  totalPages: number;
  paginatedItems: any[];
  handlePageChange: (event: any, value: number) => void;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export const usePagination = <T>(
  items: T[],
  { totalItems, pageSize, initialPage = 1 }: UsePaginationProps
): UsePaginationReturn => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Получаем текущую страницу из URL
  const urlPage = Number(searchParams.get('page')) || initialPage;
  const [currentPage, setCurrentPage] = useState(urlPage);

  // Синхронизируем состояние с URL
  useEffect(() => {
    setCurrentPage(urlPage);
  }, [urlPage]);

  // Вычисляем общее количество страниц
  const totalPages = useMemo(
    () => Math.ceil(totalItems / pageSize),
    [totalItems, pageSize]
  );

  // Получаем элементы для текущей страницы
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return items.slice(startIndex, endIndex);
  }, [items, currentPage, pageSize]);

  // Обновляем URL при изменении страницы
  const updateURL = (page: number) => {
    const params = new URLSearchParams(searchParams);
    if (page === 1) {
      params.delete('page');
    } else {
      params.set('page', page.toString());
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Обработчик изменения страницы
  const handlePageChange = (_: any, value: number) => {
    setCurrentPage(value);
    updateURL(value);

    // Скроллим к началу списка
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Переход на конкретную страницу
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      updateURL(page);
    }
  };

  // Следующая страница
  const nextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  // Предыдущая страница
  const prevPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  // Проверяем наличие следующей/предыдущей страницы
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  return {
    currentPage,
    totalPages,
    paginatedItems,
    handlePageChange,
    goToPage,
    nextPage,
    prevPage,
    hasNextPage,
    hasPrevPage,
  };
};
