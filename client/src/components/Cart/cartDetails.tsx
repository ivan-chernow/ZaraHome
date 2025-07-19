'use client'

import React, { RefObject, useState, useEffect } from 'react';
import CartEmpty from "@/components/Cart/cartEmpty";
import { useDispatch } from "react-redux";
import { useClickOutside } from "@/hooks/useClickOutside";
import { closeCart } from "@/store/features/cart/cart.slice";
import { Fade } from "@mui/material";
import { createPortal } from 'react-dom';

interface CartDetailsProps {
	cartButtonRef: RefObject<HTMLDivElement | null>;
}

const CartDetails = ({ cartButtonRef }: CartDetailsProps) => {
	const dispatch = useDispatch();
	const [position, setPosition] = useState({ top: 0, left: 0 });

	const cartRef = useClickOutside((event: MouseEvent) => {
		// Проверяем, что клик не был по кнопке корзины
		if (!cartButtonRef.current?.contains(event.target as Node)) {
			dispatch(closeCart());
		}
	});

	useEffect(() => {
		const calculatePosition = () => {
			if (cartButtonRef.current) {
				const rect = cartButtonRef.current.getBoundingClientRect();
				const cartWidth = 293; // The width of the cart details panel
				setPosition({
					top: rect.bottom + window.scrollY + 37,
					left: rect.right + window.scrollX - cartWidth, // Align right edge
				});
			}
		};

		calculatePosition();

		window.addEventListener('resize', calculatePosition);
		return () => window.removeEventListener('resize', calculatePosition);
	}, [cartButtonRef]);

	const cartContent = (
		<Fade in={true} timeout={500}>
			<div
				ref={cartRef}
				className="w-[325px] h-[336px] bg-white shadow-lg flex flex-col items-center justify-center absolute cursor-default z-[99999]"
				style={{ top: `${position.top}px`, left: `${position.left}px` }}
			>
				<CartEmpty />
			</div>
		</Fade>
	);

	return createPortal(cartContent, document.body);
};

export default CartDetails;