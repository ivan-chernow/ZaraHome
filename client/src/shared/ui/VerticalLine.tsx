import React from "react";

interface VerticalLineProps {
  height: string | number;
}

const VerticalLine: React.FC<VerticalLineProps> = ({ height }) => {
  return (
    <span
      style={{ height }}
      className="w-[1px] bg-[#0000001A]"
      aria-hidden="true"
    />
  );
};

export default VerticalLine;
