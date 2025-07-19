'use client'
import React, { useState } from 'react';
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import MainLayout from "@/layout/MainLayout";
import Container from "@mui/material/Container";
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import DeliveryDiningOutlinedIcon from '@mui/icons-material/DeliveryDiningOutlined';
import HttpsOutlinedIcon from '@mui/icons-material/HttpsOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import ChangePassword from '@/section/ChangePassword';
import DeliveryAddress from '@/section/DeliveryAddress';
import MyOrders from '@/section/MyOrders';
import { useRouter } from 'next/navigation';
import ChangeEmail from '@/section/ChangeEmail';

const ProfilePage = () => {
  const [activeView, setActiveView] = useState('my-orders');
  const router = useRouter();
  return (
    <MainLayout>
      <Container maxWidth='lg'>
        <div className='pb-[99px] pt-[45px]'>
          <div className="flex items-center mb-[31px]">
            <HomeOutlinedIcon fontSize='small' sx={{ color: 'gray', cursor: 'pointer' }} onClick={() => router.push('/')} />
            <span className='text-[#00000099] ml-[4px] mr-[6px]'>{'>'}</span>
            <span className='text-[14px] font-medium text-[#00000099] underline'>Личный кабинет</span>
          </div>
          <div className="flex">
            <ul className="flex flex-col pr-[123px] w-fit">
              <li className="flex items-center mb-[5px] cursor-pointer" onClick={() => setActiveView('my-orders')}>
                <ListAltOutlinedIcon fontSize='medium' sx={{ color: 'black' }} />
                <p className="font-medium text-[18px] ml-[2px]">Мои заказы</p>
              </li>
              <li className="flex items-center mb-[5px] cursor-pointer" onClick={() => setActiveView('delivery-address')}>
                <DeliveryDiningOutlinedIcon fontSize='medium' sx={{ color: 'black' }} />
                <p className="font-medium text-[18px] ml-[2px]">Адреса доставки</p>
              </li>
              <li className="flex items-center mb-[5px] cursor-pointer" onClick={() => setActiveView('change-password')}>
                <HttpsOutlinedIcon fontSize='medium' sx={{ color: 'black' }} />
                <p className="font-medium text-[18px] ml-[2px]">Сменить пароль</p>
              </li>
              <li className="flex items-center mb-[5px] cursor-pointer" onClick={() => setActiveView('change-email')}>
                <EmailOutlinedIcon fontSize='medium' sx={{ color: 'black' }} />
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
    </MainLayout>
  );
};

export default ProfilePage;