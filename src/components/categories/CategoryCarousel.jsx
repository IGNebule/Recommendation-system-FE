import { useEffect, useMemo, useState } from "react";

import CategoryCard from "./CategoryCard";

const ITEMS_PER_SLIDE = 3;
const AUTO_LOOP_DELAY = 8000;

const chunkItems = (items = [], size = 3) => {
  const chunks = [];

  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }

  return chunks;
};

const CategoryCarousel = ({
  categories = [],
  onSelect,
  autoLoop = true,
  delay = AUTO_LOOP_DELAY,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const slides = useMemo(() => {
    return chunkItems(categories, ITEMS_PER_SLIDE);
  }, [categories]);

  const totalSlides = slides.length;

  useEffect(() => {
    setActiveIndex(0);
  }, [categories.length]);

  useEffect(() => {
    if (!autoLoop || totalSlides <= 1) return undefined;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalSlides);
    }, delay);

    return () => clearInterval(interval);
  }, [autoLoop, delay, totalSlides]);

  const handleNext = () => {
    if (totalSlides <= 1) return;

    setActiveIndex((prev) => (prev + 1) % totalSlides);
  };

  const handlePrev = () => {
    if (totalSlides <= 1) return;

    setActiveIndex((prev) => {
      return prev === 0 ? totalSlides - 1 : prev - 1;
    });
  };

  const handleSelect = (category) => {
    if (typeof onSelect === "function") {
      onSelect(category);
    }
  };

  if (!categories.length) {
    return null;
  }

  const activeSlide = slides[activeIndex] || [];

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">

        <div className="flex w-full items-center justify-end gap-2">
          <button
            type="button"
            onClick={handlePrev}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white"
            aria-label="Previous category slide"
          >
            ←
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white"
            aria-label="Next category slide"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {activeSlide.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            onSelect={handleSelect}
          />
        ))}
      </div>

      {totalSlides > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {slides.map((_, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={index}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`h-1.5 rounded-full transition-all ${
                  isActive
                    ? "w-8 bg-violet-500"
                    : "w-1.5 bg-white/20 hover:bg-white/40"
                }`}
                aria-label={`Go to category slide ${index + 1}`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CategoryCarousel;
