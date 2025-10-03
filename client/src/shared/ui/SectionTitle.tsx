'use client';
import React from 'react';

interface SectionTitleProps {
  title: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ title }) => {
  return (
    <div className={`flex items-center mb-[37px]`}>
      <h4 className="font-light text-[42px]">{title}</h4>
    </div>
  );
};

export default SectionTitle;
