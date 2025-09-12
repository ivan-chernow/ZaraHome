import React from 'react';
import Image from 'next/image';

const CartEmpty: React.FC = () => {
  return (
    <div className="w-full max-w-[360px] h-full bg-white shadow-xl flex flex-col z-100">
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="mb-2">
          <Image
            src="/assets/img/Cart/empty-cart.png"
            alt="Пустая корзина"
            width={160}
            height={160}
            quality={100}
            className="opacity-90"
          />
        </div>
        <h3 className="text-lg font-medium text-gray-700 mb-2">
          Ваша корзина пуста
        </h3>
        <p className="text-gray-500 mb-6">Добавьте товары из каталога</p>
      </div>
    </div>
  );
};

export default CartEmpty;
