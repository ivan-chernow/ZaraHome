"use client"

import * as React from 'react';
import {styled} from '@mui/material/styles';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import MuiAccordion, {AccordionProps} from '@mui/material/Accordion';
import MuiAccordionSummary, {
	AccordionSummaryProps,
	accordionSummaryClasses,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import Container from "@mui/material/Container";
import { motion } from 'framer-motion';

const Accordion = styled((props: AccordionProps) => (
	<MuiAccordion disableGutters elevation={0} square {...props} />
))(() => ({
	border: 'none',
	'&:not(:last-child)': {
		marginBottom: '24px',
	},
	'&::before': {
		display: 'none',
	},
	borderRadius: '16px',
	boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
	transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
	overflow: 'hidden',
	
	'&:hover': {
		boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
		transform: 'translateY(-2px)',
	},
	
	'&.Mui-expanded': {
		boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
		transform: 'translateY(-4px)',
	},
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
	<MuiAccordionSummary
		sx={{position: 'relative'}}
		expandIcon={
			<ArrowForwardIosIcon
				sx={{
					p: 1.5,
					width: 32,
					height: 32,
					backgroundColor: '#000',
					borderRadius: '50%',
					'& path': {
						fill: 'white',
						stroke: 'white'
					},
					transition: 'all 0.3s ease',
					'&:hover': {
						backgroundColor: '#333',
						transform: 'scale(1.1)',
					},
				}}
			/>
		}
		{...props}
	/>
))(() => ({
	backgroundColor: 'white',
	flexDirection: 'row-reverse',
	minHeight: '80px',
	padding: '24px 32px',
	transition: 'all 0.3s ease',
	
	'&:hover': {
		backgroundColor: '#fafafa',
	},
	
	[`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]: {
		transform: 'rotate(90deg)',
		transition: 'transform 0.3s ease',
	},
	
	[`& .${accordionSummaryClasses.content}`]: {
		marginLeft: '16px',
		transition: 'all 0.3s ease',
	},
	
	[`&.${accordionSummaryClasses.expanded} .${accordionSummaryClasses.content}`]: {
		marginTop: '0',
		marginLeft: '16px',
	},
}));

const AccordionDetails = styled(MuiAccordionDetails)(() => ({
	padding: '0 32px 32px 32px',
	backgroundColor: '#fafafa',
	borderTop: '1px solid #f0f0f0',
	transition: 'all 0.3s ease',
}));

export function Question() {
	const [expanded, setExpanded] = React.useState<string | false>(false);

	const handleChange = (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
		setExpanded(newExpanded ? panel : false);
	};

	return (
		<section id="faq" data-section="faq" className="py-20 bg-gradient-to-br from-gray-50 to-white">
			<Container maxWidth='xl'>
				<div className="text-center mb-20">
					<h2 className='mb-6 font-light text-[42px] text-gray-900'>Часто задаваемые вопросы</h2>
					<p className="text-lg font-medium text-gray-600 max-w-2xl mx-auto">Скорее всего тут уже есть ответ и на ваш вопрос. Если нет - мы всегда готовы помочь!</p>
				</div>
			</Container>

			<Container maxWidth='lg'>
				<Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
					<AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
						<Typography component="span" className='text-[22px] font-semibold text-gray-900 leading-relaxed'>
							Как H&M удается поддерживать такие низкие цены?
						</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<motion.div
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3, ease: "easeOut" }}
						>
							<Typography className='text-[16px] text-gray-700 leading-relaxed'>
								H&M поддерживает низкие цены за счет глобального производства в странах с дешевой рабочей
								силой, оптимизации цепочек поставок, использования простых материалов, быстрого обновления коллекций и
								минимизации логистических издержек.
							</Typography>
						</motion.div>
					</AccordionDetails>
				</Accordion>

				<Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
					<AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
						<Typography component="span" className='text-[22px] font-semibold text-gray-900 leading-relaxed'>
							Проводит ли H&M конкурсы для своих покупателей?
						</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<motion.div
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3, ease: "easeOut" }}
						>
							<Typography className='text-[16px] text-gray-700 leading-relaxed'>
								Информацию обо всех кампаниях, проводимых H&M, вы можете
								найти на нашем сайте в разделе Акции / Скидки H&M. При подаче заявки на участие в конкурсе в Интернете мы
								советуем вам прочитать текст, напечатанный мелким шрифтом и правовые оговорки. При этом в большинстве
								случаев вы сможете заметить, что рекламная кампания не имеет никакого отношения к бренду HM. Если в ответ
								на электронное письмо, предлагающее выиграть конкурс H&M, вы отправили свой номер мобильного телефона,
								если вы стали жертвой мошенников и теперь получаете смс-сообщения нежелательного характера, мы советуем
								вам связаться со своим провайдером сотовой связи и заблокировать нежелательный номер.
							</Typography>
						</motion.div>
					</AccordionDetails>
				</Accordion>

				<Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
					<AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
						<Typography component="span" className='text-[22px] font-semibold text-gray-900 leading-relaxed'>
							В Facebook и Instagram предлагают подарочные карты, которые якобы
							действительны в магазинах H&M. Это правда?
						</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<motion.div
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3, ease: "easeOut" }}
						>
							<Typography className='text-[16px] text-gray-700 leading-relaxed'>
								Нет, это мошенничество — H&M официально предупреждает, что не распространяет подарочные карты
								через соцсети, и подобные предложения являются фейковыми.
							</Typography>
						</motion.div>
					</AccordionDetails>
				</Accordion>

				<Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
					<AccordionSummary aria-controls="panel4d-content" id="panel4d-header">
						<Typography component="span" className='text-[22px] font-semibold text-gray-900 leading-relaxed'>
							Где можно купить подарочные карты H&M?
						</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<motion.div
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3, ease: "easeOut" }}
						>
							<Typography className='text-[16px] text-gray-700 leading-relaxed'>
								Подарочные карты H&M можно купить только в официальных магазинах бренда или на сайте hm.com —
								все предложения в соцсетях являются мошенническими.
							</Typography>
						</motion.div>
					</AccordionDetails>
				</Accordion>
			</Container>
		</section>
	);
}

export default Question;