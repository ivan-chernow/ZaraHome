'use client';

import React from 'react';
import { SectionTitle } from '@/shared/ui/SectionTitle';

export const InfoPageWidget: React.FC = () => {
  return (
    <div className="max-w-[1200px] mx-auto p-6">
      <div className="space-y-8">
        <SectionTitle title="Информация о доставке" />

        {/* Сроки доставки */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Сроки доставки
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-lg text-gray-800">
                  Стандартная доставка
                </h3>
                <p className="text-gray-600 mt-1">3-5 рабочих дней</p>
                <p className="text-sm text-gray-500">
                  Бесплатно при заказе от 3000 ₽
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-lg text-gray-800">
                  Экспресс-доставка
                </h3>
                <p className="text-gray-600 mt-1">1-2 рабочих дня</p>
                <p className="text-sm text-gray-500">Стоимость: 500 ₽</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold text-lg text-gray-800">
                  Доставка в день заказа
                </h3>
                <p className="text-gray-600 mt-1">До 23:00 (только Москва)</p>
                <p className="text-sm text-gray-500">Стоимость: 1000 ₽</p>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold text-lg text-gray-800">
                  Самовывоз
                </h3>
                <p className="text-gray-600 mt-1">В течение 2 часов</p>
                <p className="text-sm text-gray-500">Бесплатно</p>
              </div>
            </div>
          </div>
        </div>

        {/* География доставки */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            География доставки
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-green-600 font-bold">МСК</span>
              </div>
              <h3 className="font-semibold">Москва</h3>
              <p className="text-sm text-gray-600">Все виды доставки</p>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-blue-600 font-bold">СПБ</span>
              </div>
              <h3 className="font-semibold">Санкт-Петербург</h3>
              <p className="text-sm text-gray-600">Стандартная и экспресс</p>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-purple-600 font-bold">РФ</span>
              </div>
              <h3 className="font-semibold">По всей России</h3>
              <p className="text-sm text-gray-600">Стандартная доставка</p>
            </div>
          </div>
        </div>

        {/* Условия доставки */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Условия доставки
          </h2>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-green-600 text-sm">✓</span>
              </div>
              <div>
                <h3 className="font-semibold">Бесплатная доставка</h3>
                <p className="text-gray-600 text-sm">
                  При заказе от 3000 ₽ доставка по Москве и МО бесплатно
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-sm">📦</span>
              </div>
              <div>
                <h3 className="font-semibold">Упаковка</h3>
                <p className="text-gray-600 text-sm">
                  Все товары упаковываются в фирменные коробки с защитой от
                  повреждений
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-orange-600 text-sm">🚚</span>
              </div>
              <div>
                <h3 className="font-semibold">Отслеживание</h3>
                <p className="text-gray-600 text-sm">
                  После отправки заказа вы получите трек-номер для отслеживания
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-purple-600 text-sm">💳</span>
              </div>
              <div>
                <h3 className="font-semibold">Оплата при получении</h3>
                <p className="text-gray-600 text-sm">
                  Возможна оплата наличными или картой курьеру при получении
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Контактная информация */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Остались вопросы?
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Служба поддержки</h3>
              <p className="text-gray-600 mb-1">📞 +7 (800) 123-45-67</p>
              <p className="text-gray-600 mb-1">✉️ support@zarahome.ru</p>
              <p className="text-sm text-gray-500">Ежедневно с 9:00 до 21:00</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Пункты самовывоза</h3>
              <p className="text-gray-600 mb-1">📍 Москва, ул. Тверская, 15</p>
              <p className="text-gray-600 mb-1">📍 СПб, Невский пр., 28</p>
              <p className="text-sm text-gray-500">
                Ежедневно с 10:00 до 22:00
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoPageWidget;
