import React from 'react';
import Image from 'next/image';
import { SortType } from '@/shared/lib/hooks/useSorting';

interface SortButtonsProps {
  sortType: SortType;
  onSortByPrice: () => void;
  onSortByDate: () => void;
  className?: string;
}

const SortButtons: React.FC<SortButtonsProps> = ({
  sortType,
  onSortByPrice,
  onSortByDate,
  className = '',
}) => {
  return (
    <div
      className={`flex items-center justify-end ${className}`}
      role="group"
      aria-label="Сортировка товаров"
    >
      <button
        className={`flex items-center mr-[12px] cursor-pointer transition-all ease-in-out duration-300 hover:underline ${
          sortType === 'price' ? 'text-blue-600 font-semibold underline' : ''
        }`}
        onClick={onSortByPrice}
        aria-label="Сортировать по цене"
        aria-pressed={sortType === 'price'}
      >
        <Image
          src="/assets/img/Catalog/cheap.png"
          alt="cheap"
          width={24}
          height={24}
          role="presentation"
          loading="lazy"
        />
        <p className="text-[14px] font-semibold mr-[3px]">Сначала дешевые</p>
      </button>
      <button
        className={`flex items-center cursor-pointer transition-all ease-in-out duration-300 hover:underline ${
          sortType === 'date' ? 'text-blue-600 font-semibold underline' : ''
        }`}
        onClick={onSortByDate}
        aria-label="Сортировать по дате добавления"
        aria-pressed={sortType === 'date'}
      >
        <Image
          src="/assets/img/Catalog/Time_later.svg"
          alt="later"
          width={24}
          height={24}
          role="presentation"
          loading="lazy"
        />
        <p className="text-[14px] font-semibold mr-[5px]">Добавлены позже</p>
      </button>
    </div>
  );
};

export default SortButtons;
