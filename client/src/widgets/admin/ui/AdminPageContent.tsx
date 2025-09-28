'use client';
import { Container } from '@mui/material';
import HomeIcon from '@/shared/ui/HomeIcon';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import HttpsOutlinedIcon from '@mui/icons-material/HttpsOutlined';
import AdminAddProduct from '@/features/product/create/ui/AdminAddProduct';
import ChangePassword from '@/features/profile/change-password/ui/ChangePassword';
import Promocodes from '@/features/promocodes/ui/Promocodes';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/shared/config/store/store';
import { setAdminActiveView } from '@/features/admin/model/admin.slice';
import { useRestoreActiveView } from '@/shared/lib/hooks/useRestoreActiveView';

export const AdminPageContent: React.FC = () => {
  const dispatch = useDispatch();
  const { activeView } = useSelector((state: RootState) => state.admin);
  const { isReady } = useRestoreActiveView<
    'add-product' | 'change-password' | 'promocodes'
  >({
    localStorageKey: 'adminActiveView',
    validViews: ['add-product', 'change-password', 'promocodes'] as const,
    setAction: view => setAdminActiveView(view),
  });

  if (!isReady) {
    return null;
  }

  return (
    <Container maxWidth="lg">
      <div className="pb-[99px] pt-[45px] ">
        <>
          <div className="flex items-center mb-[31px]">
            <HomeIcon />
            <span className="text-[#00000099] ml-[4px] mr-[6px]">{'>'}</span>
            <span className="text-[14px] font-medium text-[#00000099] underline">
              Личный кабинет
            </span>
          </div>
          <div className="flex">
            <ul className="flex flex-col pr-[123px] w-[300px] flex-shrink-0">
              <li
                className={`flex items-center mb-[5px] cursor-pointer transition-colors duration-200 ${
                  activeView === 'add-product'
                    ? 'text-black'
                    : 'text-gray-500 hover:text-black'
                }`}
                onClick={() => dispatch(setAdminActiveView('add-product'))}
              >
                <ShoppingCartOutlinedIcon
                  fontSize="medium"
                  sx={{
                    color: activeView === 'add-product' ? 'black' : 'gray',
                  }}
                />
                <p className="font-medium text-[18px] ml-[2px]">
                  Добавить товары
                </p>
              </li>
              <li
                className={`flex items-center mb-[5px] cursor-pointer transition-colors duration-200 ${
                  activeView === 'change-password'
                    ? 'text-black'
                    : 'text-gray-500 hover:text-black'
                }`}
                onClick={() => dispatch(setAdminActiveView('change-password'))}
              >
                <HttpsOutlinedIcon
                  fontSize="medium"
                  sx={{
                    color: activeView === 'change-password' ? 'black' : 'gray',
                  }}
                />
                <p className="font-medium text-[18px] ml-[2px]">
                  Сменить пароль
                </p>
              </li>
              <li
                className={`flex items-center mb-[5px] cursor-pointer transition-colors duration-200 ${
                  activeView === 'promocodes'
                    ? 'text-black'
                    : 'text-gray-500 hover:text-black'
                }`}
                onClick={() => dispatch(setAdminActiveView('promocodes'))}
              >
                <HttpsOutlinedIcon
                  fontSize="medium"
                  sx={{
                    color: activeView === 'promocodes' ? 'black' : 'gray',
                  }}
                />
                <p className="font-medium text-[18px] ml-[2px]">Промокоды</p>
              </li>
            </ul>
            <div className="flex-1">
              {activeView === 'add-product' && <AdminAddProduct />}
              {activeView === 'change-password' && <ChangePassword />}
              {activeView === 'promocodes' && <Promocodes />}
            </div>
          </div>
        </>
      </div>
    </Container>
  );
};

export default AdminPageContent;
