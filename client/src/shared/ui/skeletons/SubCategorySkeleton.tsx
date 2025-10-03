import React from 'react';
import Skeleton from '@mui/material/Skeleton';

const SubCategorySkeleton: React.FC = () => {
  return (
    <div className="flex flex-col flex-1 pl-0">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center mb-[39px]">
        <Skeleton variant="rectangular" width={24} height={24} />
        <Skeleton variant="text" width={20} height={24} className="mx-2" />
        <Skeleton variant="text" width={180} height={24} />
      </div>

      {/* Title and sorting skeleton */}
      <div className="flex flex-col mb-[60px] w-full">
        <Skeleton variant="text" width={320} height={48} />

        <div className="flex items-center justify-end mt-[53px]">
          <Skeleton
            variant="rectangular"
            width={170}
            height={32}
            className="rounded mr-[12px]"
          />
          <Skeleton
            variant="rectangular"
            width={170}
            height={32}
            className="rounded"
          />
        </div>
      </div>

      {/* Products grid skeleton */}
      <div className="w-full min-h-[300px] flex items-center justify-center">
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
          {Array.from({ length: 12 }).map((_, i) => (
            <li
              key={i}
              className="w-[300px] h-[497px] mr-[-1px] bg-white relative group overflow-hidden rounded-xl shadow animate-pulse flex flex-col"
            >
              <div
                className="mb-[18px] relative overflow-hidden"
                style={{ width: 'auto', height: 326 }}
              >
                <Skeleton
                  variant="rectangular"
                  width={300}
                  height={326}
                  className="rounded-xl"
                />
                <div className="absolute right-0 bottom-[-2.2px] z-10">
                  <Skeleton variant="circular" width={56} height={56} />
                </div>
              </div>
              <div className="absolute top-2 left-2 z-10 flex flex-col gap-y-1">
                <Skeleton
                  variant="rectangular"
                  width={40}
                  height={24}
                  className="rounded"
                />
                <Skeleton
                  variant="rectangular"
                  width={40}
                  height={24}
                  className="rounded"
                />
              </div>
              <div className="flex px-[10px] gap-x-2 mb-2">
                {Array.from({ length: 4 }).map((_, j) => (
                  <Skeleton key={j} variant="circular" width={24} height={24} />
                ))}
              </div>
              <Skeleton
                variant="text"
                width={180}
                height={28}
                className="ml-2"
              />
              <Skeleton
                variant="text"
                width={120}
                height={20}
                className="ml-2 mb-auto"
              />
              <div className="flex justify-between mt-4 px-[10px] items-end">
                <Skeleton variant="text" width={80} height={32} />
                <Skeleton
                  variant="rectangular"
                  width={56}
                  height={40}
                  className="rounded"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export { SubCategorySkeleton };
export default SubCategorySkeleton;
