'use client';

import React from 'react';

const NavMenuGridSkeleton: React.FC<{ items?: number }> = React.memo(
  ({ items = 4 }) => {
    return (
      <div className="grid grid-cols-4 gap-6 w-full py-8">
        {Array.from({ length: items }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-square w-full rounded-lg bg-gray-200" />
            <div className="mt-4 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
              <div className="h-5 bg-gray-200 rounded w-1/3 mt-3" />
            </div>
          </div>
        ))}
      </div>
    );
  }
);

NavMenuGridSkeleton.displayName = 'NavMenuGridSkeleton';

export default NavMenuGridSkeleton;
