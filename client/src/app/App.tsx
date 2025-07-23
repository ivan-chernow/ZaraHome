// app/AppContent.tsx
"use client";
import React from "react";
import Header from "@/section/Header";
import NavMenu from "@/section/NavMenu";
import NewClothes from "@/section/NewClothes";
import Catalog from "@/section/Catalog";
import WhyUs from "@/section/WhyUs";
import Question from "@/section/Question";
import Help from "@/section/Help";
import Footer from "@/section/Footer";

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
