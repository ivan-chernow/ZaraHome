import React from 'react';

const VerticalLine = ({height}) => {
	return (
		<>
			<span style={{height: height}} className='w-[1px] bg-[#0000001A] '></span>
		</>
	);
};

export default VerticalLine;