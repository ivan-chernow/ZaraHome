'use client';

import React from 'react';
import {
  openModalAuth,
  setView,
  logout,
} from '@/features/auth/model/auth.slice';
import { useDispatch } from 'react-redux';

export const useAuthActions = () => {
  const dispatch = useDispatch();

  const handleLogin = () => {
    dispatch(setView('login'));
    dispatch(openModalAuth());
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return { handleLogin, handleLogout };
};
