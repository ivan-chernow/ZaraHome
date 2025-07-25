import React from 'react';
import Container from "@mui/material/Container";
import NewsBlock from "@/components/News/NewsBlock";

const NewsBlockSection = ({title, subtitle, btnText, bgImg, margin, categorySlug}: {title: string, subtitle: string, btnText: string, bgImg: string, margin: string, categorySlug: string}) => {
	return (
		<div
			style={{backgroundImage: `url(${bgImg})`, marginTop: margin}}
			className="bg-no-repeat bg-center  h-[430px] flex items-center justify-center ">
			<Container maxWidth='lg' className='flex flex-col items-center mt-[340px]'>
				<NewsBlock title={title} subtitle={subtitle} btnText={btnText} categorySlug={categorySlug}/>
			</Container>
		</div>
	);
};

export default NewsBlockSection;