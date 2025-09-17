"use client";

import React from 'react';
import MainLayout from '@/widgets/layout/MainLayout';
import { CartPageContent } from '@/widgets/cart/ui/CartPageContent';

const CartPage: React.FC = () => (
    <MainLayout>
    <CartPageContent />
    </MainLayout>
  );

export default CartPage;
