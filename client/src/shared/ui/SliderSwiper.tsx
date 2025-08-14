import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/pagination";
import { Product } from "@/entities/product/api/products.api";

interface SliderSwiperProps {
  product: Product;
  isHovered: boolean;
  quantity: number;
  width?: number;
  height?: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const SliderSwiper = ({
  product,
  isHovered,
  quantity,
  width = 326,
  height = 326,
}: SliderSwiperProps) => {
  // Функция для формирования полного URL изображения
  const getImageUrl = (path: string) => {
    try {
      // Если путь уже является полным URL
      if (path.startsWith("http")) {
        return path;
      }

      // Убираем начальный слеш, если он есть
      const cleanPath = path.startsWith("/") ? path.slice(1) : path;

      // Формируем полный URL
      return `${API_URL}/${cleanPath}`;
    } catch (error) {
      console.error("Error forming image URL:", error);
      return path; // Возвращаем исходный путь в случае ошибки
    }
  };

  // Получаем массив картинок, которые будут показаны
  const images = product.img.slice(0, quantity);

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
      style={{ width: "auto", height: height, overflow: "hidden" }}
      className={isHovered ? "show-pagination" : "hide-pagination"}
      spaceBetween={0}
      slidesPerView={1}
      loop={showPagination}
    >
      {images.map((img: string, idx: number) => (
        <SwiperSlide key={idx} style={{ width: width, height: height }}>
          <div
            style={{
              width: "auto",
              height: height,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <Image
              src={getImageUrl(img)}
              alt={`${product.name_ru} изображение ${idx + 1}`}
              width={width}
              height={height}
              quality={85}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              draggable={false}
              priority={idx === 0}
            />
            <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default SliderSwiper;
