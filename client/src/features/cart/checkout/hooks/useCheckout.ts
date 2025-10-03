import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { useCreateOrderMutation } from '@/entities/order/api/orders.api';
import { setCurrentOrderId } from '@/entities/order/model/order.slice';
import { openModalAuth, setView } from '@/features/auth/model/auth.slice';
import { RootState } from '@/shared/config/store/store';

/**
 * Хук для обработки оформления заказа
 * Инкапсулирует логику создания заказа и обработки аутентификации
 */
export const useCheckout = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [createOrder, { isLoading: isCreatingOrder }] =
    useCreateOrderMutation();
  const { isAuthenticated } = useSelector((s: RootState) => s.auth);

  const handleCheckout = useCallback(async () => {
    if (!isAuthenticated) {
      dispatch(openModalAuth());
      dispatch(setView('login'));
      return;
    }

    // Навигация без ожидания API, чтобы кнопка всегда работала
    router.push('/order');

    // Пытаемся создать заказ в фоне (не блокируем переход)
    Promise.resolve()
      .then(async () => {
        try {
          const result = await createOrder(undefined as any).unwrap();
          if (result?.id) {
            dispatch(setCurrentOrderId(result.id));
          }
        } catch (error) {
          console.warn(
            'Создание заказа не удалось, продолжим на странице оформления:',
            error
          );
        }
      })
      .catch(() => {});
  }, [isAuthenticated, createOrder, dispatch, router]);

  const handleLoginRequired = useCallback(() => {
    dispatch(openModalAuth());
    dispatch(setView('login'));
  }, [dispatch]);

  return {
    handleCheckout,
    handleLoginRequired,
    isCreatingOrder,
    isAuthenticated,
  };
};
