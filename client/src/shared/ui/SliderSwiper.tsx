import React, { useCallback, useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/pagination';
import { Product } from '@/entities/product/api/products.api';

interface SliderSwiperProps {
  product: Product;
  isHovered: boolean;
  quantity: number;
  // Width is derived from the parent; keep only height to lock the visual area
  height?: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const SliderSwiper: React.FC<SliderSwiperProps> = ({
  product,
  isHovered,
  quantity,
  height = 326,
}) => {
  // Функция для формирования полного URL изображения
  const getImageUrl = useCallback((path: string) => {
    try {
      // Если путь уже является полным URL
      if (path.startsWith('http')) {
        return path;
      }

      // Убираем начальный слеш, если он есть
      const cleanPath = path.startsWith('/') ? path.slice(1) : path;

      // Формируем полный URL
      return `${API_URL}/${cleanPath}`;
    } catch {
      return path; // Возвращаем исходный путь в случае ошибки
    }
  }, []);

  // Получаем массив картинок, которые будут показаны
  const images = useMemo(
    () => product.img.slice(0, quantity),
    [product.img, quantity]
  );

  // Определяем, нужно ли показывать пагинацию
  const showPagination = images.length > 1;

  return (
    <Swiper
      {...(showPagination && {
        pagination: {
          clickable: true,
          dynamicBullets: true,
        },
        modules: [Pagination],
      })}
      style={{ width: '100%', height: height, overflow: 'hidden' }}
      className={isHovered ? 'show-pagination' : 'hide-pagination'}
      spaceBetween={0}
      slidesPerView={1}
      loop={showPagination}
    >
      {images.map((img: string, idx: number) => (
        <SwiperSlide key={idx} style={{ width: '100%', height: '100%' }}>
          <div
            style={{
              width: '100%',
              height: '100%',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <Image
              src={getImageUrl(img)}
              alt={`${product.name_ru} изображение ${idx + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 326px"
              quality={85}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              draggable={false}
              priority={idx === 0}
              loading={idx === 0 ? 'eager' : 'lazy'}
            />
            <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default SliderSwiper;
