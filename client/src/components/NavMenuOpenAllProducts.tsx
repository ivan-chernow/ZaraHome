import React from "react";
import NavMenuAccordion from "./NavMenuAccordion";
import { Container } from "@mui/material";
import NavMenuSearchWrapper from "./NavMenuSearchWrapper";

interface NavMenuOpenProps {
  onClose: () => void;
}

const NavMenuOpen: React.FC<NavMenuOpenProps> = ({ onClose }) => {
  return (
    <div className="absolute top-0 left-0 w-screen bg-white z-50 h-auto  shadow-[0_4px_20px_rgba(0,0,0,0.25)]">
      <Container maxWidth="lg">
        <div className="flex flex-col items-center">
          <NavMenuSearchWrapper alwaysShowChildren={true}>
            <div className="py-[50px]">
              <div className="flex w-full justify-center">
                <NavMenuAccordion onClose={onClose} />
              </div>
            </div>
          </NavMenuSearchWrapper>
        </div>
      </Container>
    </div>
  );
};

export default NavMenuOpen;
