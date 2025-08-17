import React, { useState, useMemo, useEffect, useRef } from "react";
import { Fade } from "@mui/material";
import VerticalLine from "@/shared/ui/VerticalLine";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { motion, AnimatePresence } from "framer-motion";
import { useGetUserOrdersQuery } from "@/entities/order/api/orders.api";
import { useGetProductsByIdsQuery } from "@/entities/product/api/products.api";
import OrderItem from "@/entities/order/ui/OrderItem";

const MyOrders = () => {
  const [openOrderId, setOpenOrderId] = useState<number | null>(null);
  const [localOrders, setLocalOrders] = useState<any[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const timersRef = useRef<Map<number, NodeJS.Timeout>>(new Map());
  
  // Получаем заказы с бэкенда
  const { data: orders = [], isLoading: isOrdersLoading } = useGetUserOrdersQuery();
  
  // Обновляем время каждую секунду для отображения обратного отсчёта
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Обрабатываем заказы и устанавливаем таймеры для отменённых
  useEffect(() => {
    if (orders.length > 0) {
      setLocalOrders(orders);
      
      // Очищаем старые таймеры
      timersRef.current.forEach(timer => clearTimeout(timer));
      timersRef.current.clear();
      
      // Устанавливаем таймеры для отменённых заказов
      orders.forEach(order => {
        if (order.status === 'cancelled') {
          // Проверяем, когда был отменён заказ
          const cancelledAt = new Date(order.updatedAt || order.createdAt);
          const timeDiff = currentTime.getTime() - cancelledAt.getTime();
          const timeUntilDeletion = Math.max(0, 10 * 60 * 1000 - timeDiff); // 10 минут в миллисекундах
          
          if (timeUntilDeletion > 0) {
            // Устанавливаем таймер на удаление
            const timer = setTimeout(() => {
              setLocalOrders(prev => prev.filter(o => o.id !== order.id));
              timersRef.current.delete(order.id);
            }, timeUntilDeletion);
            
            timersRef.current.set(order.id, timer);
          } else {
            // Заказ уже должен быть удалён
            setLocalOrders(prev => prev.filter(o => o.id !== order.id));
          }
        }
      });
    }
    
    // Очистка при размонтировании компонента
    return () => {
      timersRef.current.forEach(timer => clearTimeout(timer));
      timersRef.current.clear();
    };
  }, [orders, currentTime]);
  
  // Собираем все ID товаров из всех заказов для загрузки данных
  const allProductIds = useMemo(() => {
    const ids: number[] = [];
    localOrders.forEach(order => {
      order.items.forEach((item: any) => {
        if (item.productId && !ids.includes(item.productId)) {
          ids.push(item.productId);
        }
      });
    });
    return ids;
  }, [localOrders]);
  
  // Загружаем данные о товарах
  const { data: productsByIds = [] } = useGetProductsByIdsQuery(allProductIds, {
    skip: allProductIds.length === 0,
  });
  
  // Создаем мапу для быстрого доступа к данным товаров
  const idToProduct = useMemo(() => {
    return productsByIds.reduce((acc, product) => {
      acc[product.id] = product;
      return acc;
    }, {} as Record<number, any>);
  }, [productsByIds]);

  // Функция для форматирования даты
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Функция для получения статуса на русском
  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'ожидает оплаты',
      paid: 'оплачен',
      shipped: 'отправлен',
      delivered: 'доставлен',
      cancelled: 'отменён',
    };
    return statusMap[status] || status;
  };

  // Функция для получения цвета статуса
  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      pending: 'text-[#905858]',
      paid: 'text-blue-600',
      shipped: 'text-orange-600',
      delivered: 'text-green-600',
      cancelled: 'text-red-600',
    };
    return colorMap[status] || 'text-gray-600';
  };

  if (isOrdersLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-1/3 mb-6" />
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-100 rounded-lg shadow-md mb-4 h-[74px] w-full"
          />
        ))}
      </div>
    );
  }

  // Функция для отображения оставшегося времени до удаления отменённого заказа
  const getTimeUntilDeletion = (order: any) => {
    if (order.status !== 'cancelled') return null;
    
    const cancelledAt = new Date(order.updatedAt || order.createdAt);
    const timeDiff = currentTime.getTime() - cancelledAt.getTime();
    const timeUntilDeletion = Math.max(0, 10 * 60 * 1000 - timeDiff); // 10 минут
    
    if (timeUntilDeletion <= 0) return null;
    
    const minutes = Math.floor(timeUntilDeletion / (1000 * 60));
    const seconds = Math.floor((timeUntilDeletion % (1000 * 60)) / 1000);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (localOrders.length === 0) {
    return (
      <Fade in={true} timeout={1000}>
        <div className="mb-6">
          <h3 className="font-light text-[42px] mb-[31px]">Мои заказы</h3>
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">У вас пока нет заказов</p>
            <p className="text-gray-400 text-sm mt-2">
              Создайте первый заказ, добавив товары в корзину
            </p>
          </div>
        </div>
      </Fade>
    );
  }

  return (
    <Fade in={true} timeout={1000}>
      <div className="mb-6">
        <h3 className="font-light text-[42px] mb-[31px]">Мои заказы</h3>
        <ul className="flex flex-col">
          {localOrders.map((order) => (
            <li key={order.id} className="flex flex-col bg-white rounded-[8px] shadow-md mb-8 w-full">
              <div className="flex items-center justify-between min-h-[60px] px-8 pt-6 pb-2">
                <div className="flex items-center">
                  <p className="font-roboto text-[18px] mr-6">№ {order.id}</p>
                  <VerticalLine height={60} />
                  <div className="flex flex-col mx-6">
                    <p className="font-ysabeau font-semibold">
                      Сформирован:{" "}
                      <span className="font-normal mb-[6px]">
                        {formatDate(order.createdAt)}
                      </span>
                    </p>
                    <p className="font-ysabeau font-semibold">
                      Статус:{" "}
                      <span className={`font-normal ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                      {order.status === 'cancelled' && getTimeUntilDeletion(order) && (
                        <span className="font-normal text-red-600 ml-2">
                          (удаление через {getTimeUntilDeletion(order)})
                        </span>
                      )}
                    </p>
                  </div>
                  <VerticalLine height={60} />
                  <div className="flex flex-col ml-6">
                    <p className="font-ysabeau font-semibold">
                      Товаров: <span className="font-medium mb-[6px]">{order.totalCount}</span>
                    </p>
                    <p className="font-ysabeau font-semibold">
                      На сумму:
                      <span className="font-medium font-roboto text-[24px]">
                        {order.totalPrice.toLocaleString("ru-RU")}
                        <span className="font-bold font-ysabeau text-[18px]">
                          {" "}₽
                        </span>
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 min-w-[120px] justify-end">
                  <span
                    className="transition-transform duration-200 cursor-pointer"
                    style={{
                      transform: openOrderId === order.id ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                    onClick={() => setOpenOrderId(openOrderId === order.id ? null : order.id)}
                  >
                    <KeyboardArrowDownIcon />
                  </span>
                  <p
                    className={`font-roboto ml-1 cursor-pointer select-none transition-colors duration-200 ${
                      openOrderId === order.id ? "text-black" : "text-[#0000004D] hover:text-black"
                    }`}
                    onClick={() => setOpenOrderId(openOrderId === order.id ? null : order.id)}
                  >
                    {openOrderId === order.id ? "скрыть" : "подробнее"}
                  </p>
                </div>
              </div>
              
              {/* Список товаров с анимацией */}
              <AnimatePresence>
                {openOrderId === order.id && (
                  <motion.div
                    className="w-full border-t border-[#e0e0e0] mt-2 pt-2 px-8 pb-4"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {order.items.map((item: any, idx: number) => (
                      <OrderItem
                        key={idx}
                        productId={item.productId}
                        productName={item.productName || "Название товара"}
                        quantity={item.quantity}
                        price={item.price}
                        size={item.size}
                        color={item.color}
                        product={idToProduct[item.productId]}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>
      </div>
    </Fade>
  );
};

export default MyOrders;
