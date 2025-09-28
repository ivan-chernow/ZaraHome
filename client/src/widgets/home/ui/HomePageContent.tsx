import React from 'react';
import NewClothes from '@/widgets/new-clothes/ui/NewClothes';
import Catalog from '@/widgets/catalog/ui/Catalog';
import WhyUs from '@/widgets/why-us/ui/WhyUs';
import Question from '@/widgets/Question';
import Help from '@/widgets/help/ui/Help';

export const HomePageContent: React.FC = React.memo(() => {
  return (
    <>
      <NewClothes />
      <Catalog />
      <WhyUs />
      <Question />
      <div className="flex justify-center pb-[100px]">
        <Help title="Не нашли ответ на свой вопрос?" style="justify-end" />
      </div>
    </>
  );
});

HomePageContent.displayName = 'HomePageContent';

export default HomePageContent;
