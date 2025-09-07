import React from 'react';

const ChangePasswordSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse">
      <div className="max-w-[1200px] mx-auto p-6">
        <div className="flex flex-col items-center">
          <div className="h-[42px] bg-gray-200 rounded w-[300px] mb-[37px]"></div>
          
          {/* Секция смены пароля */}
          <div className="flex items-center mb-[28px]">
            <div className="h-[20px] bg-gray-200 rounded w-[180px] mr-[5px]"></div>
            <div className="h-[2px] bg-gray-200 rounded w-[615px]"></div>
          </div>

          {/* Форма */}
          <div className="mb-[37px] w-full max-w-[1000px]">
            <div className="flex flex-col space-y-[23px]">
              <div className="flex flex-col">
                <div className="h-[20px] bg-gray-200 rounded w-[150px] mb-[5px] ml-[20px]"></div>
                <div className="h-[48px] bg-gray-200 rounded w-full max-w-[410px]"></div>
              </div>
              <div className="flex flex-col">
                <div className="h-[20px] bg-gray-200 rounded w-[150px] mb-[5px] ml-[20px]"></div>
                <div className="h-[48px] bg-gray-200 rounded w-full max-w-[410px]"></div>
              </div>
              <div className="flex flex-col">
                <div className="h-[20px] bg-gray-200 rounded w-[150px] mb-[5px] ml-[20px]"></div>
                <div className="h-[48px] bg-gray-200 rounded w-full max-w-[410px]"></div>
              </div>
            </div>
            <div className="mt-[23px] flex justify-center">
              <div className="h-[56px] bg-gray-200 rounded w-[358px]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordSkeleton;
