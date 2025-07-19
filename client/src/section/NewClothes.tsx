import React, { useMemo } from 'react';
import NewsBlockSection from "@/components/News/NewsBlockSection";
import ProductCard from "@/components/ProductCard";
import Container from "@mui/material/Container";
import { useGetCatalogQuery } from '@/api/products.api';
import { getAllProducts } from '@/store/features/catalog/catalog.utils';
import slugify from 'slugify';

const NewClothes = () => {
	const { data: categories } = useGetCatalogQuery();

	const allProducts = useMemo(() => {
		if (!categories) return [];
		return getAllProducts(categories);
	}, [categories]);

	const newArrivals = useMemo(() => {
		return allProducts
			.filter(p => p.isNew)
			.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
			.slice(0, 3);
	}, [allProducts]);

	const discountedItems = useMemo(() => {
		return allProducts
			.filter(p => p.discount && p.discount > 0)
			.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
			.slice(0, 3);
	}, [allProducts]);

	const customSlugify = (text: string) => slugify(text.replace('й', 'y'), { lower: true, strict: true });

	return (
		<section className='relative'>
			<NewsBlockSection title='Новое поступление' subtitle='Коллекции этого сезона' btnText='Смотреть все новинки'
				bgImg='/assets/img/New%20Clothes/bg1.png' margin='0' categorySlug={customSlugify('Новинки')} />
			<Container maxWidth='lg'>
				<ul className='flex items-center justify-center flex-wrap mt-[50px] gap-3'>
					{newArrivals.map(product => (
						<ProductCard key={product.id} product={product} />
					))}
				</ul>
			</Container>
			<NewsBlockSection title='Скидки до 70%' subtitle='На самые популярные товары' btnText='Смотреть все скидки'
				bgImg='/assets/img/Discount/bg1.png' margin='50px' categorySlug={customSlugify('Скидки')} />
			<Container maxWidth='lg'>
				<ul className='flex items-center justify-center flex-wrap mt-[50px] gap-3'>
					{discountedItems.map(product => (
						<ProductCard key={product.id} product={product} />
					))}
				</ul>
			</Container>
		</section>
	);
};

export default NewClothes;