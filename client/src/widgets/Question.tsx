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

const Accordion = styled((props: AccordionProps) => (
	<MuiAccordion disableGutters elevation={0} square {...props} />
))(({theme}) => ({
	border: `1px solid ${theme.palette.divider}`,
	'&:not(:last-child)': {
		borderBottom: 0,
	},
	'&::before': {
		display: 'none',
	},
	borderRadius: '8px',
	marginBottom: '16px',
	transition: 'all 0.3s ease',

}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
	<MuiAccordionSummary
		sx={{position: 'relative'}}
		expandIcon={
			<ArrowForwardIosIcon
				sx={{
					p: 1,
					width: 30,
					height: 30,
					backgroundColor: 'black',
					'& path': {
						fill: 'white',
						stroke: 'white'
					},
				}}
			/>
		}
		{...props}
	/>
))(({theme}) => ({
	backgroundColor: 'white',
	flexDirection: 'row-reverse',
	minHeight: '10px',
	[`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]: {
		transform: 'rotate(90deg)',
	},
	[`& .${accordionSummaryClasses.content}`]: {
		marginLeft: theme.spacing(1),
		transition: 'margin 0.3s ease',
	},
	// Добавляем стиль для смещения заголовка при раскрытии
	[`&.${accordionSummaryClasses.expanded} .${accordionSummaryClasses.content}`]: {
		marginTop: '80px', // Смещаем заголовок на 50px вниз при раскрытии
		marginLeft: '15px'
	},
}));

const AccordionDetails = styled(MuiAccordionDetails)(({theme}) => ({
	padding: theme.spacing(3),
}));

export function Question() {
	const [expanded, setExpanded] = React.useState<string | false>(false);

	const handleChange = (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
		setExpanded(newExpanded ? panel : false);
	};

	return (
		<section>
			<Container maxWidth='xl'>
				<h2 className='mb-[10px] font-light text-[42px]'>Часто задаваемые вопросы</h2>
				<p className="mb-[86px] font-medium text-[#00000080]">Скорее всего тут уже есть ответ и на ваш</p>
			</Container>

			<Container maxWidth='lg'>
				<Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}
									 sx={{boxShadow: 0, borderRadius: 0, border: 0}}>
					<AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
						<Typography component="span" className='text-[22px] font-medium text-black'>Как H&M удается поддерживать
							такие низкие цены?</Typography>
					</AccordionSummary>
					<AccordionDetails sx={{boxShadow: 0, borderRadius: 0, border: 0}}>
						<Typography className='text-[#00000080] pl-[35px]'>
							H&M поддерживает низкие цены за счет глобального производства в странах с дешевой рабочей
							силой, оптимизации цепочек поставок, использования простых материалов, быстрого обновления коллекций и
							минимизации логистических издержек.
						</Typography>
					</AccordionDetails>
				</Accordion>

				<Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}
									 sx={{boxShadow: 0, borderRadius: 0, border: 0}}>
					<AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
						<Typography component="span" className='text-[22px] font-medium text-black'>Проводит ли H&M конкурсы для
							своих покупателей?</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<Typography className='text-[#00000080] pl-[35px]'>Информацию обо всех кампаниях, проводимых H&M, вы можете
							найти на нашем сайте в разделе Акции / Скидки H&M. При подаче заявки на участие в конкурсе в Интернете мы
							советуем вам прочитать текст, напечатанный мелким шрифтом и правовые оговорки. При этом в большинстве
							случаев вы сможете заметить, что рекламная кампания не имеет никакого отношения к бренду HM. Если в ответ
							на электронное письмо, предлагающее выиграть конкурс H&M, вы отправили свой номер мобильного телефона,
							если вы стали жертвой мошенников и теперь получаете смс-сообщения нежелательного характера, мы советуем
							вам связаться со своим провайдером сотовой связи и заблокировать нежелательный номер.</Typography>
					</AccordionDetails>
				</Accordion>

				<Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}
									 sx={{boxShadow: 0, borderRadius: 0, border: 0}}>
					<AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
						<Typography component="span" className='text-[22px] font-medium text-black'>В Facebook и Instagram
							предлагают подарочные карты, которые якобы
							действительны в магазинах H&M. Это правда?</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<Typography className='text-[#00000080] pl-[35px]'>
							Нет, это мошенничество — H&M официально предупреждает, что не распространяет подарочные карты
							через соцсети, и подобные предложения являются фейковыми.
						</Typography>
					</AccordionDetails>
				</Accordion>

				<Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}
									 sx={{boxShadow: 0, borderRadius: 0, border: 0}}>
					<AccordionSummary aria-controls="panel4d-content" id="panel4d-header">
						<Typography component="span" className='text-[22px] font-medium text-black'>Где можно купить подарочные
							карты H&M?</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<Typography className='text-[#00000080] pl-[35px]'>
							Подарочные карты H&M можно купить только в официальных магазинах бренда или на сайте hm.com —
							все предложения в соцсетях являются мошенническими.
						</Typography>
					</AccordionDetails>
				</Accordion>
			</Container>
		</section>
	);
}

export default Question;