'use client';

import React from 'react';

const TermsOfServiceContent: React.FC = () => {
  const currentDate = new Date().toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 px-6 py-4">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Пользовательское соглашение
          </h1>
          <p className="text-blue-100 mt-1">
            Последнее обновление: {currentDate}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Intro */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r">
            <p className="text-gray-800">
              Настоящее Пользовательское соглашение (далее — «Соглашение»)
              регулирует отношения между [Название компании] (далее — «Мы»,
              «Сервис») и пользователем (далее — «Вы») при использовании нашего
              веб-сайта, мобильного приложения или иных услуг.
            </p>
          </div>

          {/* Section 1 */}
          <div className="mb-8">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">
              1. Общие положения
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">1.1.</span>
                Используя Сервис, Вы соглашаетесь с условиями данного
                Соглашения, Политикой конфиденциальности и иными применимыми
                документами.
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">1.2.</span>
                Если Вы не согласны с условиями, Вы должны немедленно прекратить
                использование Сервиса.
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">1.3.</span>
                Сервис предоставляется «как есть», без гарантий бесперебойной
                работы и соответствия Вашим ожиданиям.
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="mb-8">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">
              2. Регистрация и учетная запись
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">2.1.</span>
                Для доступа к некоторым функциям может потребоваться
                регистрация.
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">2.2.</span>
                Вы обязуетесь:
                <ul className="ml-6 mt-2 space-y-2">
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    Предоставлять достоверные и актуальные данные при
                    регистрации
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    Не передавать учетные данные третьим лицам
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    Немедленно уведомлять нас о несанкционированном доступе к
                    аккаунту
                  </li>
                </ul>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">2.3.</span>
                Мы оставляем за собой право блокировать аккаунт при нарушении
                условий Соглашения.
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="mb-8">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">
              3. Интеллектуальная собственность
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">3.1.</span>
                Все материалы Сервиса (тексты, изображения, логотипы,
                программный код) защищены авторским правом.
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">3.2.</span>
                Запрещается копирование, распространение или иное использование
                материалов без нашего письменного согласия.
              </li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="mb-8">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">
              4. Ограничения ответственности
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">4.1.</span>
                Мы не несем ответственности за:
                <ul className="ml-6 mt-2 space-y-2">
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    Прямой или косвенный ущерб, возникший в результате
                    использования Сервиса
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    Действия третьих лиц, включая хакерские атаки
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    Невозможность доступа к Сервису по техническим причинам
                  </li>
                </ul>
              </li>
            </ul>
          </div>

          {/* Section 5 */}
          <div className="mb-8">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">
              5. Изменения условий
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">5.1.</span>
                Мы можем изменять условия Соглашения в одностороннем порядке.
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">5.2.</span>
                Актуальная версия всегда будет доступна на этой странице.
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">5.3.</span>
                Продолжение использования Сервиса после изменений означает Ваше
                согласие с новыми условиями.
              </li>
            </ul>
          </div>

          {/* Section 6 */}
          <div className="mb-8">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-4">
              6. Заключительные положения
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">6.1.</span>
                Соглашение регулируется законодательством [Укажите страну].
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">6.2.</span>
                Все споры разрешаются путем переговоров, а при невозможности — в
                судебном порядке.
              </li>
            </ul>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 pt-6 mt-8">
            <p className="text-gray-600 text-center">
              По всем вопросам обращайтесь:{' '}
              <a
                href="mailto:info@зарахоум.рф"
                className="text-blue-600 hover:underline"
              >
                info@зарахоум.рф
              </a>
            </p>
            <p className="text-gray-500 text-sm text-center mt-2">
              © {new Date().getFullYear()} ZARAHOME. Все права защищены.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServiceContent;
