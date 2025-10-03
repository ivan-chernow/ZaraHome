'use client';

import React, { Suspense } from 'react';
import { Container } from '@mui/material';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import HttpsOutlinedIcon from '@mui/icons-material/HttpsOutlined';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/shared/config/store/store';
import { setAdminActiveView } from '@/features/admin/model/admin.slice';
import { useRestoreActiveView } from '@/shared/lib/hooks/useRestoreActiveView';
import { AdminSkeleton } from '@/shared/ui/skeletons/AdminSkeleton';
import HomeIcon from '@/shared/ui/HomeIcon';
import AdminAddProduct from '@/features/product/create/ui/AdminAddProduct';
import ChangePassword from '@/features/profile/change-password/ui/ChangePassword';
import Promocodes from '@/features/promocodes/ui/Promocodes';

type AdminView = 'add-product' | 'change-password' | 'promocodes';

/**
 * Упрощенный компонент админ-панели
 * Объединяет всю логику в одном месте для упрощения структуры
 */
export const AdminPage: React.FC = () => {
  const dispatch = useDispatch();
  const { activeView } = useSelector((state: RootState) => state.admin);

  // Инициализация состояния из localStorage
  const { isReady } = useRestoreActiveView<AdminView>({
    localStorageKey: 'adminActiveView',
    validViews: ['add-product', 'change-password', 'promocodes'] as const,
    setAction: view => setAdminActiveView(view),
  });

  const handleViewChange = (view: AdminView) => {
    dispatch(setAdminActiveView(view));
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('adminActiveView', view);
      }
    } catch {}
  };

  // Конфигурация навигации
  const navigationItems = [
    {
      id: 'add-product' as AdminView,
      icon: ShoppingCartOutlinedIcon,
      label: 'Добавить товары',
    },
    {
      id: 'change-password' as AdminView,
      icon: HttpsOutlinedIcon,
      label: 'Сменить пароль',
    },
    {
      id: 'promocodes' as AdminView,
      icon: HttpsOutlinedIcon,
      label: 'Промокоды',
    },
  ];

  // Рендер контента
  const renderContent = () => {
    switch (activeView) {
      case 'add-product':
        return <AdminAddProduct />;
      case 'change-password':
        return <ChangePassword />;
      case 'promocodes':
        return <Promocodes />;
      default:
        return <AdminAddProduct />;
    }
  };

  if (!isReady) {
    return <AdminSkeleton />;
  }

  return (
    <Container maxWidth="lg">
      <div className="pb-[99px] pt-[45px]">
        <Suspense fallback={<AdminSkeleton />}>
          {/* Хлебные крошки */}
          <nav
            className="flex items-center mb-[31px]"
            aria-label="Хлебные крошки"
          >
            <HomeIcon aria-label="Главная страница" />
            <span
              className="text-[#00000099] ml-[4px] mr-[6px]"
              aria-hidden="true"
            >
              {'>'}
            </span>
            <span className="text-[14px] font-medium text-[#00000099] underline">
              Личный кабинет
            </span>
          </nav>

          <div className="flex">
            {/* Навигация */}
            <ul className="flex flex-col pr-[123px] w-[300px] flex-shrink-0">
              {navigationItems.map(({ id, icon: Icon, label }) => (
                <li
                  key={id}
                  className={`flex items-center mb-[5px] cursor-pointer transition-colors duration-200 ${
                    activeView === id
                      ? 'text-black'
                      : 'text-gray-500 hover:text-black'
                  }`}
                  onClick={() => handleViewChange(id)}
                >
                  <Icon
                    fontSize="medium"
                    sx={{
                      color: activeView === id ? 'black' : 'gray',
                    }}
                  />
                  <p className="font-medium text-[18px] ml-[2px]">{label}</p>
                </li>
              ))}
            </ul>

            {/* Контент */}
            <div className="flex-1">{renderContent()}</div>
          </div>
        </Suspense>
      </div>
    </Container>
  );
};

export default AdminPage;
