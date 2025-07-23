import React from "react";

const HorizontalLine = ({ width }: { width: string }) => {
  return (
    <span
      style={{ width: width }}
      className="block h-[1px] bg-[#00000040] self-center "
    ></span>
  );
};

export default HorizontalLine;
