'use client'
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'next/navigation';
import { Container, TextField, Alert } from '@mui/material';
import MainLayout from '@/widgets/layout/MainLayout';
import { useResetPasswordMutation, useVerifyResetTokenMutation } from '@/features/auth/api/auth.api';
import { useForm } from 'react-hook-form';
import { getRepeatPasswordValidation, getPasswordValidation } from '@/shared/lib/validation';
import MainButton from '@/shared/ui/Button/MainButton';
import { useRouter } from 'next/navigation';
import { closeModalAuth } from '@/features/auth/model/auth.slice';

interface FormInputs {
  password: string;
  repeatPassword: string;
}

interface ErrorResponse {
  data: {
    message: string;
  };
}

const ResetPasswordPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [isTokenVerified, setIsTokenVerified] = useState(false);
  const [error, setError] = useState<string>('');

  const [verifyToken] = useVerifyResetTokenMutation();
  const [resetPassword, { isLoading: isLoadingResetPassword, isSuccess: isSuccessResetPassword }] = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    getValues,
    watch,
    formState: { errors },
  } = useForm<FormInputs>({
    mode: 'onChange',
    defaultValues: {
      password: '',
      repeatPassword: ''
    }
  });

  const password = watch('password');
  const repeatPassword = watch('repeatPassword');

  useEffect(() => {
    // Закрываем модальное окно авторизации/регистрации, если открыто
    dispatch(closeModalAuth());

    const verifyResetToken = async () => {
      if (!token) {
        setError('Неверная ссылка для сброса пароля');
        return;
      }

      try {
        await verifyToken({ token }).unwrap();
        setIsTokenVerified(true);
      } catch (err) {
        const error = err as ErrorResponse;
        setError(error.data?.message || 'Ссылка для сброса пароля недействительна или истекла');
      }
    };

    verifyResetToken();
  }, [token, verifyToken, dispatch]);

  const onSubmit = async (data: FormInputs) => {
    if (!token) return;

    try {
      await resetPassword({ token, password: data.password }).unwrap();
      setTimeout(() => {
        router.push('/');
      }, 5000);
    } catch (err) {
      const error = err as ErrorResponse;
      setError(error.data?.message || 'Ошибка при сбросе пароля');
    }
  };

  if (!token) {
    return (
      <MainLayout>
        <Container maxWidth="sm" sx={{ mt: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Alert severity="error">Неверная ссылка для сброса пароля</Alert>
        </Container>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <Container maxWidth="sm" sx={{ mt: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Container>
      </MainLayout>
    );
  }

  if (!isTokenVerified) {
    return (
      <MainLayout>
        <Container maxWidth="sm" sx={{ mt: 4 }}>
          <Alert severity="info">Проверка ссылки...</Alert>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container maxWidth="sm" sx={{ 
        mt: 4,
        minHeight: 'calc(100vh - 200px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {!isSuccessResetPassword ? (
          <div className="flex flex-col items-center w-full">
            <h1 className="text-2xl font-medium mb-6">Создание нового пароля</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md">
              <div className="flex flex-col gap-4">
                <TextField
                  label="Новый пароль"
                  type="password"
                  {...register('password', getPasswordValidation())}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  fullWidth
                />
                <TextField
                  label="Повторите пароль"
                  type="password"
                  {...register('repeatPassword', getRepeatPasswordValidation(getValues))}
                  error={!!errors.repeatPassword}
                  helperText={errors.repeatPassword?.message}
                  fullWidth
                />
                <MainButton
                  text="Сохранить новый пароль"
                  type="submit"
                  disabled={isLoadingResetPassword || isSuccessResetPassword || !password || !repeatPassword || !!errors.password || !!errors.repeatPassword}
                  onClick={handleSubmit(onSubmit)}
                />
              </div>
            </form>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl font-medium mb-6">Пароль успешно изменен</h1>
            <p className="text-sm text-gray-500">Вы будете перенаправлены на главную страницу через 5 секунд</p>
          </div>
        )}
      </Container>
    </MainLayout>
  );
};

export default ResetPasswordPage; 