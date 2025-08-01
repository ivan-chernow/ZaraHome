import React from "react";
import Container from "@mui/material/Container";
import {
  toggleAllProducts,
  toggleDiscounts,
  toggleNewProducts,
  toggleInformation,
  toggleSearch,
} from "@/store/features/catalog/navMenu.slice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import NavMenuOpenAllProducts from "@/components/NavMenuOpenAllProducts";
import NavMenuOpenDiscounts from "@/components/NavMenuOpenDiscounts";
import NavMenuOpenNewProducts from "@/components/NavMenuOpenNewProducts";
import NavMenuOpenInformation from "@/components/NavMenuOpenInformation";
import NavMenuSearch from "@/components/NavMenuSearch";

const NavMenu = () => {
  const dispatch = useDispatch();
  const {
    isOpenNewProducts,
    isOpenDiscounts,
    isOpenAllProducts,
    isOpenInformation,
    isOpenSearch,
  } = useSelector((state: RootState) => state.navMenu);

  const handleMouseLeave = () => {
    dispatch(toggleAllProducts(false));
    dispatch(toggleDiscounts(false));
    dispatch(toggleNewProducts(false));
    dispatch(toggleInformation(false));
    dispatch(toggleSearch(false));
  };

  const handleCloseMenu = () => {
    dispatch(toggleAllProducts(false));
  };

  return (
    <div className="relative" onMouseLeave={handleMouseLeave}>
      <section className="py-[20px]">
        <Container maxWidth="lg">
          <nav>
            <ul className="flex items-center justify-center">
              <li
                className="mr-[15px] cursor-pointer hover:text-[#00000080] hover:duration-200 hover:ease-in"
                onMouseEnter={() => dispatch(toggleAllProducts(true))}
              >
                <p className="text-[18px] cursor-pointer">Все товары</p>
              </li>

              <li
                className="mr-[15px] cursor-pointer hover:text-[#00000080] hover:duration-200 hover:ease-in"
                onMouseEnter={() => dispatch(toggleDiscounts(true))}
              >
                <p className="text-[18px] cursor-pointer">Скидки</p>
              </li>
              <li
                className="mr-[15px] cursor-pointer hover:text-[#00000080] hover:duration-200 hover:ease-in"
                onMouseEnter={() => dispatch(toggleNewProducts(true))}
              >
                <p className="text-[18px] cursor-pointer">Новинки</p>
              </li>
              <li
                className="mr-[15px] cursor-pointer hover:text-[#00000080] hover:duration-200 hover:ease-in"
                onMouseEnter={() => dispatch(toggleSearch(true))}
              >
                <p className="text-[18px] cursor-pointer">Поиск</p>
              </li>
              <li
                className="mr-[15px] cursor-pointer hover:text-[#00000080] hover:duration-200 hover:ease-in"
                onMouseEnter={() => dispatch(toggleInformation(true))}
              >
                <p className="text-[18px] cursor-pointer">Информация</p>
              </li>
            </ul>
          </nav>
        </Container>
      </section>

      {/* Выпадающее меню */}
      <div className="absolute left-0 w-full z-50">
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
        {isOpenSearch && (
          <div
            className="w-full"
            onMouseEnter={() => dispatch(toggleSearch(true))}
          >
            <NavMenuSearch />
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
