'use client';

import React from 'react';

const PaymentPageContent: React.FC = () => {
  return (
    <div className="max-w-[1200px] mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Оплата</h1>
      <div className="prose max-w-none">
        <p>Здесь будет содержимое страницы оплаты.</p>
      </div>
    </div>
  );
};

export { PaymentPageContent };
export default PaymentPageContent;
