'use client';

import React from 'react';
import VerticalLine from '@/shared/ui/VerticalLine';
import Logo from '@/shared/ui/Logo';

export const SharedVerticalLine: React.FC<{ height: string }> = ({
  height,
}) => {
  return <VerticalLine height={height} />;
};

export const SharedLogo: React.FC = () => {
  return <Logo />;
};
