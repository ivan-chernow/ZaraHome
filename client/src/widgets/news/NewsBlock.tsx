import React from 'react';
import MainButton from "@/shared/ui/Button/MainButton";
import Link from 'next/link';

const NewsBlock = ({
	title,
	subtitle,
	btnText,
	categorySlug
}: {
	title: string,
	subtitle: string,
	btnText: string,
	categorySlug: string
}) => {
	
	return (
		<div className='bg-white py-[22px] px-[120px] flex flex-col items-center'>
			<h2 className="text-[44px] ">{title}</h2>
			<p className=" text-[18px] mb-[14px]">{subtitle}</p>
			<Link href={`/products/category/${categorySlug}`}>
				<MainButton text={btnText} disabled={false} type='button' height='56px' width='249px' />
			</Link>
		</div>
	);
};

export default NewsBlock;