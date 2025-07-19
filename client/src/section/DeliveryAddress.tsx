import React, { useState, useEffect, useRef, useMemo } from 'react';
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
import HorizontalLine from "@/components/ui/HorizontalLine";
import { Fade, TextField, Alert, Snackbar } from "@mui/material";
import MainButton from '@/components/Button/MainButton';
import { useForm } from 'react-hook-form';
import { ChangeDeliveryAddressDto, DeliveryAddressDto } from '@/api/types/profile.types';
import { motion, AnimatePresence } from 'framer-motion';
import { useGetDeliveryAddressesQuery, useAddDeliveryAddressMutation, useUpdateDeliveryAddressMutation } from '@/api/profile.api';
import { profileApi } from '@/api/profile.api';
import { useDispatch } from 'react-redux';

const emptyAddress: ChangeDeliveryAddressDto = {
  firstName: '',
  lastName: '',
  patronymic: '',
  phoneCode: '+7',
  phone: '',
  region: '',
  city: '',
  street: '',
  building: '',
  house: '',
  apartment: ''
};

const MAX_ADDRESSES = 3;

const hasChanges = (newData: ChangeDeliveryAddressDto, oldData: DeliveryAddressDto) => {
  return Object.keys(newData).some(key => {
    const typedKey = key as keyof ChangeDeliveryAddressDto;
    return newData[typedKey] !== oldData[typedKey];
  });
};

const DeliveryAddress = () => {
  const dispatch = useDispatch();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const prevTokenRef = useRef<string | null>(null);

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<ChangeDeliveryAddressDto>({
    mode: 'onBlur',
    defaultValues: emptyAddress
  });

  const { data: addresses = [], isLoading, refetch } = useGetDeliveryAddressesQuery();
  const [addAddress, { isLoading: isAdding }] = useAddDeliveryAddressMutation();
  const [updateAddress, { isLoading: isUpdating }] = useUpdateDeliveryAddressMutation();

  const canAddNewAddress = addresses.length < MAX_ADDRESSES;

  const watchedFields = watch();

  // Мемоизированное вычисление наличия изменений
  const isChanged = useMemo(() => {
    if (editingIndex === null) return true; // Для добавления всегда true
    return hasChanges(watchedFields, addresses[editingIndex] || emptyAddress);
  }, [editingIndex, watchedFields, addresses]);

  // Очистка при размонтировании компонента
  useEffect(() => {
    return () => {
      reset(emptyAddress);
      setEditingIndex(null);
      setError(null);
      setSuccess(null);
    };
  }, [reset]);

  // Отслеживание изменения токена
  useEffect(() => {
    const currentToken = localStorage.getItem('accessToken');
    
    // Если токен изменился (включая случай, когда он стал null)
    if (currentToken !== prevTokenRef.current) {
      // Сбрасываем кэш RTK Query
      dispatch(profileApi.util.resetApiState());
      
      // Очищаем локальное состояние
      reset(emptyAddress);
      setEditingIndex(null);
      setError(null);
      setSuccess(null);
      
      // Если есть новый токен, делаем рефетч
      if (currentToken) {
        refetch();
      }
      
      // Обновляем реф с текущим токеном
      prevTokenRef.current = currentToken;
    }
  }, [localStorage.getItem('accessToken'), reset, dispatch, refetch]);

  const onSubmit = async (data: ChangeDeliveryAddressDto) => {
    try {
      console.log('Submitting form data:', data);
      console.log('Current token:', localStorage.getItem('accessToken'));
      console.log('Request URL:', 'http://localhost:5000/api/user/delivery-addresses');
      
      if (editingIndex !== null) {
        // Проверяем, есть ли изменения
        if (!hasChanges(data, addresses[editingIndex])) {
          setSuccess('Нет изменений для сохранения');
          setEditingIndex(null);
          reset(emptyAddress);
          return;
        }

        console.log('Updating address with id:', addresses[editingIndex].id);
        await updateAddress({ 
          id: addresses[editingIndex].id, 
          address: data 
        }).unwrap();
        console.log('Update result:', data);
        setSuccess('Адрес успешно обновлен');
      } else {
        console.log('Adding new address');
        await addAddress(data).unwrap();
        console.log('Add result:', data);
        setSuccess('Адрес успешно добавлен');
      }
      setEditingIndex(null);
      reset(emptyAddress);
    } catch (error: any) {
      console.error('Error details:', error);
      console.error('Error status:', error.status);
      console.error('Error data:', error.data);
      console.error('Error message:', error.message);
      console.error('Error originalStatus:', error.originalStatus);
      console.error('Error originalError:', error.originalError);
      
      if (error.status === 'FETCH_ERROR') {
        setError('Ошибка соединения с сервером. Проверьте, запущен ли сервер на порту 3001 и доступен ли он');
      } else if (error.status === 'PARSING_ERROR') {
        setError('Ошибка обработки ответа сервера');
      } else if (error.data?.message) {
        setError(error.data.message);
      } else if (error.error) {
        setError(error.error);
      } else {
        setError('Произошла ошибка при сохранении адреса');
      }
    }
  };

  const handleEditClick = (index: number) => {
    if (editingIndex === index) {
      setEditingIndex(null);
      reset(emptyAddress);
    } else {
      setEditingIndex(index);
      reset(addresses[index]);
    }
  };

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccess(null);
  };

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  return (
    <Fade in={true} timeout={1000}>
      <div className='flex items-start justify-between mb-[89px]'>
        <div className='mb-[19px]'>
          <h3 className="font-light text-[42px] mb-[32px]">
            Адреса доставки
          </h3>

          <AnimatePresence>
            {addresses.map((address: DeliveryAddressDto, index: number) => (
              <motion.div
                key={address.id}
                className="mb-[20px]"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4 }}
              >
                <div 
                  className="bg-white drop-shadow-lg flex items-center justify-between h-[74px] px-[30px] max-w-[728px] cursor-pointer hover:shadow-lg transition-shadow duration-300 group"
                  onClick={() => handleEditClick(index)}
                >
                  <div className="flex items-center">
                    <div className='bg-white w-[20px] h-[20px] rounded-full drop-shadow-lg mr-[29px] relative flex items-center justify-center'>
                      <span
                        className={`rounded-full w-[12px] h-[12px] transition-colors duration-300 ${editingIndex === index ? 'bg-black' : 'bg-gray-300'}`}
                      ></span>
                    </div>
                    <div className="flex flex-col">
                      <p className="font-semibold mb-[4px]">{`${address.lastName} ${address.firstName} ${address.patronymic}`}</p>
                      <p className="text-[14px] text-[#00000080]">
                        {`${address.region}, ${address.city}, ул.${address.street}, д.${address.house}${address.building ? `, к.${address.building}` : ''}, кв.${address.apartment}`}
                      </p>
                    </div>
                  </div>
                  <motion.div
                    animate={editingIndex === index ? { scale: 0.95, rotate: -10 } : { scale: 1, rotate: 0 }}
                    transition={{ duration: 0.2 }}
                    className="group-hover:scale-110 group-hover:rotate-15 transition-transform duration-200"
                  >
                    <ModeEditOutlinedIcon
                      fontSize='medium'
                      sx={{ color: 'gray' }}
                    />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <div className='flex items-center justify-start'>
            <p className="font-medium text-[#0000004D] mr-[5px] mb-[19px]">
              {editingIndex !== null ? 'Изменить текущий' : 'Добавить новый'}
            </p>
            <HorizontalLine width='620px' />
          </div>

          {!canAddNewAddress && editingIndex === null && (
            <div className="mb-4 text-red-500">
              Достигнут лимит адресов доставки (максимум {MAX_ADDRESSES})
            </div>
          )}

          <AnimatePresence mode="wait">
            {(canAddNewAddress || editingIndex !== null) && (
              <motion.form
                key={editingIndex !== null ? 'edit' : 'add'}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col mb-[41px]"
              >
                <div className="flex">
                  <div className='flex flex-col mr-[23px]'>
                    <div className="flex flex-col pb-[32px]">
                      <label className='pl-[20px] mb-[5px] text-[14px] font-medium text-[#00000099]'>Ваше имя</label>
                      <TextField
                        sx={{ width: '350px', height: '48px' }}
                        type="text"
                        inputProps={{ maxLength: 30 }}
                        onKeyPress={(e) => {
                          if (/\d/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        {...register('firstName', {
                          required: 'Это поле обязательное',
                          minLength: { value: 2, message: 'Минимум 2 символа' },
                          maxLength: { value: 30, message: 'Максимум 30 символов' },
                          pattern: { 
                            value: /^[А-Яа-яЁё\s-]+$/,
                            message: 'Только русские буквы'
                          }
                        })}
                        error={!!errors.firstName}
                        helperText={typeof errors.firstName?.message === 'string' ? errors.firstName.message : ' '}
                      />
                    </div>
                    <div className="flex flex-col pb-[32px]">
                      <label className='pl-[20px] mb-[5px] text-[14px] font-medium text-[#00000099]'>Ваше отчество</label>
                      <TextField
                        sx={{ width: '350px', height: '48px' }}
                        type="text"
                        inputProps={{ maxLength: 30 }}
                        {...register('patronymic', {
                          minLength: { value: 2, message: 'Минимум 2 символа' },
                          maxLength: { value: 30, message: 'Максимум 30 символов' },
                          pattern: { 
                            value: /^[А-Яа-яЁё\s-]+$/,
                            message: 'Только русские буквы'
                          }
                        })}
                        onKeyPress={(e) => {
                          if (/\d/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        error={!!errors.patronymic}
                        helperText={typeof errors.patronymic?.message === 'string' ? errors.patronymic.message : ' '}
                      />
                    </div>
                  </div>
                  <div className="flex-col">
                    <div className="flex flex-col pb-[22px]">
                      <label className='pl-[20px] mb-[5px] text-[14px] font-medium text-[#00000099]'>Ваша фамилия</label>
                      <TextField
                        sx={{ width: '350px', height: '48px', mb: '8px' }}
                        type="text"
                        inputProps={{ maxLength: 30 }}
                        {...register('lastName', {
                          required: 'Это поле обязательное',
                          minLength: { value: 2, message: 'Минимум 2 символа' },
                          maxLength: { value: 30, message: 'Максимум 30 символов' },
                          pattern: { 
                            value: /^[А-Яа-яЁё\s-]+$/,
                            message: 'Только русские буквы'
                          }
                        })}
                        onKeyPress={(e) => {
                          if (/\d/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        error={!!errors.lastName}
                        helperText={typeof errors.lastName?.message === 'string' ? errors.lastName.message : ' '}
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className='pl-[20px] mb-[5px] text-[14px] font-medium text-[#00000099]'>Номер телефона</label>
                      <div className="flex items-center">
                        <TextField
                          sx={{ width: '72px', marginRight: '6px', height: '48px' }}
                          type="text"
                          value="+7"
                          disabled
                          {...register('phoneCode', {
                            required: 'Код',
                            pattern: { value: /^\+\d{1,3}$/, message: 'Формат: +7' }
                          })}
                          error={!!errors.phoneCode}
                          helperText={typeof errors.phoneCode?.message === 'string' ? errors.phoneCode.message : ' '}
                        />
                        <TextField
                          sx={{ width: '270px', height: '48px' }}
                          type="tel"
                          placeholder="(XXX) XXX XX XX"
                          inputProps={{ maxLength: 10 }}
                          onKeyPress={(e) => {
                            if (!/\d/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                          {...register('phone', {
                            required: 'Это поле обязательное',
                            minLength: { value: 10, message: 'Введите корректный номер телефона' },
                            maxLength: { value: 10, message: 'Введите корректный номер телефона' },
                          })}
                          error={!!errors.phone}
                          helperText={typeof errors.phone?.message === 'string' ? errors.phone.message : ' '}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex">
                  <div className="mr-[23px] flex flex-col">
                    <div className="flex flex-col mb-[21px]">
                      <label className='mb-[5px] pl-[20px] text-[14px] font-medium text-[#00000099]'>Область</label>
                      <TextField
                        sx={{ width: '350px', height: '48px' }}
                        type="text"
                        inputProps={{ maxLength: 30 }}
                        onKeyPress={(e) => {
                          if (/\d/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        {...register('region', {
                          required: 'Это поле обязательное',
                          minLength: { value: 2, message: 'Введите корректную область' },
                          pattern: { 
                            value: /^[А-Яа-яЁё\s-]+$/,
                            message: 'Только русские буквы'
                          }
                        })}
                        error={!!errors.region}
                        helperText={typeof errors.region?.message === 'string' ? errors.region.message : ' '}
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className='mb-[5px] pl-[20px] text-[14px] font-medium text-[#00000099]'>Улица</label>
                      <TextField
                        sx={{ width: '350px', height: '48px' }}
                        type="text"
                        inputProps={{ maxLength: 30 }}
                        onKeyPress={(e) => {
                          if (/\d/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        {...register('street', {
                          required: 'Это поле обязательное',
                          minLength: { value: 2, message: 'Введите корректную улицу' },
                          pattern: { 
                            value: /^[А-Яа-яЁё\s-]+$/,
                            message: 'Только русские буквы'
                          }
                        })}
                        error={!!errors.street}
                        helperText={typeof errors.street?.message === 'string' ? errors.street.message : ' '}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex flex-col mb-[21px]">
                      <label className='mb-[5px] pl-[20px] text-[14px] font-medium text-[#00000099]'>Город</label>
                      <TextField
                        sx={{ width: '350px', height: '48px' }}
                        type="text"
                        inputProps={{ maxLength: 30 }}
                        onKeyPress={(e) => {
                          if (/\d/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        {...register('city', {
                          required: 'Это поле обязательное',
                          minLength: { value: 2, message: 'Введите корректный город' },
                          pattern: { 
                            value: /^[А-Яа-яЁё\s-]+$/,
                            message: 'Только русские буквы'
                          }
                        })}
                        error={!!errors.city}
                        helperText={typeof errors.city?.message === 'string' ? errors.city.message : ' '}
                      />
                    </div>
                    <div className="flex items-center">
                      <div className="flex flex-col items-center justify-center mr-[26px]">
                        <label className='mb-[5px] text-[14px] font-medium text-[#00000099]'>Корпус</label>
                        <TextField
                          sx={{ width: '100px', height: '48px' }}
                          type="number"
                          inputProps={{ min: 1, max: 9999 }}
                          {...register('building', {
                            pattern: { value: /^\d*$/, message: 'Только цифры' }
                          })}
                        />
                      </div>
                      <div className="flex flex-col items-center justify-center mr-[26px]">
                        <label className='mb-[5px] text-[14px] font-medium text-[#00000099] '>Дом</label>
                        <TextField
                          sx={{ width: '100px', height: '48px' }}
                          type="number"
                          inputProps={{ min: 1, max: 9999 }}
                          {...register('house', {
                            required: 'Дом обязателен',
                            pattern: { value: /^\d+$/, message: 'Только цифры' }
                          })}
                          error={!!errors.house}
                          helperText={typeof errors.house?.message === 'string' ? errors.house.message : ' '}
                        />
                      </div>
                      <div className="flex flex-col items-center justify-center">
                        <label className='mb-[5px] text-[14px] font-medium text-[#00000099]'>Квартира</label>
                        <TextField
                          sx={{ width: '100px', height: '48px' }}
                          type="number"
                          inputProps={{ min: 1, max: 99999 }}
                          {...register('apartment', {
                            pattern: { value: /^\d+$/, message: 'Только цифры' }
                          })}
                          error={!!errors.apartment}
                          helperText={typeof errors.apartment?.message === 'string' ? errors.apartment.message : ' '}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className='flex mt-8 '>
                  <MainButton 
                    text={editingIndex !== null ? 'Обновить адрес' : 'Добавить адрес'} 
                    disabled={isAdding || isUpdating || (editingIndex !== null && !isChanged)} 
                    type='submit' 
                    width='358px'
                    height='56px'
                  />
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <Snackbar 
          open={!!error || !!success} 
          autoHideDuration={6000} 
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={error ? 'error' : 'success'} 
            sx={{ width: '100%' }}
          >
            {error || success}
          </Alert>
        </Snackbar>
      </div>
    </Fade>
  );
};

export default DeliveryAddress;