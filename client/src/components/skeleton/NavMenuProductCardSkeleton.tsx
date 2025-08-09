"use client";

import React from "react";

const NavMenuProductCardSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse">
      <div className="aspect-square w-full rounded-lg bg-gray-200" />
      <div className="mt-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-5 bg-gray-200 rounded w-1/3 mt-3" />
      </div>
    </div>
  );
};

export default NavMenuProductCardSkeleton;
