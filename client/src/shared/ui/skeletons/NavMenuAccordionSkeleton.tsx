'use client';

import React from 'react';

const Column = () => (
  <div className="w-1/4 min-w-[250px] px-4">
    <div className="h-5 bg-gray-200 rounded w-1/2 mb-4 animate-pulse" />
    <ul className="space-y-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <li key={i} className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
      ))}
    </ul>
  </div>
);

const NavMenuAccordionSkeleton: React.FC = React.memo(() => {
  return (
    <div className="flex w-full px-6 pb-[70px]">
      {Array.from({ length: 4 }).map((_, i) => (
        <Column key={i} />
      ))}
    </div>
  );
});

NavMenuAccordionSkeleton.displayName = 'NavMenuAccordionSkeleton';

export default NavMenuAccordionSkeleton;
