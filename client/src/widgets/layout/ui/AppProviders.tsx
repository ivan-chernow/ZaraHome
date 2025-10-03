'use client';

import React from 'react';
import { Providers } from '@/shared/providers/StoreProvider';

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return <Providers>{children}</Providers>;
};
