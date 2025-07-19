import React from 'react';
import Image from "next/image";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CloseIcon from "@mui/icons-material/Close";

const CartItem = () => {
	return (
		<li className='flex items-center py-[20px]'>
			<Image alt='img' src='/assets/img/Catalog/product2.png' width={79} height={79} className='mr-[9px]'/>
			<div className='flex flex-col mr-[200px]'>
				<h4 className='font-bold mb-[1px]'>LEATHER SANDALS</h4>
				<p className="font-medium text-[#00000080]">Кожаные сандали</p>
			</div>
			<div className='flex  items-center justify-center'>
				<div
					className="w-[25px] h-[25px] bg-[#0000001A] rounded-full cursor-pointer flex items-center justify-center hover:scale-115 ease-in duration-100 transition-all mr-[10px]">
					<RemoveOutlinedIcon fontSize='small'/>
				</div>
				<input type="text"
							 className='w-[50px] h-[33px] border-1 font-roboto font-medium text-[18px] text-center '/>
				<div
					className="w-[25px] h-[25px] bg-[#0000001A] rounded-full cursor-pointer flex items-center justify-center hover:scale-115 ease-in duration-100 transition-all ml-[10px]">
					<AddOutlinedIcon fontSize='small'/>
				</div>
			</div>
			<p className="font-medium text-[20px] ml-[21px] font-roboto">11 540 <span
				className='font-bold font-ysabeau text-[16px]'>₽</span></p>
			<div
				className='w-[25px] h-[25px] bg-[#0000001A] rounded-full cursor-pointer flex items-center justify-center hover:scale-115 ease-in duration-100 transition-all ml-[17px]'>
				<CloseIcon fontSize='small'/>
			</div>

		</li>

	);
};

export default CartItem;