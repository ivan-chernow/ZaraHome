"use client";

import React from "react";
import Header from "@/widgets/header/ui/Header";
import Footer from "@/widgets/footer/ui/Footer";
import NavMenu from "@/widgets/nav-menu/ui/NavMenu";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <NavMenu />
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
