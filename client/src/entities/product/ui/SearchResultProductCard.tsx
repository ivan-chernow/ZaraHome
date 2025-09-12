'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Product } from '@/entities/product/api/products.api';
import { useDispatch } from 'react-redux';
import { closeAllMenus } from '@/widgets/nav-menu/model/navMenu.slice';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface SearchResultProductCardProps {
  product: Product;
  searchText: string;
}

const SearchResultProductCard: React.FC<SearchResultProductCardProps> = ({
  product,
  searchText,
}) => {
  const dispatch = useDispatch();
  const getHighlightedText = (text: string, highlight: string) => {
    if (!highlight.trim()) {
      return <span>{text}</span>;
    }
    const words = text.split(' ');
    const lowercasedHighlight = highlight.toLowerCase();

    return (
      <span className="text-sm text-gray-600">
        {words.map((word, i) => {
          if (word.toLowerCase().startsWith(lowercasedHighlight)) {
            const matchedPart = word.slice(0, highlight.length);
            const restOfWord = word.slice(highlight.length);
            return (
              <React.Fragment key={i}>
                <span className="bg-black text-white px-1">{matchedPart}</span>
                <span>{restOfWord}</span>
                {i < words.length - 1 && ' '}
              </React.Fragment>
            );
          }
          return (
            <React.Fragment key={i}>
              {word}
              {i < words.length - 1 && ' '}
            </React.Fragment>
          );
        })}
      </span>
    );
  };

  return (
    <Link
      href={`/products/${product.id}`}
      onClick={() => dispatch(closeAllMenus())}
    >
      <motion.div
        className="group cursor-pointer"
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-start space-x-4">
          <div className="relative w-32 shrink-0 bg-gray-100">
            <Image
              src={`${API_URL}${product.img[0]}`}
              alt={product.name_ru}
              width={116}
              height={116}
              className=" object-cover transition-transform duration-300 group-hover:scale-105 w-[116px] h-[116px]"
            />
          </div>

          <div className="flex flex-col items-start pt-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800">
              {product.name_eng}
            </h3>
            <div className="mt-1">
              {getHighlightedText(product.name_ru, searchText)}
            </div>
            <div className="mt-2">
              <span className="text-lg font-bold text-gray-900">
                {Object.values(product.size)
                  .find(s => s.price)
                  ?.price?.toLocaleString('ru-RU')}{' '}
                ₽
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default SearchResultProductCard;
