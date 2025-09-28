import React from 'react';
import Container from '@mui/material/Container';
import {
  toggleAllProducts,
  toggleDiscounts,
  toggleNewProducts,
  toggleInformation,
} from '@/widgets/nav-menu/model/navMenu.slice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/shared/config/store/store';
import NavMenuOpenAllProducts from '@/widgets/navigation/NavMenuOpenAllProducts';
import NavMenuOpenDiscounts from '@/widgets/navigation/NavMenuOpenDiscounts';
import NavMenuOpenNewProducts from '@/widgets/navigation/NavMenuOpenNewProducts';
import NavMenuOpenInformation from '@/widgets/navigation/NavMenuOpenInformation';

const NavMenu = () => {
  const dispatch = useDispatch();
  const {
    isOpenNewProducts,
    isOpenDiscounts,
    isOpenAllProducts,
    isOpenInformation,
  } = useSelector((state: RootState) => state.navMenu);

  const handleMouseLeave = () => {
    dispatch(toggleAllProducts(false));
    dispatch(toggleDiscounts(false));
    dispatch(toggleNewProducts(false));
    dispatch(toggleInformation(false));
  };

  const handleCloseMenu = () => {
    dispatch(toggleAllProducts(false));
  };

  return (
    <div className="relative" onMouseLeave={handleMouseLeave}>
      <section className="py-[20px]">
        <Container maxWidth="lg">
          <nav role="navigation" aria-label="Главное меню">
            <ul className="flex items-center justify-center" role="menubar">
              <li
                className="mr-[15px] cursor-pointer hover:text-[#00000080] hover:duration-200 hover:ease-in"
                onMouseEnter={() => dispatch(toggleAllProducts(true))}
                role="menuitem"
                aria-haspopup="true"
                aria-expanded={isOpenAllProducts}
                tabIndex={0}
                aria-label="Все товары"
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    dispatch(toggleAllProducts(true));
                  }
                }}
              >
                <p className="text-[18px] cursor-pointer">Все товары</p>
              </li>

              <li
                className="mr-[15px] cursor-pointer hover:text-[#00000080] hover:duration-200 hover:ease-in"
                onMouseEnter={() => dispatch(toggleDiscounts(true))}
                role="menuitem"
                aria-haspopup="true"
                aria-expanded={isOpenDiscounts}
                tabIndex={0}
                aria-label="Скидки"
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    dispatch(toggleDiscounts(true));
                  }
                }}
              >
                <p className="text-[18px] cursor-pointer">Скидки</p>
              </li>
              <li
                className="mr-[15px] cursor-pointer hover:text-[#00000080] hover:duration-200 hover:ease-in"
                onMouseEnter={() => dispatch(toggleNewProducts(true))}
                role="menuitem"
                aria-haspopup="true"
                aria-expanded={isOpenNewProducts}
                tabIndex={0}
                aria-label="Новинки"
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    dispatch(toggleNewProducts(true));
                  }
                }}
              >
                <p className="text-[18px] cursor-pointer">Новинки</p>
              </li>
              <li
                className="mr-[15px] cursor-pointer hover:text-[#00000080] hover:duration-200 hover:ease-in"
                onMouseEnter={() => dispatch(toggleInformation(true))}
                role="menuitem"
                aria-haspopup="true"
                aria-expanded={isOpenInformation}
                tabIndex={0}
                aria-label="Информация"
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    dispatch(toggleInformation(true));
                  }
                }}
              >
                <p className="text-[18px] cursor-pointer">Информация</p>
              </li>
            </ul>
          </nav>
        </Container>
      </section>

      {/* Выпадающее меню */}
      <div
        className="absolute left-0 w-full z-50"
        role="menu"
        aria-label="Подменю"
      >
        {isOpenAllProducts && (
          <div
            className="w-full"
            onMouseEnter={() => dispatch(toggleAllProducts(true))}
          >
            <NavMenuOpenAllProducts onClose={handleCloseMenu} />
          </div>
        )}
        {isOpenDiscounts && (
          <div
            className="w-full"
            onMouseEnter={() => dispatch(toggleDiscounts(true))}
          >
            <NavMenuOpenDiscounts />
          </div>
        )}
        {isOpenNewProducts && (
          <div
            className="w-full"
            onMouseEnter={() => dispatch(toggleNewProducts(true))}
          >
            <NavMenuOpenNewProducts />
          </div>
        )}
        {isOpenInformation && (
          <div
            className="w-full"
            onMouseEnter={() => dispatch(toggleInformation(true))}
          >
            <NavMenuOpenInformation />
          </div>
        )}
      </div>
    </div>
  );
};

export default NavMenu;
