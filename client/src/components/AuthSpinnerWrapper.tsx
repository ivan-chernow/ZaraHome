'use client'
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import AuthSpinner from './AuthSpinner';

export default function AuthSpinnerWrapper() {
  const isAuthenticating = useSelector((state: RootState) => state.auth.isAuthenticating);
  
  return isAuthenticating ? <AuthSpinner /> : null;
} 