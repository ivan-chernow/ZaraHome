'use client';

import React from 'react';
import MainLayout from '@/widgets/layout/MainLayout';
import { HomePageContent } from '@/widgets/home/ui/HomePageContent';

const Home: React.FC = () => (
  <MainLayout>
    <HomePageContent />
  </MainLayout>
);

export default Home;