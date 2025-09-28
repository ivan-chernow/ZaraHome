'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../config/store/store';

export const Providers: React.FC<{ children: React.ReactNode }> = React.memo(
  ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
  }
);

Providers.displayName = 'Providers';
