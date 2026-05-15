import { useState, useEffect, useRef, useCallback } from "react";

const INTERVAL_MS = 5000;
const FADE_DURATION = 700;

export default function Featured({ games }) {
  // ← accept prop
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef(null);

  // =========================
  // AUTO SLIDER
  // =========================
  const startAutoSlide = useCallback(() => {
    if (!games.length) return;

    const cycle = () => {
      setIsTransitioning(true);
      setOpacity(0);

      setTimeout(() => {
        setDisplayIndex((prev) => {
          const next = (prev + 1) % games.length;
          setCurrentIndex(next);
          return next;
        });

        setOpacity(1);
        setTimeout(() => setIsTransitioning(false), 100);
      }, FADE_DURATION);
    };

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(cycle, INTERVAL_MS);
  }, [games]);

  useEffect(() => {
    startAutoSlide();
    return () => clearInterval(timerRef.current);
  }, [startAutoSlide]);

  // =========================
  // LOADING
  // =========================
  if (!games.length) {
    return (
      <div className="text-white text-center py-20">
        Loading featured games...
      </div>
    );
  }

  const game = games[displayIndex];

  // =========================
  // MANUAL NAVIGATION
  // =========================
  const goTo = (index) => {
    if (isTransitioning || index === displayIndex) return;

    setIsTransitioning(true);
    setOpacity(0);
    clearInterval(timerRef.current);

    setTimeout(() => {
      setDisplayIndex(index);
      setCurrentIndex(index);
      setOpacity(1);

      setTimeout(() => {
        setIsTransitioning(false);
        startAutoSlide();
      }, 100);
    }, FADE_DURATION);
  };

  return (
    <section className="relative w-full max-w-[1200px] mx-auto h-[480px] rounded-sm overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-110 blur-[18px] transition-opacity duration-700"
        style={{
          backgroundImage: `url(${game.header_image})`,
          opacity,
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-black/40" />

      {/* Content */}
      <div
        className="relative flex items-center justify-between h-full px-12 py-10 transition-opacity duration-700"
        style={{ opacity }}
      >
        {/* LEFT */}
        <div className="flex-1 text-white max-w-[600px]">
          <p className="uppercase tracking-[0.2em] text-sm text-white/50 mb-2">
            Featured Game
          </p>

          <h1 className="text-5xl font-black mb-4">{game.name}</h1>

          <p className="text-white/60 mb-3">{game.genres}</p>

          <p className="text-white/80 text-lg mb-6">Price: ${game.price}</p>

          <button className="px-6 py-3 bg-white text-black rounded-lg font-bold hover:scale-105 transition">
            View Details
          </button>
        </div>

        {/* RIGHT IMAGE */}
        <div>
          <img
            src={game.header_image}
            alt={game.name}
            className="w-[500px] rounded-xl shadow-2xl"
          />
        </div>
      </div>

      {/* DOTS */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {games.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`w-5 h-[4px] rounded-full opacity-40 transition ${
              i === currentIndex ? "bg-white scale-125" : "bg-white/30"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
