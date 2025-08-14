// app/AppContent.tsx
"use client";
import React from "react";
import Header from "@/widgets/header/ui/Header";
import NavMenu from "@/widgets/nav-menu/ui/NavMenu";
import NewClothes from "@/widgets/new-clothes/ui/NewClothes";
import Catalog from "@/widgets/catalog/ui/Catalog";
import WhyUs from "@/widgets/why-us/ui/WhyUs";
import Question from "@/widgets/Question";
import Help from "@/widgets/help/ui/Help";
import Footer from "@/widgets/footer/ui/Footer";

export function App() {
  return (
    <>
      <Header />
      <NavMenu />
      <NewClothes />
      <Catalog />
      <WhyUs />
      <Question />
      <div className="flex justify-center pb-[100px]">
        <Help title="Не нашли ответ на свой вопрос?" style="justify-end" />
      </div>
      <Footer />
    </>
  );
}
