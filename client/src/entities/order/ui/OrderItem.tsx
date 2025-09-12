'use client';

import React from 'react';
import Image from 'next/image';
import type { Product } from '@/entities/product/api/products.api';

interface OrderItemProps {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
  product?: Product;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const getFullImageUrl = (path?: string): string | undefined => {
  if (!path) return undefined;
  try {
    const cleanPath = path.replace(/^\/+/, '');
    return `${API_URL}/${cleanPath}`;
  } catch {
    return path;
  }
};

const OrderItem: React.FC<OrderItemProps> = ({
  productId,
  productName,
  quantity,
  price,
  size,
  color,
  product,
}) => {
  return (
    <div className="flex items-center py-3 border-b border-[#f0f0f0] last:border-b-0">
      {/* Изображение товара */}
      <div className="w-[79px] h-[79px] mr-4 flex-shrink-0">
        <Image
          alt={product?.name_ru || productName || `img-${productId}`}
          src={
            getFullImageUrl(product?.img?.[0]) ||
            '/assets/img/Catalog/product2.png'
          }
          width={79}
          height={79}
          className="rounded object-cover w-full h-full"
        />
      </div>

      {/* Информация о товаре */}
      <div className="flex flex-col flex-1 min-w-0">
        {product ? (
          <>
            <h4 className="font-bold text-[15px] leading-4 mb-[2px] truncate uppercase text-gray-800">
              {product.name_eng}
            </h4>
            <p className="font-medium text-[#00000080] text-[13px] leading-4 truncate mb-2">
              {product.name_ru}
            </p>
          </>
        ) : (
          <>
            <h4 className="font-bold text-[15px] leading-4 mb-[2px] truncate uppercase text-gray-800">
              {productName}
            </h4>
            <p className="font-medium text-[#00000080] text-[13px] leading-4 truncate mb-2">
              Товар #{productId}
            </p>
          </>
        )}

        {/* Дополнительные характеристики */}
        <div className="flex flex-wrap gap-2">
          <span className="bg-gray-100 px-2 py-1 rounded text-[13px] text-gray-600">
            Количество: {quantity}
          </span>
          <span className="bg-gray-100 px-2 py-1 rounded text-[13px] text-gray-600">
            Цена: {price.toLocaleString('ru-RU')} ₽
          </span>
          {size && size.trim() && (
            <span className="bg-blue-100 px-2 py-1 rounded text-[13px] text-blue-700">
              Размер: {size}
            </span>
          )}
          {color && color.trim() && (
            <span className="bg-purple-100 px-2 py-1 rounded text-[13px] text-purple-700">
              Цвет: {color}
            </span>
          )}
        </div>
      </div>

      {/* Общая стоимость */}
      <div className="flex flex-col items-end min-w-[100px] flex-shrink-0">
        <span className="font-roboto font-semibold text-[20px] text-gray-800">
          {(price * quantity).toLocaleString('ru-RU')} ₽
        </span>
        <span className="text-[12px] text-gray-500">
          за {quantity} {quantity === 1 ? 'шт.' : 'шт.'}
        </span>
      </div>
    </div>
  );
};

export default OrderItem;
