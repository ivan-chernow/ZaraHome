import React from "react";
import Image from "next/image";
import Container from "@mui/material/Container";
import VerticalLine from "@/shared/ui/VerticalLine";
import HorizontalLine from "@/shared/ui/HorizontalLine";
import Link from "next/link";

const WhyUs = () => {
  return (
    <section id="why-us" data-section="why-us" className="mb-[120px] mt-[10px]">
      <Container maxWidth="lg" className="relative">
        <div className="flex justify-end mb-[71px] ">
          <div className="text-left">
            <h2 className="font-light text-[42px] mb-[5px]">
              Почему выбирают нас?
            </h2>
            <p className="font-medium text-[#00000080]">Наши преимущества</p>
          </div>
        </div>
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/img/WhyUs/zara.png"
            alt="Zara img"
            width={300}
            height={380}
            className="absolute left-[-180px] top-[30px]"
          />
          <Image
            src="/assets/img/WhyUs/t-bank.png"
            alt="T-Bank img"
            width={133}
            height={118}
            className="absolute top-[100px] right-[-45px]"
          />
        </div>
        <div className="flex flex-col px-[42px] py-[42px] shadow-xl relative z-30 bg-white">
          <div className="flex items-center justify-center ">
            <div className="flex flex-col mr-[47px]">
              <h3 className="text-[32px] mb-[17px] max-w-[350px] text-right">
                100% Оригинальный товар
              </h3>
              <p className="text-right">Предоставляем чеки о покупке</p>
            </div>
            <VerticalLine height="215px" />
            <div className="flex flex-col ml-[39px]">
              <h3 className="text-[32px] mb-[12px] max-w-[235px]">
                Удобная оплата{" "}
              </h3>
              <p className="max-w-[346px]">
                Работаем через платежный терминал от Тинькофф. Принимаем карты
                российских банков
              </p>
            </div>
          </div>
          <HorizontalLine width="756px" />
          <h4 className="mt-[25px] text-[32px] mb-[12px] text-center">
            О нас говорят
          </h4>
          <p className="mb-[20px] text-center max-w-[764px] mx-auto ">
            Наша команда всегда заботится о каждом клиенте и старается
            предоставить высококачественный сервис и максимально удобные условия
            сотрудничества
          </p>
          <ul className="flex items-center mb-[46px] justify-center">
            <li className="flex flex-col mr-[83px] items-center">
              <p className="text-[94px] font-medium">200+</p>
              <p className="mt-[7px] text-[#00000080] font-medium text-[18px]">
                Доставок в этом году
              </p>
            </li>

            <li className="flex flex-col mr-[46px] items-center">
              <p className="text-[94px] font-medium">600</p>
              <p className="mt-[7px] text-[#00000080] font-medium text-[18px] text-center">
                Отзывов на Отзовик.ru
              </p>
            </li>
            <li className="flex flex-col items-center">
              <p className="text-[94px] font-medium">71%</p>
              <p className="mt-[7px] text-[#00000080] font-medium text-[18px] text-center">
                Клиентов нас рекомендуют
              </p>
            </li>
          </ul>
          <div className=" flex items-center justify-center mb-[37px]">
            <Image
              alt="star img"
              src="/assets/img/WhyUs/Star.svg"
              height={20}
              width={19}
              className="mr-[7px]"
            />
            <Image
              alt="star img"
              src="/assets/img/WhyUs/Star.svg"
              height={28}
              width={27}
              className="mr-[7px]"
            />
            <Image
              alt="star img"
              src="/assets/img/WhyUs/Star.svg"
              height={35}
              width={34}
              className="mr-[7px]"
            />
            <Image
              alt="star img"
              src="/assets/img/WhyUs/Star.svg"
              height={28}
              width={27}
              className="mr-[7px]"
            />
            <Image
              alt="star img"
              src="/assets/img/WhyUs/Star.svg"
              height={20}
              width={19}
            />
          </div>
          <Link href="/reviews" className="flex justify-center items-center">
            <Image
              src="/assets/img/WhyUs/reviews.svg"
              alt="img"
              width="25"
              height="25"
            />
            <p className="font-semibold underline pb-[3px]">
              Смотреть все отзывы
            </p>
          </Link>
        </div>
      </Container>
    </section>
  );
};

export default WhyUs;
