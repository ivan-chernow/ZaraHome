'use client';
import React, { useState } from 'react';
import Image from 'next/image';

const HelpElement = React.memo(
  ({ svgPath, width, height, title, subtitle, link }) => {
    const [isHovered, setIsHovered] = useState(false);
    const handleClick = () => {
      window.open(link, '_blank');
    };

    return (
      <li
        className="relative flex flex-col items-center justify-center bg-white w-[415px] h-[221px] rounded-lg cursor-pointer overflow-hidden transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        <div
          className={`
          absolute right-[11px] top-[11px]
          transition-all duration-300 ease-in-out
          ${isHovered ? 'opacity-100' : 'opacity-0'}
        `}
        >
          <Image
            src="/assets/img/Help/out.svg"
            alt="Close icon"
            width={20}
            height={20}
            className="block"
          />
        </div>

        <div className="mb-[17px] transition-transform duration-500 hover:scale-110">
          <Image
            src={svgPath}
            alt="Feature icon"
            width={width}
            height={height}
          />
        </div>

        <div className="text-center px-4">
          <h3 className="text-[28px] mb-[16px] font-medium">{title}</h3>
          <p className="text-[#00000080]">{subtitle}</p>
        </div>
      </li>
    );
  }
);

HelpElement.displayName = 'HelpElement';

export default HelpElement;
