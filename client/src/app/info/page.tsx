import React from 'react';
import DeliveryTimeline from '@/shared/ui/DeliveryTimeline';
import MainLayout from '@/widgets/layout/MainLayout';

const InfoPage: React.FC = () => {
  return (
    <MainLayout>
      <DeliveryTimeline />
    </MainLayout>
  );
};

export default InfoPage;
