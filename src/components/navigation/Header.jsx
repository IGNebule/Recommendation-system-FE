import { useEffect, useState } from "react";

import Navbar from "./Navbar";
import SubNavbar from "./SubNavbar";

const SCROLL_THRESHOLD = 20;

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
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
    <header className="sticky top-0 z-50 w-full">
      <Navbar isScrolled={isScrolled} />
      <SubNavbar isScrolled={isScrolled} />
    </header>
  );
};

export default Header;
