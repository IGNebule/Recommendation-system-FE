// components/GameGrid.jsx
import GameCard from "./GameCard";

export default function GameGrid({ games, title = "Trending Now" }) {
  return (
    <section className="px-6 max-w-7xl mx-auto w-full">
      <h2 className="text-white/90 text-sm font-medium tracking-wide uppercase mb-4">
        {title}
      </h2>
      <div className="grid grid-cols-4 gap-3">
        {games.map((game) => (
          <GameCard key={game.appid} game={game} />
        ))}
      </div>
    </section>
  );
}
