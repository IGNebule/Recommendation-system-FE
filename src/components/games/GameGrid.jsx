import GameCard from "./GameCard";
import EmptyState from "../ui/EmptyState";

const GameGrid = ({ games = [], savedAppids = new Set(), onToggleSave }) => {
  if (!Array.isArray(games) || games.length === 0) {
    return <EmptyState message="No games found" />;
  }

  return (
    <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
      {games.map((game) => (
        <GameCard
          key={game.appid}
          game={game}
          isSaved={savedAppids.has(String(game.appid))}
          onToggleSave={onToggleSave}
        />
      ))}
    </div>
  );
};

export default GameGrid;
