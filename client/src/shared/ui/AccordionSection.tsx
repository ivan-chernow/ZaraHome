import React from 'react';
import Typography from '@mui/material/Typography';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';

interface AccordionSectionProps {
  expanded: boolean;
  onChange: (event: React.SyntheticEvent, isExpanded: boolean) => void;
}

const AccordionSection: React.FC<AccordionSectionProps> = ({
  expanded,
  onChange,
}) => {
  return (
    <Accordion expanded={expanded} onChange={onChange}>
      <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
        <Typography
          component="span"
          className="text-[22px] font-medium text-black"
        >
          Как H&M удается поддерживать такие низкие цены?
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography className="text-[#00000080]">
          H&M поддерживает низкие цены за счет глобального производства в
          странах с дешевой рабочей силой, оптимизации цепочек поставок,
          использования простых материалов, быстрого обновления коллекций и
          минимизации логистических издержек.
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
};

export default AccordionSection;
