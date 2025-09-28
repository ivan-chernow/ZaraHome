'use client';
import React from 'react';
import LoginForm from '@/features/auth/ui/LoginForm';
import RegisterForm from '@/features/auth/ui/RegisterForm';
import { RootState } from '@/shared/config/store/store';
import RecoveryForm from '@/features/auth/ui/RecoveryForm';
import { useSelector } from 'react-redux';

const LoginModal = React.memo(() => {
  const { view } = useSelector((state: RootState) => state.auth);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-[#FFFFFFF2] backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div>
        {view === 'login' && <LoginForm />}
        {view === 'signup' && <RegisterForm />}
        {view === 'resetPassword' && <RecoveryForm />}
      </div>
    </div>
  );
});

LoginModal.displayName = 'LoginModal';

export default LoginModal;
