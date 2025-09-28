import React from 'react';
import { useDispatch } from 'react-redux';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { setView } from '@/features/auth/model/auth.slice';

const ArrowBackIconCart: React.FC = () => {
  const dispatch = useDispatch();
  return (
    <div
      className="w-[25px] h-[25px] bg-[#0000001A] rounded-full cursor-pointer absolute left-[15px] top-[15px] flex items-center justify-center hover:scale-115 ease-in duration-100 transition-all"
      onClick={() => dispatch(setView('login'))}
      role="button"
      tabIndex={0}
      aria-label="Вернуться назад"
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          dispatch(setView('login'));
        }
      }}
    >
      <ArrowBackIcon fontSize="small" />
    </div>
  );
};

export default ArrowBackIconCart;
