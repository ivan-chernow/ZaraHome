'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import {
  selectCartTotalCount,
  selectCartTotalPrice,
} from '@/entities/cart/model/cartItems.slice';
import MainButton from '@/shared/ui/Button/MainButton';
import HorizontalLine from '@/shared/ui/HorizontalLine';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

interface CartSummaryProps {
  onCheckout: () => void;
  isCheckoutLoading?: boolean;
  isAuthenticated: boolean;
  onLoginRequired: () => void;
}

/**
 * Компонент итогов корзины с кнопкой оформления заказа
 * Отображает общую стоимость, количество товаров и кнопку оформления
 */
export const CartSummary: React.FC<CartSummaryProps> = ({
  onCheckout,
  isCheckoutLoading = false,
  isAuthenticated,
  onLoginRequired,
}) => {
  const totalCount = useSelector(selectCartTotalCount);
  const totalPrice = useSelector(selectCartTotalPrice);

  const handleCheckoutClick = () => {
    if (!isAuthenticated) {
      onLoginRequired();
      return;
    }
    onCheckout();
  };

  if (totalCount === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Итого по заказу
      </h3>

      <div className="space-y-3">
        {/* Количество товаров */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">
            Товаров ({totalCount} {getItemsWord(totalCount)})
          </span>
          <span className="font-medium">{totalPrice.toLocaleString()} ₽</span>
        </div>

        {/* Доставка */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Доставка</span>
          <span className="text-green-600 font-medium">Бесплатно</span>
        </div>

        <HorizontalLine />

        {/* Итого */}
        <div className="flex justify-between text-lg font-semibold">
          <span>К оплате:</span>
          <span className="text-blue-600">{totalPrice.toLocaleString()} ₽</span>
        </div>
      </div>

      {/* Кнопка оформления заказа */}
      <div className="mt-6">
        <MainButton
          onClick={handleCheckoutClick}
          disabled={isCheckoutLoading || totalCount === 0}
          className="w-full"
        >
          {isCheckoutLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Оформляем заказ...
            </div>
          ) : !isAuthenticated ? (
            <div className="flex items-center justify-center">
              <LockOutlinedIcon className="w-4 h-4 mr-2" />
              Войти для оформления
            </div>
          ) : (
            'Оформить заказ'
          )}
        </MainButton>
      </div>

      {/* Информация о безопасности */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        <div className="flex items-center justify-center mb-1">
          <LockOutlinedIcon className="w-3 h-3 mr-1" />
          Безопасная оплата
        </div>
        <p>Ваши данные защищены SSL-шифрованием</p>
      </div>

      {/* Дополнительная информация */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="space-y-2 text-xs text-gray-500">
          <div className="flex items-center justify-between">
            <span>🚚 Доставка по Москве</span>
            <span className="text-green-600">1-2 дня</span>
          </div>
          <div className="flex items-center justify-between">
            <span>📦 Самовывоз</span>
            <span className="text-green-600">Сегодня</span>
          </div>
          <div className="flex items-center justify-between">
            <span>💳 Оплата при получении</span>
            <span className="text-green-600">Доступно</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Вспомогательная функция для склонения слова "товар"
 */
const getItemsWord = (count: number): string => {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return 'товаров';
  }

  switch (lastDigit) {
    case 1:
      return 'товар';
    case 2:
    case 3:
    case 4:
      return 'товара';
    default:
      return 'товаров';
  }
};

export default CartSummary;
