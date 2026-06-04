import { useEffect, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";

import useInfiniteGames from "../hooks/useInfiniteGames";
import usePreferences from "../hooks/usePreferences";

import GameGrid from "../components/games/GameGrid";

import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";

const formatGenreValue = (value = "") => {
  return decodeURIComponent(value).replace(/-/g, " ").trim();
};

const formatGenreTitle = (value = "") => {
  return formatGenreValue(value).replace(/\b\w/g, (char) => char.toUpperCase());
};

const GenrePage = () => {
  const { genre } = useParams();
  const sentinelRef = useRef(null);

  const { savedAppids, togglePreference } = usePreferences();

  const genreFilter = useMemo(() => {
    return formatGenreValue(genre);
  }, [genre]);

  const genreTitle = useMemo(() => {
    return formatGenreTitle(genre);
  }, [genre]);

  const filters = useMemo(() => {
    return {
      genre: genreFilter,
      sort: "trending",
    };
  }, [genreFilter]);

  const { games, total, hasMore, loading, initialLoading, error, loadMore } =
    useInfiniteGames({
      limit: 15,
      filters,
    });

  useEffect(() => {
    const el = sentinelRef.current;

    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      {
        root: null,
        rootMargin: "300px",
        threshold: 0,
      },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, loading, loadMore]);

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-[1260px] px-4">
        <section className="mb-10 scroll-mt-32">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold uppercase text-white">
                {genreTitle} Games
              </h2>
            </div>
          </div>

          {initialLoading && <LoadingState variant="grid" count={15} />}

          {error && <ErrorState message={error} />}

          {!initialLoading && !error && games.length === 0 && (
            <EmptyState message={`No games found for ${genreTitle}`} />
          )}

          {!initialLoading && !error && games.length > 0 && (
            <GameGrid
              games={games}
              savedAppids={savedAppids}
              onToggleSave={togglePreference}
            />
          )}

          <div ref={sentinelRef} className="h-10" />

          {!initialLoading && loading && (
            <div className="mt-4">
              <LoadingState variant="grid" count={3} />
            </div>
          )}

          {!hasMore && games.length > 0 && (
            <p className="mt-6 text-center text-sm text-white/35">
              You have reached the end.
            </p>
          )}
        </section>
      </div>
    </div>
  );
};

export default GenrePage;
