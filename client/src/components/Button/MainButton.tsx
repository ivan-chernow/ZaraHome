import React from 'react';
import { Button } from "@mui/material";

const MainButton = ({ text, disabled, onClick, type, height, width }: { text: string, disabled: boolean, onClick?: () => void, type: 'button' | 'submit', height?: string, width?: string }) => {
	return (
		<Button
			variant="outlined"
			disabled={disabled}
			onClick={onClick}
			type={type}
			fullWidth
			sx={{
				color: 'white',
				backgroundColor: 'black',
				borderColor: 'black',
				px: { width },
				py: { height },
				textTransform: 'none',
				fontFamily: 'font-ysabeau',
				fontSize: '18px',
				fontWeight: 500,
				letterSpacing: '0.5px',
				borderRadius: '0',
				transition: 'all 0.3s ease-in-out',
				'&:hover': {
					backgroundColor: 'transparent',
					color: 'black',
					borderColor: 'gray',
					boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
					transform: 'translateY(-2px)'
				},
				'&:active': {
					transform: 'translateY(0)',
				},
				'&.Mui-disabled': {
					backgroundColor: '#e0e0e0',
					color: '#9e9e9e',
					borderColor: '#e0e0e0',
					cursor: 'not-allowed',
					boxShadow: 'none',
					transform: 'none'
				}
			}}
		>
			{text}
		</Button>
	);
};

export default MainButton;