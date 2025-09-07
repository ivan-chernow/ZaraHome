import React from 'react';
import { useDispatch } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import { closeModalAuth } from '@/features/auth/model/auth.slice';

const CloseIconCart: React.FC = () => {
	const dispatch = useDispatch()
	return (
		<div
			className='w-[25px] h-[25px] bg-[#0000001A] rounded-full cursor-pointer absolute right-[15px] top-[15px] flex items-center justify-center hover:scale-115 ease-in duration-100 transition-all'
			onClick={() => dispatch(closeModalAuth())}
		>
			<CloseIcon fontSize='small'/>
		</div>
	);
};

export default CloseIconCart;