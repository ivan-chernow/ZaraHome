'use client';

import React, { useState } from 'react';

interface ColorsProps {
  display?: string;
  color: string;
  isActive: boolean;
  onClick: () => void;
}

const Color = ({ display, color, onClick, isActive }: ColorsProps) => {
  const [isHoveredColor, setIsHoveredColor] = useState(false);

  return (
    <div
      onClick={onClick}
      className={`
        flex items-center mb-1 mr-2 transition-all duration-300 ease-in-out ${display}
        ${isActive ? 'ring-2 ring-black scale-110 drop-shadow-lg' : ''}
      `}
      style={{ borderRadius: '100%' }}
    >
      <div
        className="relative w-[18px] h-[18px] cursor-pointer"
        onMouseEnter={() => setIsHoveredColor(true)}
        onMouseLeave={() => setIsHoveredColor(false)}
      >
        <div
          className={`absolute   rounded-full shadow-md ${
            isHoveredColor ? 'opacity-100' : 'opacity-0'
          }`}
        ></div>
        <div
          style={{ backgroundColor: color }}
          className={`
            absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
            w-[18px] h-[18px] rounded-full shadow-md cursor-pointer
          `}
        ></div>
      </div>
    </div>
  );
};

export default Color;
