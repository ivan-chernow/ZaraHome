'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import HorizontalLine from '@/shared/ui/HorizontalLine';
import {
  Slide,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Alert,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import CloseIconCart from '@/shared/ui/CloseIcon';
import { useClickOutside } from '@/shared/lib/hooks/useClickOutside';
import { useForm } from 'react-hook-form';
import {
  emailValidation,
  getPasswordValidation,
} from '@/shared/lib/validation';
import {
  closeModalAuth,
  setView,
  toggleViewPassword,
  setAuthenticating,
} from '@/features/auth/model/auth.slice';
import { RootState } from '@/shared/config/store/store';
import { useLoginMutation } from '@/features/auth/api/auth.api';
import { LoginRequest } from '@/features/auth/model/auth.types';
import MainButton from '../../../shared/ui/Button/MainButton';

// Тип для ошибки API
interface ApiError {
  data: {
    message: string;
  };
}

const LoginForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const viewPassword = useSelector(
    (state: RootState) => state.auth.viewPassword
  );
  const [login, { isLoading, error: loginError }] = useLoginMutation();

  const modalRef = useClickOutside(() => {
    dispatch(closeModalAuth());
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginRequest>({
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginRequest) => {
    try {
      dispatch(setAuthenticating(true));

      const response = await login(data).unwrap();

      reset();
      dispatch(closeModalAuth());

      // Определяем путь для перехода в зависимости от роли пользователя
      const path =
        response.user.role === 'admin'
          ? '/profile/admin'
          : response.user.role === 'user'
            ? '/profile'
            : '/';

      // Переходим в личный кабинет через Next.js router
      router.push(path);

      setTimeout(() => {
        dispatch(setAuthenticating(false));
      }, 500);
    } catch {
      dispatch(setAuthenticating(false));
      // Ошибка будет показана через loginError в UI
    }
  };

  return (
    <Slide in={true} direction="down" timeout={500}>
      <div>
        <div
          className={`w-[413px] pb-[28px] bg-white drop-shadow-lg inset-0 relative flex flex-col items-center justify-start pt-[31px]`}
          ref={modalRef}
        >
          <CloseIconCart />
          <Image
            src="/assets/img/Header/user.svg"
            alt="Logo"
            width={19}
            height={20}
            className="mb-[20px]"
          />
          <div className="mb-[25px] flex items-center justify-center">
            <HorizontalLine width="125px" />
            <p className="font-medium text-[#0000004D] px-[12px]">Войти</p>
            <HorizontalLine width="125px" />
          </div>
          <form
            className="flex flex-col w-[359px]"
            onSubmit={handleSubmit(onSubmit)}
          >
            <label
              htmlFor="email"
              className="font-medium text-[14px] text-[#00000099] pl-[19px]"
            >
              Ваш E-mail
            </label>

            <TextField
              {...register('email', emailValidation)}
              error={!!errors.email}
              helperText={errors.email?.message}
              sx={{ height: '48px' }}
              id="email"
              variant="outlined"
              color="primary"
              fullWidth
              margin="normal"
              disabled={isLoading}
            />

            <label
              htmlFor="password"
              className="font-medium text-[14px] text-[#00000099] pl-[19px] mt-[25px]"
            >
              Пароль
            </label>
            <TextField
              {...register('password', getPasswordValidation())}
              sx={{ height: '48px', marginBottom: '40px' }}
              type={viewPassword ? 'text' : 'password'}
              id="password"
              variant="outlined"
              fullWidth
              margin="normal"
              disabled={isLoading}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip arrow placement="top" title="">
                        <IconButton
                          aria-label="Переключить видимость пароля"
                          onClick={() => dispatch(toggleViewPassword())}
                          edge="end"
                          sx={{
                            color: '#0000008A',
                            '&:hover': {
                              backgroundColor: 'rgba(0, 0, 0, 0.04)',
                            },
                          }}
                          disabled={isLoading}
                        >
                          {viewPassword ? (
                            <VisibilityOff fontSize="small" />
                          ) : (
                            <Visibility fontSize="small" />
                          )}
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ),
                },
              }}
            />
            <MainButton
              text="Войти"
              disabled={isLoading}
              type="submit"
              width="358px"
              height="56px"
            />
            {loginError && (
              <Alert
                severity="error"
                sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
              >
                {'data' in loginError
                  ? (loginError.data as ApiError['data']).message
                  : 'Ошибка при входе'}
              </Alert>
            )}
          </form>
          <p
            className="underline mt-[13px] cursor-pointer hover:no-underline hover:text-gray-500 transition-all ease-in-out duration-200"
            onClick={() => dispatch(setView('resetPassword'))}
          >
            Забыли свой пароль?
          </p>
          <div className="mb-[18px] flex items-center justify-center mt-[26px]">
            <HorizontalLine width="121px" />
            <p className="font-medium text-[#0000004D] mx-[12px]">
              Регистрация
            </p>
            <HorizontalLine width="119px" />
          </div>
          <div className="w-[359px]">
            <MainButton
              text="Зарегистрироваться"
              disabled={isLoading}
              onClick={() => dispatch(setView('signup'))}
              type="button"
              width="358px"
              height="56px"
            />
          </div>
        </div>
      </div>
    </Slide>
  );
};

export default LoginForm;
