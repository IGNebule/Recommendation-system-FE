import { useParams } from "react-router-dom";

import {
  gameService,
  recommendationService,
  preferenceService,
} from "../services";

import useAsync from "../hooks/useAsync";

import GameSection from "../components/games/GameSection";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";

const GameDetailPage = () => {
  const { appid } = useParams();

  const game = useAsync(() => gameService.getGameById(appid), [appid]);

  const recommendations = useAsync(
    () => recommendationService.getGameRecommendations(appid),
    [appid],
  );

  const handleSavePreference = async () => {
    try {
      await preferenceService.savePreference(appid);
      alert("Game saved to preferences");
    } catch (err) {
      alert(err.message || "Failed to save preference");
    }
  };

  if (game.loading) {
    return <LoadingState />;
  }

  if (game.error) {
    return <ErrorState message={game.error} />;
  }

  const selectedGame = game.data;

  return (
    <div>
      <section className="mb-10 overflow-hidden rounded-2xl bg-[#1a1a25]">
        <div className="relative h-[360px]">
          <img
            src={selectedGame.background || selectedGame.header_image}
            alt={selectedGame.name}
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a25] to-transparent" />

          <div className="absolute bottom-6 left-6">
            <h1 className="text-4xl font-bold">{selectedGame.name}</h1>

            <p className="mt-2 max-w-3xl text-white/70">
              {selectedGame.short_description}
            </p>

            <button
              onClick={handleSavePreference}
              className="mt-4 rounded-lg bg-pink-500 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-600"
            >
              Save Preference
            </button>
          </div>
        </div>
      </section>

      <GameSection
        title={`More like ${selectedGame.name}`}
        description="Recommended using TF-IDF and Cosine Similarity"
        games={recommendations.data?.recommendations || []}
        loading={recommendations.loading}
        error={recommendations.error}
      />
    </div>
  );
};

export default GameDetailPage;
