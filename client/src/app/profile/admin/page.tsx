'use client'
import MainLayout from '@/layout/MainLayout';
import { Container } from '@mui/material';
import HomeIcon from '@/components/ui/HomeIcon';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import HttpsOutlinedIcon from '@mui/icons-material/HttpsOutlined';
import AdminAddProduct from '@/section/AdminAddProduct';
import ChangePassword from '@/section/ChangePassword';
import { useState } from 'react';
import Promocodes from '@/components/Promocodes';


const AdminPage = () => {
  const [activeView, setActiveView] = useState('add-product');

  return (
    <MainLayout>
      <Container maxWidth='lg'>
        <div className='pb-[99px] pt-[45px] '>
          <div className="flex items-center mb-[31px]">
            <HomeIcon />
            <span className='text-[#00000099] ml-[4px] mr-[6px]'>{'>'}</span>
            <span className='text-[14px] font-medium text-[#00000099] underline'>Личный кабинет</span>
          </div>
          <div className='flex justify-between'>
            <ul className="flex flex-col w-[250px]">
              <li className="flex items-center mb-[5px] cursor-pointer" onClick={() => setActiveView('add-product')}>
                <ShoppingCartOutlinedIcon
                  fontSize='medium' sx={{ color: 'black' }} />
                <p className="font-medium text-[18px] ml-[2px]">Добавить товары</p>
              </li>
              <li className="flex items-center mb-[5px] cursor-pointer" onClick={() => setActiveView('change-password')}>
                <HttpsOutlinedIcon fontSize='medium' sx={{ color: 'black' }} />
                <p className="font-medium text-[18px] ml-[2px]">Сменить пароль</p>
              </li>
              <li className="flex items-center mb-[5px] cursor-pointer" onClick={() => setActiveView('promocodes')}>
                <HttpsOutlinedIcon fontSize='medium' sx={{ color: 'black' }} />
                <p className="font-medium text-[18px] ml-[2px]">Промокоды</p>
              </li>


            </ul>
            <div>
              {activeView === 'add-product' && (<AdminAddProduct />)}

              {activeView === 'change-password' && (<ChangePassword />)}
              {activeView === 'promocodes' && (<Promocodes />)}
            </div>
          </div>
        </div>
      </Container>
    </MainLayout>
  );
};

export default AdminPage;

