import React from 'react';
import Image from "next/image";
import Link from 'next/link'

const Logo = () => {
	return (
		<div className='text-center'>
			<Link href="/" className='inline-block '>
				<Image src='/assets/img/Header/logo1.svg' alt='Logo' width={184} height={30}/>
			</Link>
		</div>
	);
};

export default Logo;