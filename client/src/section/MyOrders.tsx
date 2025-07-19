import React from 'react';
import { Fade } from "@mui/material";
import VerticalLine from '@/components/ui/VerticalLine';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { motion, AnimatePresence } from 'framer-motion';

const orderProducts = [
  {
    img: '/img1.jpg',
    name: 'LEATHER SANDALS',
    desc: 'Кожаные сандалии',
    price: '11 540 ₽',
  },
  {
    img: '/img2.jpg',
    name: 'LEATHER SANDALS',
    desc: 'Кожаные сандалии',
    price: '11 540 ₽',
  },
  {
    img: '/img3.jpg',
    name: 'LEATHER SANDALS',
    desc: 'Кожаные сандалии',
    price: '11 540 ₽',
  },
  {
    img: '/img4.jpg',
    name: 'LEATHER SANDALS',
    desc: 'Кожаные сандалии',
    price: '11 540 ₽',
  },
];

const MyOrders = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <Fade in={true} timeout={1000}>
      <div className="mb-6">
        <h3 className="font-light text-[42px] mb-[31px]">Мои заказы</h3>
        <ul className="flex flex-col">
          <li className="flex flex-col bg-white rounded-[8px] shadow-md mb-8 w-full">
            <div className="flex items-center justify-between min-h-[60px] px-8 pt-6 pb-2">
              <div className="flex items-center">
                <p className="font-roboto text-[18px] mr-6">№ 356 765 00</p>
                <VerticalLine height={60} />
                <div className="flex flex-col mx-6">
                  <p className="font-ysabeau font-semibold">
                    Сформирован: <span className="font-normal mb-[6px]">20.07.2023 16:41</span>
                  </p>
                  <p className="font-ysabeau font-semibold">
                    Статус:{" "}
                    <span className={`font-normal text-[#905858]`}>
                      ожидает оплаты                    </span>
                  </p>
                </div>
                <VerticalLine height={60} />
                <div className="flex flex-col ml-6">
                  <p className="font-ysabeau font-semibold">
                    Товаров: <span className="font-medium  mb-[6px]">12</span>
                  </p>
                  <p className="font-ysabeau font-semibold">
                    На сумму:
                    <span className="font-medium font-roboto text-[24px]">
                      162 765
                      <span className="font-bold font-ysabeau text-[18px]"> ₽</span>
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 min-w-[120px] justify-end">
                <span
                  className="transition-transform duration-200 cursor-pointer"
                  style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
                  onClick={() => setOpen((prev) => !prev)}
                >
                  <KeyboardArrowDownIcon />
                </span>
                <p
                  className={`font-roboto ml-1 cursor-pointer select-none transition-colors duration-200 ${open ? "text-black" : "text-[#0000004D] hover:text-black"
                    }`}
                  onClick={() => setOpen((prev) => !prev)}
                >
                  {open ? "скрыть" : "подробнее"}
                </p>
              </div>
            </div>
            {/* Список товаров с анимацией */}
            <AnimatePresence>
              {open && (
                <motion.div
                  className="w-full border-t border-[#e0e0e0] mt-2 pt-2 px-8 pb-4"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {orderProducts.map((product, idx) => (
                    <div
                      key={idx}
                      className="flex items-center py-2 border-b border-[#f0f0f0] last:border-b-0"
                    >
                      <img
                        src={product.img}
                        alt={product.name}
                        className="w-[60px] h-[60px] object-cover rounded mr-4"
                      />
                      <div className="flex flex-col flex-1">
                        <span className="font-bold uppercase text-[15px]">{product.name}</span>
                        <span className="text-[13px] text-[#888]">{product.desc}</span>
                      </div>
                      <span className="font-roboto font-semibold text-[20px] min-w-[90px] text-right">
                        {product.price}
                      </span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        </ul>
      </div>
    </Fade>
  );
};

export default MyOrders;