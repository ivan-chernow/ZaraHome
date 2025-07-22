"use client";
import React from "react";
import Logo from "@/components/ui/Logo";
import VerticalLine from "@/components/ui/VerticalLine";
import HorizontalLine from "@/components/ui/HorizontalLine";
import Container from "@mui/material/Container";
import { useRouter } from "next/navigation";

const Footer = () => {
  const router = useRouter();
  return (
    <footer className="pb-[55px] mt-auto ">
      <div className="flex justify-center w-full">
        <HorizontalLine width="1296px" />
      </div>
      <Container maxWidth="lg">
        <div className="flex justify-between pt-[24px]">
          <div className="flex-1 max-w-[200px]">
            <h2 className="text-[18px] font-semibold mb-[25px]">Магазин</h2>
            <ul className="space-y-[10px]">
              {[
                "Спальня",
                "Одежда и обувь",
                "Гостиная",
                "Кухня",
                "Ванная комната",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-[#00000080] hover:text-black  transition-colors cursor-pointer"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <VerticalLine height="h-auto" />

          <div className="flex-1 max-w-[200px]">
            <h2 className="text-[18px] font-semibold mb-[25px]">
              Дополнительно
            </h2>
            <ul className="space-y-[10px]">
              {["Экстра", "Для детей"].map((item) => (
                <li
                  key={item}
                  className="text-[#00000080] hover:text-black  transition-colors"
                >
                  <a
                    href="#"
                    className="text-[#00000080] hover:text-black  transition-colors cursor-pointer"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <VerticalLine height="h-auto" />

          <div className="flex-1 max-w-[280px] px-[20px]">
            <h2 className="text-[18px] font-semibold mb-[25px]">Помощь</h2>
            <ul className="space-y-[10px]">
              <li
                className="text-[#00000080] hover:text-black cursor-pointer transition-colors"
                onClick={() => router.push("info")}
              >
                Информация о сроках доставки
              </li>
              <li
                className="text-[#00000080] hover:text-black cursor-pointer transition-colors"
                onClick={() => router.push("agreement")}
              >
                Пользовательское соглашение
              </li>
            </ul>
          </div>

          <VerticalLine height="h-auto" />

          <div className="flex-1 max-w-[250px]">
            <h2 className="text-[18px] font-semibold mb-[25px]">Контакты</h2>
            <a
              className="text-[#00000080] hover:text-black cursor-pointer transition-colors"
              href="mailto:info@зарахоум.рф"
            >
              info@зарахоум.рф
            </a>
          </div>
        </div>
      </Container>

      <div className="flex justify-center w-full mt-10">
        <HorizontalLine width="1296px" />
      </div>
      <Container maxWidth="lg">
        <div className="text-center pt-[43px]">
          <p className="mb-[40px] text-[12px] text-[#00000080]">
            Содержание этого сайта защищено авторским правом и является
            собственностью ZARAHOME. ZARAHOME стремится к доступности.
          </p>

          <div className="flex justify-center">
            <Logo />
          </div>

          <p className="mt-[37px] text-[12px] text-black">
            © 2023 ZARAHOME. Все права защищены.
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
