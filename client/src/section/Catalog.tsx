import React from 'react';
import Container from "@mui/material/Container";
import CatalogItem from "@/components/Catalog/CatalogItem";
import { catalog } from 'public/assets/data/catalog';

const Catalog = () => {
	return (
		<section className='mt-[85px]'>
			<Container maxWidth='lg'>
				<h2 className='mb-[50px] text-[42px] font-light'>Каталог товаров</h2>
			</Container>
			<Container maxWidth='xl'>
				<ul className="flex items-center justify-center flex-wrap">
					{catalog.map((card, idx) => (
						<CatalogItem card={card} key={idx} />
					))}
				</ul>
			</Container>

		</section>
	);
};

export default Catalog;