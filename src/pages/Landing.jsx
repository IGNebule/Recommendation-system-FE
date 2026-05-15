import { useEffect, useState } from "react";
import Featured from "../components/Featured";
import getGames from "../services/gameService";
import Header from "../components/Header";

const Landing = () => {
  const [games, setGames] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    fetchGames();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchGames = async () => {
    try {
      const data = await getGames();
      setGames(data.slice(0, 12));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117]">
      <Header />
      <main
        className="pt-34"
      >
        <Featured games={games} />
        <Featured games={games} />
        <Featured games={games} />
        <Featured games={games} />
        <Featured games={games} />
        <Featured games={games} />
      </main>
    </div>
  );
};

export default Landing;
