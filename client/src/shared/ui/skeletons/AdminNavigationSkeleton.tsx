import React from 'react';
import HomeIcon from '@/shared/ui/HomeIcon';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import HttpsOutlinedIcon from '@mui/icons-material/HttpsOutlined';

const AdminNavigationSkeleton = () => {
  return (
    <div>
      {/* Breadcrumb - отображаем сразу, без скелетона */}
      <div className="flex items-center mb-[31px]">
        <HomeIcon />
        <span className='text-[#00000099] ml-[4px] mr-[6px]'>{'>'}</span>
        <span className='text-[14px] font-medium text-[#00000099] underline'>Личный кабинет</span>
      </div>
      
      <div className="flex">
        {/* Navigation menu - отображаем сразу, без скелетона */}
                        <ul className="flex flex-col pr-[123px] w-[300px] flex-shrink-0">
          <li className="flex items-center mb-[5px] cursor-pointer">
            <ShoppingCartOutlinedIcon
              fontSize='medium'
              sx={{ color: 'gray' }}
            />
            <p className="font-medium text-[18px] ml-[2px]">Добавить товары</p>
          </li>
          <li className="flex items-center mb-[5px] cursor-pointer">
            <HttpsOutlinedIcon 
              fontSize='medium'
              sx={{ color: 'gray' }}
            />
            <p className="font-medium text-[18px] ml-[2px]">Сменить пароль</p>
          </li>
          <li className="flex items-center mb-[5px] cursor-pointer">
            <HttpsOutlinedIcon 
              fontSize='medium'
              sx={{ color: 'gray' }}
            />
            <p className="font-medium text-[18px] ml-[2px]">Промокоды</p>
          </li>
        </ul>
        
        {/* Content area skeleton */}
        <div className="flex-1 animate-pulse">
          <div className="flex flex-col items-center">
            <div className="h-[42px] bg-gray-200 rounded w-[300px] mb-[37px]"></div>
            <div className="flex items-center justify-center mb-[28px] w-full">
              <div className="h-[20px] bg-gray-200 rounded w-[200px] mr-[5px]"></div>
              <div className="h-[2px] bg-gray-200 rounded w-[615px]"></div>
            </div>
            <div className="flex flex-col w-full max-w-[1000px]">
              <div className="flex flex-wrap gap-6 mb-[23px] justify-center">
                <div className="flex flex-col flex-1 min-w-[300px] max-w-[400px]">
                  <div className="h-[20px] bg-gray-200 rounded w-[100px] mb-[5px] ml-[20px]"></div>
                  <div className="h-[48px] bg-gray-200 rounded w-full"></div>
                </div>
                <div className="flex flex-col flex-1 min-w-[300px] max-w-[400px]">
                  <div className="h-[20px] bg-gray-200 rounded w-[140px] mb-[5px] ml-[20px]"></div>
                  <div className="h-[48px] bg-gray-200 rounded w-full"></div>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="h-[56px] bg-gray-200 rounded w-[358px]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNavigationSkeleton;
