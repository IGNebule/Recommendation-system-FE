import GameGrid from "./GameGrid";

import LoadingState from "../ui/LoadingState";
import ErrorState from "../ui/ErrorState";

const GameSection = ({
  title,
  description,
  games = [],
  loading = false,
  error = "",
  savedAppids = new Set(),
  onToggleSave,
}) => {
  return (
    <section className="mb-8">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white">{title}</h2>

        {description && (
          <p className="mt-1 text-sm text-white/50">{description}</p>
        )}
      </div>

      {loading && <LoadingState />}

      {error && <ErrorState message={error} />}

      {!loading && !error && (
        <GameGrid
          games={games}
          savedAppids={savedAppids}
          onToggleSave={onToggleSave}
        />
      )}
    </section>
  );
};

export default GameSection;
