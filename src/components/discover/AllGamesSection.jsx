import { useEffect, useRef } from "react";

import useInfiniteGames from "../../hooks/useInfiniteGames";

import GameGrid from "../games/GameGrid";
import LoadingState from "../ui/LoadingState";
import ErrorState from "../ui/ErrorState";
import EmptyState from "../ui/EmptyState";

const AllGamesSection = ({
  filters = {},
  savedAppids = new Set(),
  onToggleSave,
}) => {
  const sentinelRef = useRef(null);

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
    <section id="all-games" className="w-full scroll-mt-32">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold uppercase text-white">
            All Games
          </h2>
        </div>
      </div>

      {initialLoading && <LoadingState variant="grid" count={15} />}

      {error && <ErrorState message={error} />}

      {!initialLoading && !error && games.length === 0 && (
        <EmptyState message="No games matched your filters" />
      )}

      {!initialLoading && !error && games.length > 0 && (
        <GameGrid
          games={games}
          savedAppids={savedAppids}
          onToggleSave={onToggleSave}
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
  );
};

export default AllGamesSection;
