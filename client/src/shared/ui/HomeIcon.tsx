import { useRouter } from "next/navigation";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
const HomeIcon: React.FC = () => {
    const router = useRouter();
    return (
        <HomeOutlinedIcon
            onClick={() => router.push('/')}
            fontSize="small"
            className="text-[#0000004D] hover:text-[#000000] cursor-pointer ease-in-out duration-300 active:underline"
        />)
}

export default HomeIcon;