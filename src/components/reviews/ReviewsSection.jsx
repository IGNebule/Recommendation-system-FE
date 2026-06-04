import { useState } from "react";
import { Link } from "react-router-dom";

import useReviews from "../../hooks/useReviews";

import ReviewCard from "./ReviewCard";
import LoadingState from "../ui/LoadingState";
import ErrorState from "../ui/ErrorState";

const REVIEWS_PER_SLIDE = 3;

const ReviewsSection = ({
  title = "Player Experiences",
  description = "Discover real-world stories from players who found better games through GameRec.",
  limit,
  showCTA = false,
}) => {
  const { reviews, loading, error } = useReviews({
    limit: limit || 12,
  });

  const [activeIndex, setActiveIndex] = useState(0);

  const visibleReviews = limit ? reviews.slice(0, limit) : reviews;

  const maxIndex = Math.max(0, visibleReviews.length - REVIEWS_PER_SLIDE);

  const shownReviews = visibleReviews.slice(
    activeIndex,
    activeIndex + REVIEWS_PER_SLIDE,
  );

  const handlePrev = () => {
    setActiveIndex((prev) => {
      if (prev <= 0) return maxIndex;
      return prev - 1;
    });
  };

  const handleNext = () => {
    setActiveIndex((prev) => {
      if (prev >= maxIndex) return 0;
      return prev + 1;
    });
  };

  return (
    <section className="mt-16 overflow-hidden rounded-3xl bg-[#101018] px-4 py-12">
      <div className="mx-auto max-w-[1100px]">
        <div className="text-center">
          <span className="inline-flex rounded-full border border-pink-300/25 px-5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-pink-200/80">
            Testimonials
          </span>

          <h2 className="mt-5 text-4xl font-light tracking-wide text-white md:text-5xl">
            {title}
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/55 md:text-base">
            {description}
          </p>
        </div>

        <div className="mt-12">
          {loading && <LoadingState variant="grid" count={3} />}

          {error && <ErrorState message={error} />}

          {!loading && !error && (
            <div className="grid gap-5 md:grid-cols-3">
              {shownReviews.map((review) => (
                <ReviewCard key={review._id || review.id} review={review} />
              ))}
            </div>
          )}

          {!loading && !error && visibleReviews.length > REVIEWS_PER_SLIDE && (
            <div className="mt-10 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={handlePrev}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white transition hover:bg-blue-500"
                aria-label="Previous reviews"
              >
                ←
              </button>

              <div className="h-px w-10 bg-white/35" />

              <button
                type="button"
                onClick={handleNext}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white transition hover:bg-blue-500"
                aria-label="Next reviews"
              >
                →
              </button>
            </div>
          )}

          {showCTA && (
            <div className="mt-10 text-center">
              <Link
                to="/support"
                className="inline-flex rounded-xl border border-violet-500/30 bg-violet-500/10 px-5 py-3 text-sm font-bold uppercase tracking-wide text-violet-200 transition hover:bg-violet-500/20"
              >
                Leave a Review
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
