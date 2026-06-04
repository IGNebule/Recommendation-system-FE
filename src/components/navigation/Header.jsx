import { useEffect, useState } from "react";

import Navbar from "./Navbar";
import SubNavbar from "./SubNavbar";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className="sticky top-0 z-[100] w-full">
      <Navbar isScrolled={isScrolled} />
      <SubNavbar isScrolled={isScrolled} />
    </header>
  );
};

export default Header;
