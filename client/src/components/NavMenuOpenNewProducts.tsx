"use client";

import React from "react";
import NavMenuPagination from "./NavMenuPagination";

const NavMenuOpenNewProducts = () => {
  return <NavMenuPagination filterType="new" pageSize={8} />;
};

export default NavMenuOpenNewProducts;
