import { useEffect, useMemo, useState } from "react";

import GameBanner from "./GameBanner";

const SLIDE_INTERVAL = 5000;

const GameBannerCarousel = ({
  games = [],
  savedAppids = new Set(),
  onToggleSave,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const bannerGames = useMemo(() => {
    return Array.isArray(games) ? games.filter(Boolean) : [];
  }, [games]);

  useEffect(() => {
    if (bannerGames.length <= 1) return undefined;

    const interval = setInterval(() => {
      setActiveIndex((prev) => {
        return (prev + 1) % bannerGames.length;
      });
    }, SLIDE_INTERVAL);

    return () => clearInterval(interval);
  }, [bannerGames.length]);

  useEffect(() => {
    setActiveIndex(0);
  }, [bannerGames.length]);

  if (!bannerGames.length) {
    return null;
  }

  const activeGame = bannerGames[activeIndex];

  const handleSelectSlide = (index) => {
    setActiveIndex(index);
  };

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="flex w-full items-center justify-center">
        <GameBanner
          game={activeGame}
          badge="Trending"
          isSaved={savedAppids.has(String(activeGame.appid))}
          onToggleSave={onToggleSave}
        />
      </div>

      {bannerGames.length > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {bannerGames.map((game, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={game.appid}
                type="button"
                onClick={() => handleSelectSlide(index)}
                className={`h-1.5 rounded-full transition-all ${
                  isActive
                    ? "w-8 bg-[#7C3AED]"
                    : "w-1.5 bg-white/20 hover:bg-white/40"
                }`}
                aria-label={`Go to ${game.name}`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GameBannerCarousel;
