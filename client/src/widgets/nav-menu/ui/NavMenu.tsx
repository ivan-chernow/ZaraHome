import React from "react";
import Container from "@mui/material/Container";
import {
  toggleAllProducts,
  toggleDiscounts,
  toggleNewProducts,
  toggleInformation,
} from "@/widgets/nav-menu/model/navMenu.slice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/shared/config/store/store";
import NavMenuOpenAllProducts from "@/widgets/navigation/NavMenuOpenAllProducts";
import NavMenuOpenDiscounts from "@/widgets/navigation/NavMenuOpenDiscounts";
import NavMenuOpenNewProducts from "@/widgets/navigation/NavMenuOpenNewProducts";
import NavMenuOpenInformation from "@/widgets/navigation/NavMenuOpenInformation";

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
