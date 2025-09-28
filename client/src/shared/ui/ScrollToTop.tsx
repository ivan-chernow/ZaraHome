'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ScrollToTop: React.FC = React.memo(() => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsVisible(scrollTop > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-white border-2 border-gray-200 rounded-full shadow-lg hover:shadow-xl text-gray-600 hover:text-black hover:border-gray-300 z-50 flex items-center justify-center group transition-all duration-300 cursor-pointer"
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0, y: 20 }}
          whileHover={{
            scale: 1.05,
            y: -2,
            backgroundColor: '#f8fafc',
            borderColor: '#d1d5db',
          }}
          whileTap={{ scale: 0.95 }}
          transition={{
            duration: 0.2,
            ease: 'easeOut',
          }}
          aria-label="Прокрутить наверх"
        >
          {/* Иконка стрелки */}
          <motion.svg
            className="w-5 h-5 cursor-pointer"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            initial={{ y: 0 }}
            animate={{ y: 0 }}
            whileHover={{ y: -1 }}
            transition={{ duration: 0.2 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 15l7-7 7 7"
            />
          </motion.svg>

          {/* Всплывающая подсказка */}
          <motion.div
            className="absolute right-full mr-3 px-2 py-1 bg-gray-800 text-white text-xs rounded-md whitespace-nowrap opacity-0 pointer-events-none"
            initial={{ opacity: 0, x: 10 }}
            whileHover={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            Наверх
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-3 border-l-gray-800 border-t-1.5 border-t-transparent border-b-1.5 border-b-transparent"></div>
          </motion.div>
        </motion.button>
      )}
    </AnimatePresence>
  );
});

ScrollToTop.displayName = 'ScrollToTop';

export default ScrollToTop;
