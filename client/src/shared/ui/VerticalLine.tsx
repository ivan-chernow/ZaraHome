import React from 'react';

interface VerticalLineProps {
  height: string | number;
}

const VerticalLine: React.FC<VerticalLineProps> = React.memo(({ height }) => {
  return (
    <span
      style={{ height }}
      className="w-[1px] bg-[#0000001A]"
      aria-hidden="true"
    />
  );
});

VerticalLine.displayName = 'VerticalLine';

export default VerticalLine;
