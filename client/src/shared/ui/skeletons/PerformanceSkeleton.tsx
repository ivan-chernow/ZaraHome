import React from 'react';
import { Skeleton } from '@mui/material';

export const PerformanceSkeleton: React.FC = () => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <Skeleton
          variant="text"
          width="50%"
          height={60}
          className="mx-auto mb-4"
        />
        <Skeleton variant="text" width="70%" height={30} className="mx-auto" />
      </div>
      <div className="space-y-6">
        <Skeleton variant="rectangular" width="100%" height={200} />
        <Skeleton variant="rectangular" width="100%" height={300} />
      </div>
    </div>
  </div>
);
