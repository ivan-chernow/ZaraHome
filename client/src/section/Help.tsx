import React from "react";
import Container from "@mui/material/Container";
import HelpElement from "@/components/HelpElement";

const Help = ({ title, style }) => {
  return (
    <section className=" mt-[76px]">
      <Container maxWidth="lg">
        <div
          className="flex justify-end mb-[71px]"
          style={{ justifyContent: `${style}` }}
        >
          <div className="text-left">
            <h2 className="font-light text-[42px] mb-[12px]">{title}</h2>
            <p className="font-medium text-[#00000080]">
              Мы всегда готовы прийти на помощь
            </p>
          </div>
        </div>

        <ul className="flex  justify-center items-center ">
          <HelpElement
            svgPath="/assets/img/Help/tg.svg"
            width="39"
            height="40"
            title="Задайте его нам"
            subtitle="Напишите в наш Telegram"
            link="https://web.telegram.org/a/"
          />
          <HelpElement
            svgPath="/assets/img/Help/dzen.svg"
            width="42"
            height="38"
            title="Наши статьи в Дзен"
            subtitle="Все самое полезное для вас мы собрали тут"
            link="https://dzen.ru/"
          />
          <HelpElement
            svgPath="/assets/img/Help/vk.svg"
            width="40"
            height="40"
            title="Присоединяйтесь"
            subtitle="Наше сообщество с радостью вас приймет"
            link="https://vk.com/"
          />
        </ul>
      </Container>
    </section>
  );
};

export default Help;
