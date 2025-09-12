'use client';
import React from 'react';
import Image from 'next/image';
import HorizontalLine from '../../../shared/ui/HorizontalLine';

interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Что хотите найти?',
}) => {
  return (
    <div className="w-full">
      <div className="relative flex h-full w-full items-center">
        <Image
          src="/assets/img/Header/search_nav-menu.png"
          alt="search"
          width={30}
          height={30}
          className="absolute left-0"
        />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full border-none bg-transparent px-10 py-[20px] text-center font-normal
           text-black drop-shadow-md outline-none placeholder:!text-[24px] placeholder:text-[#00000033]
           !text-[24px]"
        />
      </div>
      <HorizontalLine width="100%" />
    </div>
  );
};

export default SearchInput;
