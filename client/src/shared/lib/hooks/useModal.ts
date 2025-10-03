import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * Хуки для работы с модальными окнами
 */

interface ModalState {
  isOpen: boolean;
  isAnimating: boolean;
  isVisible: boolean;
}

interface ModalOptions {
  animationDuration?: number;
  closeOnEscape?: boolean;
  closeOnOverlayClick?: boolean;
  preventBodyScroll?: boolean;
}

/**
 * Хук для управления модальными окнами
 * @param options - опции модального окна
 * @returns объект с состоянием и методами модального окна
 */
export const useModal = (options: ModalOptions = {}) => {
  const {
    animationDuration = 300,
    closeOnEscape = true,
    closeOnOverlayClick = true,
    preventBodyScroll = true,
  } = options;

  const [state, setState] = useState<ModalState>({
    isOpen: false,
    isAnimating: false,
    isVisible: false,
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Открытие модального окна
  const openModal = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      isOpen: true,
      isAnimating: true,
      isVisible: true,
    }));

    // Предотвращаем скролл body
    if (preventBodyScroll) {
      document.body.style.overflow = 'hidden';
    }

    // Очищаем таймаут анимации
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Завершаем анимацию
    timeoutRef.current = setTimeout(() => {
      setState(prevState => ({
        ...prevState,
        isAnimating: false,
      }));
    }, animationDuration);
  }, [animationDuration, preventBodyScroll]);

  // Закрытие модального окна
  const closeModal = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      isAnimating: true,
    }));

    // Восстанавливаем скролл body
    if (preventBodyScroll) {
      document.body.style.overflow = '';
    }

    // Очищаем таймаут анимации
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Завершаем анимацию и скрываем модальное окно
    timeoutRef.current = setTimeout(() => {
      setState(prevState => ({
        ...prevState,
        isOpen: false,
        isAnimating: false,
        isVisible: false,
      }));
    }, animationDuration);
  }, [animationDuration, preventBodyScroll]);

  // Переключение состояния модального окна
  const toggleModal = useCallback(() => {
    if (state.isOpen) {
      closeModal();
    } else {
      openModal();
    }
  }, [state.isOpen, openModal, closeModal]);

  // Обработка клика по overlay
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (closeOnOverlayClick && e.target === e.currentTarget) {
        closeModal();
      }
    },
    [closeOnOverlayClick, closeModal]
  );

  // Обработка нажатия клавиш
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === 'Escape' && state.isOpen) {
        closeModal();
      }
    },
    [closeOnEscape, state.isOpen, closeModal]
  );

  // Подписка на события клавиатуры
  useEffect(() => {
    if (state.isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [state.isOpen, handleKeyDown]);

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (preventBodyScroll) {
        document.body.style.overflow = '';
      }
    };
  }, [preventBodyScroll]);

  return {
    isOpen: state.isOpen,
    isAnimating: state.isAnimating,
    isVisible: state.isVisible,
    openModal,
    closeModal,
    toggleModal,
    handleOverlayClick,
    modalRef,
  };
};

/**
 * Хук для управления несколькими модальными окнами
 * @param modalIds - массив идентификаторов модальных окон
 * @param options - опции для всех модальных окон
 * @returns объект с методами управления модальными окнами
 */
export const useMultipleModals = () =>
  // modalIds: string[],
  // options: ModalOptions = {}
  {
    const [openModals, setOpenModals] = useState<Set<string>>(new Set());

    const openModal = useCallback((modalId: string) => {
      setOpenModals(prev => new Set([...prev, modalId]));
    }, []);

    const closeModal = useCallback((modalId: string) => {
      setOpenModals(prev => {
        const newSet = new Set(prev);
        newSet.delete(modalId);
        return newSet;
      });
    }, []);

    const closeAllModals = useCallback(() => {
      setOpenModals(new Set());
    }, []);

    const isModalOpen = useCallback(
      (modalId: string) => {
        return openModals.has(modalId);
      },
      [openModals]
    );

    const toggleModal = useCallback(
      (modalId: string) => {
        if (isModalOpen(modalId)) {
          closeModal(modalId);
        } else {
          openModal(modalId);
        }
      },
      [isModalOpen, openModal, closeModal]
    );

    return {
      openModals: Array.from(openModals),
      openModal,
      closeModal,
      closeAllModals,
      isModalOpen,
      toggleModal,
    };
  };

/**
 * Хук для анимации модального окна
 * @param isOpen - состояние открытия модального окна
 * @param animationDuration - длительность анимации
 * @returns объект с классами для анимации
 */
export const useModalAnimation = (
  isOpen: boolean,
  animationDuration: number = 300
) => {
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    if (isOpen) {
      setAnimationClass('modal-enter');
      const timeout = setTimeout(() => {
        setAnimationClass('modal-enter-active');
      }, 10);

      return () => clearTimeout(timeout);
    } else {
      setAnimationClass('modal-exit');
      const timeout = setTimeout(() => {
        setAnimationClass('modal-exit-active');
      }, 10);

      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  return {
    animationClass,
    animationDuration,
  };
};
