'use client';

import React from 'react';
import CartDetails from '@/entities/cart/ui/cartDetails';

interface EntityCartDetailsProps {
  cartButtonRef: React.RefObject<HTMLDivElement>;
}

export const EntityCartDetails: React.FC<EntityCartDetailsProps> = ({
  cartButtonRef,
}) => {
  return <CartDetails cartButtonRef={cartButtonRef} />;
};
