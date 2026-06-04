import GameCard from "../games/GameCard";
import LoadingState from "../ui/LoadingState";
import ErrorState from "../ui/ErrorState";
import EmptyState from "../ui/EmptyState";

const DiscoverPreviewSection = ({
  title,
  description,
  games = [],
  loading = false,
  error = "",
  savedAppids = new Set(),
  onToggleSave,
  onViewMore,
}) => {
  const previewGames = games.slice(0, 3);

  return (
    <section className="w-full">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold uppercase text-white">{title}</h2>

          {description && (
            <p className="mt-1 text-sm text-white/45">{description}</p>
          )}
        </div>

        <button
          type="button"
          onClick={onViewMore}
          className="rounded border border-violet-500/30 px-4 py-2 text-xs font-bold uppercase tracking-wide text-violet-300 transition hover:bg-violet-500/10 hover:text-violet-200"
        >
          Load more
        </button>
      </div>

      {loading && <LoadingState />}

      {error && <ErrorState message={error} />}

      {!loading && !error && previewGames.length === 0 && (
        <EmptyState message="No games found" />
      )}

      {!loading && !error && previewGames.length > 0 && (
        <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {previewGames.map((game) => (
            <GameCard
              key={game.appid}
              game={game}
              isSaved={savedAppids.has(String(game.appid))}
              onToggleSave={onToggleSave}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default DiscoverPreviewSection;