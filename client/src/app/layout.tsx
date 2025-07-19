'use client'
import { Inter, Roboto, Ysabeau_SC } from "next/font/google";
import '../../public/assets/styles/globals.css';
import React from "react";
import NavigationProgress from "@/components/NavigationProgress";
import AuthSpinnerWrapper from "@/components/AuthSpinnerWrapper";
import AuthCheck from "@/components/AuthCheck";
import { Providers } from '@/store/provider';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const roboto = Roboto({ subsets: ["latin"], variable: "--font-roboto" });
const ysabeau = Ysabeau_SC({ subsets: ["latin"], variable: "--font-ysabeau" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <html lang="en" className={`${inter.variable} ${roboto.variable} ${ysabeau.variable}`}>
        <body className={ysabeau.className}>
        <Providers>
          <AuthSpinnerWrapper />
          <NavigationProgress />
          <AuthCheck />
          {children}
        </Providers>
        </body>
      </html>
  );
}