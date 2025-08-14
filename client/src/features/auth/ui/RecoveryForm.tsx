import React from 'react';
import Image from "next/image";
import HorizontalLine from "@/shared/ui/HorizontalLine";
import { Alert, Fade, TextField } from "@mui/material";
import ArrowBackIconCart from "@/shared/ui/ArrowBackIcon";
import CloseIconCart from "@/shared/ui/CloseIcon";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { emailValidation } from "@/shared/lib/validation";
import { useRequestPasswordResetMutation } from '@/features/auth/api/auth.api';
import { useClickOutside } from '@/shared/lib/hooks/useClickOutside';
import { closeModalAuth } from '@/features/auth/model/auth.slice';
import { PasswordResetRequest } from '@/features/auth/model/auth.types';
import MainButton from '../../../shared/ui/Button/MainButton';

interface ErrorResponse {
  message: string;
}

const RecoveryForm = () => {
  const dispatch = useDispatch()
  const [requestPasswordReset, { isLoading: isLoadingRequestReset, isSuccess: isSuccessRequestReset, error: errorRequestReset }] = useRequestPasswordResetMutation()
  const modalRef = useClickOutside(() => {
    dispatch(closeModalAuth());
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordResetRequest>({ mode: 'onBlur' });


  const onSubmit = async (data: PasswordResetRequest) => {
    try {
      await requestPasswordReset(data).unwrap();
      setTimeout(() => {
        dispatch(closeModalAuth());
      }, 5000);
    } catch (error) {
      console.error('Ошибка при отправке запроса:', error);
    }
  }
  return (
    <Fade
      in={true}
      timeout={700}
    >
      <div ref={modalRef}
        className={`w-[413px] pb-[28px] bg-white drop-shadow-lg inset-0 relative flex flex-col items-center justify-start pt-[31px]`}
      >
        <ArrowBackIconCart />
        <CloseIconCart />
        <Image src='/assets/img/Login/lock.svg' alt='Logo' width={16} height={18} className='mb-[20px]' />
        <div className='mb-[25px] flex items-center justify-center'>
          <HorizontalLine width='100px' />
          <p className="font-medium text-[#0000004D] px-[12px] ">Востановление пароля</p>
          <HorizontalLine width='100px' />
        </div>
        <form className='flex flex-col w-[359px]' onSubmit={handleSubmit(onSubmit)}>
          {isSuccessRequestReset ? (
            <Fade in={true} timeout={700}>
              <p className="text-center">
                На указанный вами адрес было отправлено письмо с инструкциями по восстановлению пароля
              </p>
            </Fade>
          ) : (
            <>
              <label htmlFor="email" className='font-medium text-[14px] text-[#00000099] pl-[19px]'>Ваш E-mail</label>
              <TextField
                {...register('email', emailValidation)}
                error={!!errors.email}
                helperText={errors.email?.message}
                sx={{ height: '48px', marginBottom: '40px' }}
                id='email'
                variant="outlined"
                color='primary'
                fullWidth
                margin="normal"
              />
              {errorRequestReset && (
                <Alert severity='error' sx={{ mb: 2 }}>
                  {'data' in errorRequestReset ? (errorRequestReset.data as ErrorResponse)?.message : 'Произошла ошибка'}
                </Alert>
              )}
              <MainButton text='Восстановить' disabled={isLoadingRequestReset || isSuccessRequestReset} onClick={handleSubmit(onSubmit)} type='submit' width='358px' height='56px' />
            </>
          )}
        </form>
      </div>
    </Fade>
  )
};

export default RecoveryForm;