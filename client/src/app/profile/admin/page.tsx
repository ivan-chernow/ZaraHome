'use client'
import MainLayout from '@/layout/MainLayout';
import { Container } from '@mui/material';
import HomeIcon from '@/components/ui/HomeIcon';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import HttpsOutlinedIcon from '@mui/icons-material/HttpsOutlined';
import AdminAddProduct from '@/section/AdminAddProduct';
import ChangePassword from '@/section/ChangePassword';
import { useEffect, useState } from 'react';
import Promocodes from '@/components/Promocodes';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setAdminActiveView } from '@/store/features/profile/admin.slice';


const AdminPage = () => {
  const dispatch = useDispatch();
  const { activeView } = useSelector((state: RootState) => state.admin);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("adminActiveView");
      if (
        saved &&
        ["add-product", "change-password", "promocodes"].includes(saved)
      ) {
        dispatch(setAdminActiveView(saved as "add-product" | "change-password" | "promocodes"));
      }
    }
    setIsReady(true);
  }, [dispatch]);

  if (!isReady) {
    return null;
  }

  return (
    <MainLayout>
      <Container maxWidth='lg'>
        <div className='pb-[99px] pt-[45px] '>
          <div className="flex items-center mb-[31px]">
            <HomeIcon />
            <span className='text-[#00000099] ml-[4px] mr-[6px]'>{'>'}</span>
            <span className='text-[14px] font-medium text-[#00000099] underline'>Личный кабинет</span>
          </div>
          <div className='flex'>
            <ul className="flex flex-col pr-[123px] w-fit">
              <li
                className={`flex items-center mb-[5px] cursor-pointer transition-colors duration-200 ${
                  activeView === "add-product"
                    ? "text-black"
                    : "text-gray-500 hover:text-black"
                }`}
                onClick={() => dispatch(setAdminActiveView("add-product"))}
              >
                <ShoppingCartOutlinedIcon
                  fontSize='medium'
                  sx={{ color: activeView === "add-product" ? "black" : "gray" }}
                />
                <p className="font-medium text-[18px] ml-[2px]">Добавить товары</p>
              </li>
              <li
                className={`flex items-center mb-[5px] cursor-pointer transition-colors duration-200 ${
                  activeView === "change-password"
                    ? "text-black"
                    : "text-gray-500 hover:text-black"
                }`}
                onClick={() => dispatch(setAdminActiveView("change-password"))}
              >
                <HttpsOutlinedIcon 
                  fontSize='medium'
                  sx={{ color: activeView === "change-password" ? "black" : "gray" }}
                />
                <p className="font-medium text-[18px] ml-[2px]">Сменить пароль</p>
              </li>
              <li
                className={`flex items-center mb-[5px] cursor-pointer transition-colors duration-200 ${
                  activeView === "promocodes"
                    ? "text-black"
                    : "text-gray-500 hover:text-black"
                }`}
                onClick={() => dispatch(setAdminActiveView("promocodes"))}
              >
                <HttpsOutlinedIcon 
                  fontSize='medium'
                  sx={{ color: activeView === "promocodes" ? "black" : "gray" }}
                />
                <p className="font-medium text-[18px] ml-[2px]">Промокоды</p>
              </li>
            </ul>
            <div className="flex-1">
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

