import Skeleton from "@mui/material/Skeleton";

export const ProductCardSkeleton = () => (
  <li className="w-[300px] h-[497px] mr-[-1px] bg-white relative group overflow-hidden rounded-xl shadow animate-pulse flex flex-col">
    <div
      className="mb-[18px] relative overflow-hidden"
      style={{ width: "auto", height: 326 }}
    >
      <Skeleton
        variant="rectangular"
        width={300}
        height={326}
        className="rounded-xl"
      />
      <div className="absolute right-0 bottom-[-2.2px] z-10">
        <Skeleton variant="rectangular" width={56} height={56} />
      </div>
    </div>
    <div className="absolute top-2 left-2 z-10 flex flex-col gap-y-1">
      <Skeleton variant="circular" width={40} height={24} className="rounded" />
    </div>
    <div className="flex px-[10px] gap-x-2 mb-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} variant="circular" width={24} height={24} />
      ))}
    </div>
    <Skeleton variant="text" width={180} height={28} className="ml-2" />
    <Skeleton variant="text" width={120} height={20} className="ml-2 mb-auto" />
    <div className="flex justify-between mt-1 px-[10px] items-end">
      <Skeleton variant="text" width={80} height={40} />
      <Skeleton
        variant="rectangular"
        width={170}
        height={40}
        className="rounded"
      />
    </div>
  </li>
);
