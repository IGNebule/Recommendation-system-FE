import GameGrid from "../games/GameGrid";
import LoadingState from "../ui/LoadingState";
import ErrorState from "../ui/ErrorState";
import EmptyState from "../ui/EmptyState";

const DiscoverSection = ({
  title,
  description,
  games = [],
  loading = false,
  error = "",
  savedAppids = new Set(),
  onToggleSave,
}) => {
  return (
    <section className="w-full">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white">{title}</h2>

          {description && (
            <p className="mt-1 text-sm text-white/45">{description}</p>
          )}
        </div>

        <span className="font-mono text-xs text-white/30">
          {games.length} games
        </span>
      </div>

      {loading && <LoadingState />}

      {error && <ErrorState message={error} />}

      {!loading && !error && games.length === 0 && (
        <EmptyState message="No games matched your filters" />
      )}

      {!loading && !error && games.length > 0 && (
        <GameGrid
          games={games}
          savedAppids={savedAppids}
          onToggleSave={onToggleSave}
        />
      )}
    </section>
  );
};

export default DiscoverSection;
