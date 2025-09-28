import React from 'react';

const PromocodesSkeleton: React.FC = React.memo(() => {
  return (
    <div className="animate-pulse">
      <div className="max-w-[1200px] mx-auto p-6">
        <div className="flex flex-col items-center">
          <div className="h-[42px] bg-gray-200 rounded w-[400px] mb-[37px]"></div>

          {/* Секция создания промокода */}
          <div className="flex items-center mb-[28px]">
            <div className="h-[20px] bg-gray-200 rounded w-[200px] mr-[5px]"></div>
            <div className="h-[2px] bg-gray-200 rounded w-[615px]"></div>
          </div>

          {/* Форма создания промокода */}
          <div className="mb-[37px] w-full max-w-[1000px]">
            <div className="flex items-center mb-[23px]">
              <div className="flex flex-col mr-[27px]">
                <div className="h-[20px] bg-gray-200 rounded w-[150px] mb-[5px] ml-[20px]"></div>
                <div className="h-[48px] bg-gray-200 rounded w-[410px]"></div>
              </div>
              <div className="flex flex-col">
                <div className="h-[20px] bg-gray-200 rounded w-[100px] mb-[5px] ml-[20px]"></div>
                <div className="h-[48px] bg-gray-200 rounded w-[410px]"></div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="h-[56px] bg-gray-200 rounded w-[358px]"></div>
            </div>
          </div>

          {/* Секция списка промокодов */}
          <div className="flex items-center mb-[28px] mt-8">
            <div className="h-[20px] bg-gray-200 rounded w-[180px] mr-[5px]"></div>
            <div className="h-[2px] bg-gray-200 rounded w-[615px]"></div>
          </div>

          {/* Таблица промокодов */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden w-full max-w-[1000px]">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {[1, 2, 3, 4, 5].map(i => (
                      <th key={i} className="px-6 py-3">
                        <div className="h-[16px] bg-gray-200 rounded w-[80px]"></div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[1, 2, 3].map(i => (
                    <tr key={i}>
                      {[1, 2, 3, 4, 5].map(j => (
                        <td key={j} className="px-6 py-4">
                          <div className="h-[16px] bg-gray-200 rounded w-[60px]"></div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

PromocodesSkeleton.displayName = 'PromocodesSkeleton';

export default PromocodesSkeleton;
