'use client'
import React from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import HorizontalLine from "@/components/ui/HorizontalLine";
import {
  Slide,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Alert
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import CloseIconCart from "@/components/CloseIcon";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useForm } from "react-hook-form";
import { emailValidation, getPasswordValidation } from "@/vaildation/validation";
import { closeModalAuth, setView, toggleViewPassword, setAuthenticating, setCredentials } from '@/store/features/auth/auth.slice';
import { RootState } from '@/store/store';
import { useLoginMutation } from '@/api/auth.api';
import { LoginRequest } from '@/api/types/auth.types';
import MainButton from '../Button/MainButton';

const LoginForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const viewPassword = useSelector((state: RootState) => state.auth.viewPassword);
  const [login, { isLoading, error: loginError }] = useLoginMutation();

  const modalRef = useClickOutside(() => {
    dispatch(closeModalAuth());
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<LoginRequest>({
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: LoginRequest) => {
    try {
      dispatch(setAuthenticating(true));
      const response = await login(data).unwrap();
      
      // Сохраняем токен в localStorage
      const accessToken = response.accessToken.trim();
      localStorage.setItem('accessToken', accessToken);
      
      // Обновляем состояние Redux
      dispatch(setCredentials({
        user: response.user,
        accessToken: accessToken
      }));

      reset();
      dispatch(closeModalAuth());

      const path = response.user.role === 'admin' 
        ? '/profile/admin' 
        : response.user.role === 'user' 
          ? '/profile' 
          : '/';

      await new Promise(resolve => setTimeout(resolve, 100));
      router.push(path);
      
      setTimeout(() => {
        dispatch(setAuthenticating(false));
      }, 500);
    } catch (error) {
      dispatch(setAuthenticating(false));
      console.error('Ошибка при входе:', error);
    }
  };

  return (
    <Slide
      in={true}
      direction="down"
      timeout={500}
    >
      <div>
        <div
          className={`w-[413px] pb-[28px] bg-white drop-shadow-lg inset-0 relative flex flex-col items-center justify-start pt-[31px]`}
          ref={modalRef}
        >
          <CloseIconCart />
          <Image src='/assets/img/Header/user.svg' alt='Logo' width={19} height={20} className='mb-[20px]' />
          <div className='mb-[25px] flex items-center justify-center'>
            <HorizontalLine width='125px' />
            <p className="font-medium text-[#0000004D] px-[12px]">Войти</p>
            <HorizontalLine width='125px' />
          </div>
          <form className='flex flex-col w-[359px]'
            onSubmit={handleSubmit(onSubmit)}
          >
            <label htmlFor="email" className='font-medium text-[14px] text-[#00000099] pl-[19px]'>Ваш E-mail</label>

            <TextField
              {...register('email', emailValidation)}
              error={!!errors.email}
              helperText={errors.email?.message}
              sx={{ height: '48px' }}
              id='email'
              variant="outlined"
              color='primary'
              fullWidth
              margin="normal"
              disabled={isLoading}
            />

            <label htmlFor="password" className='font-medium text-[14px] text-[#00000099] pl-[19px] mt-[25px]'>
              Пароль
            </label>
            <TextField
              {...register('password', getPasswordValidation())}
              sx={{ height: '48px', marginBottom: '40px' }}
              type={viewPassword ? 'text' : 'password'}
              id='password'
              variant="outlined"
              fullWidth
              margin="normal"
              disabled={isLoading}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip
                        arrow
                        placement="top"
                        title=''
                      >
                        <IconButton
                          aria-label="Переключить видимость пароля"
                          onClick={() => dispatch(toggleViewPassword())}
                          edge="end"
                          sx={{
                            color: '#0000008A',
                            '&:hover': {
                              backgroundColor: 'rgba(0, 0, 0, 0.04)'
                            }
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
                }
              }}
            />
            <MainButton text='Войти' disabled={isLoading} onClick={handleSubmit(onSubmit)} type='submit' width='358px' height='56px' />
            {loginError && (
              <Alert severity="error" sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                {'data' in loginError ? (loginError.data as ErrorResponse['data']).message : 'Ошибка при входе'}
              </Alert>
            )}
          </form>
          <p
            className="underline mt-[13px] cursor-pointer hover:no-underline hover:text-gray-500 transition-all ease-in-out duration-200"
            onClick={() => dispatch(setView('resetPassword'))}>Забыли свой
            пароль?</p>
          <div className='mb-[18px] flex items-center justify-center mt-[26px]'>
            <HorizontalLine width='121px' />
            <p className="font-medium text-[#0000004D] mx-[12px]"
            >Регистрация</p>
            <HorizontalLine width='119px' />
          </div>
          <div className='w-[359px]'>
            <MainButton text='Зарегистрироваться' disabled={isLoading} onClick={() => dispatch(setView('signup'))} type='button' width='358px' height='56px' />
          </div>
        </div>
      </div>
    </Slide>
  );
};

export default LoginForm;