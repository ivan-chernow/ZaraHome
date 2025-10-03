// client/src/entities/favorite/ui/FavoritesEmptyState.tsx
'use client';

import React, { memo } from 'react';

export const FavoritesEmptyState: React.FC = memo(() => {
  return (
    <div
      className={`text-center py-12 `}
      role="region"
      aria-label="Пустое состояние избранного"
    >
      {/* Иконка сердца */}
      <div className="mb-6" aria-hidden="true">
        <svg
          className="mx-auto w-16 h-16 text-gray-400 transition-colors duration-300 hover:text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Иконка избранного"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </div>

      {/* Заголовок */}
      <h3 className="text-xl font-medium text-gray-600 mb-2">
        У вас пока нет избранных товаров
      </h3>

      {/* Описание */}
      <p className="text-gray-400 mb-6 max-w-md mx-auto leading-relaxed">
        Добавляйте товары в избранное, чтобы вернуться к ним позже
      </p>

      {/* Дополнительная подсказка */}
      <p className="text-sm text-gray-400 mt-4">
        💡 Нажимайте на ♡ рядом с товарами, чтобы добавить их в избранное
      </p>
    </div>
  );
});

// displayName не нужен - React автоматически использует имя функции

export default FavoritesEmptyState;
