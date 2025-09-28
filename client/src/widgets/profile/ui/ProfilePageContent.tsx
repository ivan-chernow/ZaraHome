'use client';
import React from 'react';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import Container from '@mui/material/Container';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import DeliveryDiningOutlinedIcon from '@mui/icons-material/DeliveryDiningOutlined';
import HttpsOutlinedIcon from '@mui/icons-material/HttpsOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import ChangePassword from '@/features/profile/change-password/ui/ChangePassword';
import DeliveryAddress from '@/features/profile/delivery-address/ui/DeliveryAddress';
import MyOrders from '@/widgets/personal-account/ui/MyOrders';
import { useRouter } from 'next/navigation';
import ChangeEmail from '@/features/profile/change-email/ui/ChangeEmail';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/shared/config/store/store';
import { setActiveView } from '@/features/profile/model/profile.slice';
import { useRestoreActiveView } from '@/shared/lib/hooks/useRestoreActiveView';

export const ProfilePageContent: React.FC = React.memo(() => {
  const dispatch = useDispatch();
  const { activeView } = useSelector((state: RootState) => state.profile);
  const router = useRouter();
  const { isReady } = useRestoreActiveView<
    'my-orders' | 'delivery-address' | 'change-password' | 'change-email'
  >({
    localStorageKey: 'profileActiveView',
    validViews: [
      'my-orders',
      'delivery-address',
      'change-password',
      'change-email',
    ] as const,
    setAction: view => setActiveView(view),
  });

  if (!isReady) {
    return null;
  }

  return (
    <Container maxWidth="lg">
      <div className="pb-[99px] pt-[45px]">
        <div className="flex items-center mb-[31px]">
          <HomeOutlinedIcon
            fontSize="small"
            sx={{ color: 'gray', cursor: 'pointer' }}
            onClick={() => router.push('/')}
          />
          <span className="text-[#00000099] ml-[4px] mr-[6px]">{'>'}</span>
          <span className="text-[14px] font-medium text-[#00000099] underline">
            Личный кабинет
          </span>
        </div>
        <div className="flex">
          <ul className="flex flex-col pr-[123px] w-fit">
            <li
              className={`flex items-center mb-[5px] cursor-pointer transition-colors duration-200 ${
                activeView === 'my-orders'
                  ? 'text-black'
                  : 'text-gray-500 hover:text-black'
              }`}
              onClick={() => dispatch(setActiveView('my-orders'))}
            >
              <ListAltOutlinedIcon
                fontSize="medium"
                sx={{ color: activeView === 'my-orders' ? 'black' : 'gray' }}
              />
              <p className="font-medium text-[18px] ml-[2px]">Мои заказы</p>
            </li>
            <li
              className={`flex items-center mb-[5px] cursor-pointer transition-colors duration-200 ${
                activeView === 'delivery-address'
                  ? 'text-black'
                  : 'text-gray-500 hover:text-black'
              }`}
              onClick={() => dispatch(setActiveView('delivery-address'))}
            >
              <DeliveryDiningOutlinedIcon
                fontSize="medium"
                sx={{
                  color: activeView === 'delivery-address' ? 'black' : 'gray',
                }}
              />
              <p className="font-medium text-[18px] ml-[2px]">
                Адреса доставки
              </p>
            </li>
            <li
              className={`flex items-center mb-[5px] cursor-pointer transition-colors duration-200 ${
                activeView === 'change-password'
                  ? 'text-black'
                  : 'text-gray-500 hover:text-black'
              }`}
              onClick={() => dispatch(setActiveView('change-password'))}
            >
              <HttpsOutlinedIcon
                fontSize="medium"
                sx={{
                  color: activeView === 'change-password' ? 'black' : 'gray',
                }}
              />
              <p className="font-medium text-[18px] ml-[2px]">Сменить пароль</p>
            </li>
            <li
              className={`flex items-center mb-[5px] cursor-pointer transition-colors duration-200 ${
                activeView === 'change-email'
                  ? 'text-black'
                  : 'text-gray-500 hover:text-black'
              }`}
              onClick={() => dispatch(setActiveView('change-email'))}
            >
              <EmailOutlinedIcon
                fontSize="medium"
                sx={{
                  color: activeView === 'change-email' ? 'black' : 'gray',
                }}
              />
              <p className="font-medium text-[18px] ml-[2px]">Сменить e-mail</p>
            </li>
          </ul>
          <div className="flex-1 ">
            {activeView === 'my-orders' && <MyOrders />}
            {activeView === 'delivery-address' && <DeliveryAddress />}
            {activeView === 'change-password' && <ChangePassword />}
            {activeView === 'change-email' && <ChangeEmail />}
          </div>
        </div>
      </div>
    </Container>
  );
});

ProfilePageContent.displayName = 'ProfilePageContent';

export default ProfilePageContent;
