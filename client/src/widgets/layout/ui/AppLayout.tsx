'use client';

import React from 'react';
import { AppProviders } from './AppProviders';
import { AppContent } from './AppContent';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = React.memo(
  ({ children }) => {
    return (
      <AppProviders>
        <AppContent>{children}</AppContent>
      </AppProviders>
    );
  }
);

AppLayout.displayName = 'AppLayout';
