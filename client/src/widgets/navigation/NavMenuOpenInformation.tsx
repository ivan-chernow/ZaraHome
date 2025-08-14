import { Container } from "@mui/material";
import NavMenuSearchWrapper from "./NavMenuSearchWrapper";

const NavMenuOpenInformation = () => {
  return (
    <div className="absolute top-0 left-0 w-screen bg-white z-50 h-auto shadow-[0_4px_20px_rgba(0,0,0,0.25)]">
      <Container maxWidth="lg">
        <div className="flex flex-col items-center">
          <NavMenuSearchWrapper>
            <div className="pt-[30px]">
              <p className="text-[#00000080] text-center py-8 max-w-[800px]">
                ZARAHOME - это ваш надежный партнер в мире домашнего уюта и
                стиля. Мы предлагаем широкий ассортимент товаров для дома,
                включая мебель, текстиль, декор и аксессуары. Наша компания
                стремится сделать ваш дом красивым и комфортным, предлагая
                качественные товары по доступным ценам. Мы обеспечиваем быструю
                доставку по всей России, удобные способы оплаты и
                профессиональную поддержку клиентов. Присоединяйтесь к нашему
                сообществу в социальных сетях, чтобы быть в курсе новинок и
                специальных предложений. Для связи с нами используйте телефон 8
                800 555-35-35 или email info@zarahome.ru. Мы всегда готовы
                помочь вам создать идеальное пространство для жизни.
              </p>
            </div>
          </NavMenuSearchWrapper>
        </div>
      </Container>
    </div>
  );
};

export default NavMenuOpenInformation;
