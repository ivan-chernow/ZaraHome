'use client'

import React from 'react';
import MainLayout from "@/layout/MainLayout";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import HorizontalLine from "@/components/ui/HorizontalLine";
import Container from "@mui/material/Container";
import CartItem from "@/components/Cart/cartItem";
import MainButton from '@/components/Button/MainButton';
import { useRouter } from 'next/navigation';

const Page = () => {
  const router = useRouter();
  return (
    <MainLayout>
      <section className='pb-[101px] pt-[45px]'>
        <Container maxWidth='lg'>
          <div className="flex items-center mb-[31px]">
            <HomeOutlinedIcon fontSize='small' />
            <span className='text-[#00000099] ml-[4px] mr-[6px]'>&gt;</span>
            <span className='text-[14px] font-medium text-[#00000099] underline'>Корзина</span>
          </div>

          <h3 className="text-[42px] font-light mb-[30px]">В вашей корзине</h3>
          <div className='flex items-start justify-between'>
            <ul className='flex flex-col '>
              <HorizontalLine width='720px' />
              <CartItem />
              <HorizontalLine width='720px' />
              <CartItem />
              <HorizontalLine width='720px' />
              <CartItem />
              <HorizontalLine width='720px' />
              <CartItem />
              <HorizontalLine width='720px' />

            </ul>
            <div className='flex flex-col w-[413px] h-[215px] drop-shadow-lg items-center justify-center bg-white'>
              <div className='mb-[8px] flex items-center justify-center'>
                <HorizontalLine width='141px' />
                <p className="font-medium text-[#0000004D] mx-[10px]">Итого</p>
                <HorizontalLine width='146px' />
              </div>
              <p className="font-medium text-[32px] font-inter">162 765 <span className='text-[24px] font-bold'>₽</span>
              </p>
              <p className="font-medium mb-[28px]">12 товаров</p>
              <div className=''>
                <MainButton text='Перейти к оформлению' disabled={false} type='button' onClick={() => router.push('/order')} width='358px' height='56px' />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </MainLayout>
  );
};

export default Page;