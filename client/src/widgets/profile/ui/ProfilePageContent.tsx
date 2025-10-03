'use client';

import React, { Suspense } from 'react';
import { Container } from '@mui/material';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import HttpsOutlinedIcon from '@mui/icons-material/HttpsOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/shared/config/store/store';
import { setActiveView } from '@/features/profile/model/profile.slice';
import { useRestoreActiveView } from '@/shared/lib/hooks/useRestoreActiveView';
import { ProfileSkeleton } from '@/shared/ui/skeletons/ProfileSkeleton';
import HomeIcon from '@/shared/ui/HomeIcon';
import MyOrders from '@/widgets/personal-account/ui/MyOrders';
import ChangePassword from '@/features/profile/change-password/ui/ChangePassword';
import ChangeEmail from '@/features/profile/change-email/ui/ChangeEmail';
import DeliveryAddress from '@/features/profile/delivery-address/ui/DeliveryAddress';

type ProfileView =
  | 'my-orders'
  | 'delivery-address'
  | 'change-password'
  | 'change-email';

/**
 * Основной контент страницы профиля
 * Включает навигацию и отображение различных разделов профиля
 */
const ProfilePageContent: React.FC = () => {
  const dispatch = useDispatch();
  const { activeView } = useSelector((state: RootState) => state.profile);

  // Инициализация состояния из localStorage
  const { isReady } = useRestoreActiveView<ProfileView>({
    localStorageKey: 'profileActiveView',
    validViews: [
      'my-orders',
      'delivery-address',
      'change-password',
      'change-email',
    ] as const,
    setAction: view => setActiveView(view),
  });

  const handleViewChange = (view: ProfileView) => {
    dispatch(setActiveView(view));
  };

  // Конфигурация навигации
  const navigationItems = [
    {
      id: 'my-orders' as ProfileView,
      icon: ListAltOutlinedIcon,
      label: 'Мои заказы',
    },
    {
      id: 'delivery-address' as ProfileView,
      icon: HomeOutlinedIcon,
      label: 'Адреса доставки',
    },
    {
      id: 'change-password' as ProfileView,
      icon: HttpsOutlinedIcon,
      label: 'Сменить пароль',
    },
    {
      id: 'change-email' as ProfileView,
      icon: EmailOutlinedIcon,
      label: 'Сменить email',
    },
  ];

  // Рендер контента
  const renderContent = () => {
    switch (activeView) {
      case 'my-orders':
        return <MyOrders />;
      case 'delivery-address':
        return <DeliveryAddress />;
      case 'change-password':
        return <ChangePassword />;
      case 'change-email':
        return <ChangeEmail />;
      default:
        return <MyOrders />;
    }
  };

  if (!isReady) {
    return <ProfileSkeleton />;
  }

  return (
    <Container maxWidth="lg">
      <div className="pb-[99px] pt-[45px]">
        <Suspense fallback={<ProfileSkeleton />}>
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

export { ProfilePageContent };
export default ProfilePageContent;
