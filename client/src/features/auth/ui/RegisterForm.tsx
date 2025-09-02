'use client'
import React from 'react';
import HorizontalLine from '@/shared/ui/HorizontalLine';
import Image from 'next/image';
import { Fade, TextField, Alert } from '@mui/material';
import CloseIconCart from '@/shared/ui/CloseIcon';
import ArrowBackIconCart from '@/shared/ui/ArrowBackIcon';
import { useDispatch } from 'react-redux';
import { emailValidation, getRepeatPasswordValidation, getPasswordValidation } from '@/shared/lib/validation';
import { useForm } from 'react-hook-form';
import { useCompleteRegistrationMutation, useInitiateRegistrationMutation, useVerifyCodeMutation } from '@/features/auth/api/auth.api';
import { closeModalAuth } from '@/features/auth/model/auth.slice';
import { useClickOutside } from '@/shared/lib/hooks/useClickOutside';
import { useVerificationCode } from '@/shared/lib/hooks/useVerificationCode';
import MainButton from '../../../shared/ui/Button/MainButton';

interface FormInputs {
  email: string;
  password: string;
  repeatPassword: string;
}

interface ErrorData {
  message: string;
}

const RegisterForm = () => {
  const dispatch = useDispatch();
  const { code, setCode, codeRefs, handleInputChange, handlePaste, handleKeyDown } = useVerificationCode();

  const [initiateRegistration, {
    isLoading: isInitiateLoading,
    isSuccess: isInitiateSuccess,
    error: initiateError,
    reset: resetInitiateRegistration
  }] = useInitiateRegistrationMutation();

  const [verifyCode, {
    isSuccess: isVerifySuccess,
    data: verifyData,
    error: verifyError,
    reset: resetVerifyCode,
  }] = useVerifyCodeMutation();

  const [completeRegistration, {
    isLoading: isCompleteLoading,
    isSuccess: isCompleteSuccess,
  }] = useCompleteRegistrationMutation();

  const modalRef = useClickOutside(() => {
    dispatch(closeModalAuth());
    resetInitiateRegistration();
    resetVerifyCode();
    setCode(Array(6).fill(''));
  });

  const {
    register,
    handleSubmit,
    getValues,
    watch,
    formState: { errors },
  } = useForm<FormInputs>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      repeatPassword: ''
    }
  });

  const password = watch('password');
  const repeatPassword = watch('repeatPassword');

  const onSubmitInitiateRegistration = async () => {
    try {
      const email = getValues('email');
      await initiateRegistration({ email }).unwrap();
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
    }
  };

  const handleVerify = async () => {
    const verificationCode = code.join('');
    try {
      if (verificationCode.length === 6) {
        const email = getValues('email');
        await verifyCode({ email, code: verificationCode }).unwrap();
      }
    } catch (error) {
      console.error('Ошибка при проверке кода:', error);
    }
  };

  const handleSetPassword = async () => {
    try {
      const password = getValues('password');
      const sessionToken = (verifyData as any)?.sessionToken;
      if (!sessionToken) {
        throw new Error('Session token отсутствует. Сначала подтвердите код.');
      }
      const res = await completeRegistration({ sessionToken, password }).unwrap();
      if (res.success) {
        setTimeout(() => {
          dispatch(closeModalAuth());
        }, 7000);
      }
    } catch (error) {
      console.error('Ошибка при установке пароля:', error);
    }
  };

  return (
    <Fade in={true} timeout={700}>
      <div>
        <div ref={modalRef} className='w-[413px] pb-[28px] bg-white drop-shadow-lg inset-0 relative flex flex-col items-center justify-start pt-[31px]'>
          <ArrowBackIconCart />
          <CloseIconCart />
          <Image src='/assets/img/Header/user.svg' alt='Logo' width={19} height={20} className='mb-[20px]' />
          <div className='mb-[25px] flex items-center justify-center'>
            <HorizontalLine width='125px' />
            <p className='font-medium text-[#0000004D] px-[12px]'>Регистрация</p>
            <HorizontalLine width='125px' />
          </div>
          <form
            onSubmit={handleSubmit(onSubmitInitiateRegistration)}
            className='flex flex-col w-[359px]'
          >
            {!isInitiateSuccess ? (
              <>
                <label htmlFor='email' className='font-medium text-[14px] text-[#00000099] pl-[19px]'>Ваш E-mail</label>
                <TextField
                  {...register('email', emailValidation)}
                  error={!!errors.email || !!initiateError}
                  helperText={errors.email?.message || (initiateError && 'data' in initiateError ? (initiateError.data as ErrorData)?.message : '')}
                  disabled={isInitiateLoading}
                  sx={{
                    height: '48px',
                    marginBottom: initiateError ? '65px' : '40px'
                  }}
                  id='email'
                  variant='outlined'
                  color='primary'
                  fullWidth
                  margin='normal'
                />
                <MainButton
                  text='Регистрация'
                  disabled={isInitiateLoading || isInitiateSuccess} onClick={handleSubmit(onSubmitInitiateRegistration)} type='submit' width='358px' height='56px'
                />
              </>
            ) : !isVerifySuccess ? (
              <Fade in={true} timeout={700}>
                <div>
                  <p className='mb-[26px] text-center'>На указанный вами адрес было отправлено письмо с проверочным кодом</p>
                  <div className='mb-[20px] flex justify-center'>
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <TextField
                        key={index}
                        inputRef={(el) => (codeRefs.current[index] = el)}
                        value={code[index]}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        inputProps={{
                          maxLength: 1,
                          style: { textAlign: 'center' },
                          inputMode: 'numeric',
                          pattern: '[0-9]*',
                        }}
                        sx={{
                          width: '49px',
                          height: '48px',
                          marginRight: index < 5 ? '13px' : 0,
                          '& .MuiInputBase-input': { textAlign: 'center' },
                        }}
                        placeholder='X'
                      />
                    ))}
                  </div>
                  {verifyError && (
                    <Alert severity='error' sx={{ mb: 2 }}>
                      {'data' in verifyError ? (verifyError.data as ErrorData)?.message : 'Неверный код'}
                    </Alert>
                  )}
                  <MainButton
                    text='Подтвердить'
                    type='button'
                    onClick={handleVerify}
                    disabled={code.join('').length !== 6}
                    width='358px'
                    height='56px'
                  />
                </div>
              </Fade>
            ) : (
              <>
                {!isCompleteLoading && !isCompleteSuccess ? (
                  <div className='flex flex-col items-center justify-center'>
                    <p className='text-center text-green-700 text-[20px] font-medium mb-3'>Подтверждение прошло успешно!</p>
                    <p className='text-black text-[20px] font-medium mb-6'>Введите новый пароль</p>
                    <div style={{ minHeight: 48, width: '100%' }}>
                      {(errors.password?.message || errors.repeatPassword?.message) && (
                        <Alert severity='error' sx={{ mb: 2 }}>
                          {errors.password?.message}
                          {errors.password?.message && <br />}
                          {errors.repeatPassword?.message}
                        </Alert>
                      )}
                    </div>

                    <div className='flex flex-col gap-4 w-full items-center'>
                      <TextField
                        label='Пароль'
                        type='password'
                        {...register('password', getPasswordValidation())}
                        error={!!errors.password}
                        sx={{ width: '330px', height: '48px', marginBottom: '20px' }}
                      />
                      <TextField
                        {...register('repeatPassword', getRepeatPasswordValidation(getValues))}
                        error={!!errors.repeatPassword}
                        label='Повторите пароль'
                        type='password'
                        sx={{ width: '330px', height: '48px', mb: '20px' }}
                        disabled={!!errors.password || !password}
                      />

                      <MainButton
                        text='Установить пароль'
                        type='button'
                        onClick={handleSetPassword}
                        disabled={isCompleteLoading || isCompleteSuccess || !password || !repeatPassword || !!errors.password || !!errors.repeatPassword}
                        width='358px'
                        height='56px'
                      />
                    </div>
                  </div>
                ) : (
                  <Fade in={true} timeout={700}>
                    <div className='flex flex-col items-center justify-center'>
                      <h2 className='text-center text-green-700 text-[20px] font-medium mb-3'>Добро пожаловать в ZaraHome!</h2>
                      <p className='text-center text-green-700 text-[20px] font-medium mb-3'>Вы успешно зарегистрировались!</p>
                    </div>
                  </Fade>
                )}
              </>
            )}
          </form>
        </div>
      </div>
    </Fade>
  );
};

export default RegisterForm;

