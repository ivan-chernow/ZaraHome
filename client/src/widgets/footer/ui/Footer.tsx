"use client";
import React from "react";
import Logo from "@/shared/ui/Logo";
import VerticalLine from "@/shared/ui/VerticalLine";
import HorizontalLine from "@/shared/ui/HorizontalLine";
import Container from "@mui/material/Container";
import { useRouter } from "next/navigation";
import { catalog } from "public/assets/data/catalog";
import Link from "next/link";
import slugify from "slugify";

const Footer: React.FC = () => {
  const router = useRouter();

  const customSlugify = (text: string) =>
    slugify(text.replace("й", "y"), { lower: true, strict: true });

  return (
    <footer id="footer" data-section="footer" className="pb-[55px] mt-auto ">
      <div className="flex justify-center w-full">
        <HorizontalLine width="1296px" />
      </div>
      <Container maxWidth="lg">
        <div className="flex justify-between pt-[24px]">
          <div className=" ">
            <h2 className="text-[18px] font-semibold mb-[25px] ">Магазин</h2>
            <div className="flex items-center justify-between">
              <ul className="space-y-[10px] mr-[50px]">
                {catalog.slice(0, 4).map((item) => (
                  <li key={item.category}>
                    <Link
                      href={`/products/category/${customSlugify(item.link)}`}
                    >
                      <p className="text-[#00000080] hover:text-black transition-colors cursor-pointer">
                        {item.category}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
              <ul className="space-y-[10px]">
                {catalog.slice(4, 8).map((item) => (
                  <li key={item.category}>
                    <Link
                      href={`/products/category/${customSlugify(item.link)}`}
                    >
                      <p className="text-[#00000080] hover:text-black transition-colors cursor-pointer">
                        {item.category}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <VerticalLine height={"100%"} />

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

          <VerticalLine height={"100%"} />

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
