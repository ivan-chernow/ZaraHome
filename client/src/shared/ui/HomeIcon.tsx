import { useRouter } from 'next/navigation';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
const HomeIcon: React.FC = () => {
  const router = useRouter();
  return (
    <HomeOutlinedIcon
      onClick={() => router.push('/')}
      fontSize="small"
      className="text-[#0000004D] hover:text-[#000000] cursor-pointer ease-in-out duration-300 active:underline"
      role="button"
      tabIndex={0}
      aria-label="Перейти на главную страницу"
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          router.push('/');
        }
      }}
    />
  );
};

export default HomeIcon;
