import React from 'react';
import { Skeleton } from '@mui/material';

export const ReviewsSkeleton: React.FC = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Skeleton variant="text" width="30%" height={50} className="mb-6" />
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Skeleton
                variant="circular"
                width={40}
                height={40}
                className="mr-3"
              />
              <Skeleton variant="text" width="20%" height={20} />
            </div>
            <Skeleton variant="text" width="100%" height={20} />
            <Skeleton variant="text" width="80%" height={20} />
          </div>
        ))}
      </div>
    </div>
  </div>
);
