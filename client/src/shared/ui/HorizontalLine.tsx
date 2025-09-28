import React from 'react';

const HorizontalLine = React.memo(({ width }: { width: string }) => {
  return (
    <span
      style={{ width: width }}
      className="block h-[1px] bg-[#00000040] self-center "
    ></span>
  );
});

HorizontalLine.displayName = 'HorizontalLine';

export default HorizontalLine;
