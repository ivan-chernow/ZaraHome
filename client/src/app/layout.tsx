"use client";
import { Inter, Roboto, Ysabeau_SC } from "next/font/google";
import "../../public/assets/styles/globals.css";
import React from "react";
import NavigationProgress from "@/shared/ui/NavigationProgress";
import AuthCheck from "@/processes/session/init-auth-check/ui/AuthCheck";
import { Providers } from "@/shared/providers/provider";
import { useSelector } from "react-redux";
import LoginModal from "@/features/auth/ui/LoginModal";
import { RootState } from "@/shared/config/store/store";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const roboto = Roboto({ subsets: ["latin"], variable: "--font-roboto" });
const ysabeau = Ysabeau_SC({ subsets: ["latin"], variable: "--font-ysabeau" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${roboto.variable} ${ysabeau.variable}`}
    >
      <body className={ysabeau.className}>
        <Providers>
          <LayoutWithModal>{children}</LayoutWithModal>
        </Providers>
      </body>
    </html>
  );
}

function LayoutWithModal({ children }: { children: React.ReactNode }) {
  const { isOpenAuth } = useSelector((state: RootState) => state.auth);
  return (
    <>
      {isOpenAuth && <LoginModal />}
      <NavigationProgress />
      <AuthCheck />
      {children}
    </>
  );
}
