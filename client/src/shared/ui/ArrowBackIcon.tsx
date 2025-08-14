import React from 'react';
import {useDispatch} from "react-redux";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { setView } from '@/features/auth/model/auth.slice';

const ArrowBackIconCart = () => {
	const dispatch = useDispatch()
	return (
		<div
			className='w-[25px] h-[25px] bg-[#0000001A] rounded-full cursor-pointer absolute left-[15px] top-[15px] flex items-center justify-center hover:scale-115 ease-in duration-100 transition-all'
			onClick={() => dispatch(setView('login'))}
		>
			<ArrowBackIcon fontSize='small'/>
		</div>
	);
};

export default ArrowBackIconCart;