'use client';

import React from 'react';
import NewClothes from '@/widgets/new-clothes/ui/NewClothes';
import Catalog from '@/widgets/catalog/ui/Catalog';
import WhyUs from '@/widgets/why-us/ui/WhyUs';
import Question from '@/widgets/Question';
import Help from '@/widgets/help/ui/Help';

const App: React.FC = () => {
  return (
    <main role="main" aria-label="Главная страница">
      <section aria-label="Новые товары">
        <NewClothes />
      </section>
      <section aria-label="Каталог товаров">
        <Catalog />
      </section>
      <section aria-label="Почему выбирают нас">
        <WhyUs />
      </section>
      <section aria-label="Часто задаваемые вопросы">
        <Question />
      </section>
      <section aria-label="Помощь и поддержка">
        <div className="flex justify-center pb-[100px]">
          <Help title="Не нашли ответ на свой вопрос?" style="justify-end" />
        </div>
      </section>
    </main>
  );
};

export { App };
