import { useNavigate } from "react-router-dom";

import usePreferences from "../hooks/usePreferences";

import GameCard from "../components/games/GameCard";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";

const weightOptions = [
  {
    value: "dislike",
    label: "Dislike",
    description: "Push away from this style",
  },
  {
    value: "normal",
    label: "Normal",
    description: "Standard influence",
  },
  {
    value: "love",
    label: "Love 🔥",
    description: "Double influence",
  },
];

const getWeightClass = (active) => {
  return active
    ? "border-violet-400 bg-violet-500/20 text-white"
    : "border-white/10 bg-white/[0.04] text-white/45 hover:bg-white/[0.08] hover:text-white";
};

const GamerDNASection = ({ gamerDNA }) => {
  const topAttributes = gamerDNA?.topAttributes || [];
  const genreBreakdown = gamerDNA?.genreBreakdown || [];

  return (
    <section className="rounded-3xl border border-white/10 bg-[#100f18] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.35)]">
      <div>
        <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-violet-300">
          Your Gamer DNA
        </p>

        <h2 className="mt-2 text-3xl font-black text-white">
          The TF-IDF profile behind your taste
        </h2>

        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/50">
          Based on your saved games, GameRec builds a user profile vector and
          exposes the strongest weighted terms driving your recommendations.
        </p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h3 className="text-sm font-black uppercase tracking-wide text-white/70">
            Top Taste Attributes
          </h3>

          {topAttributes.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {topAttributes.map((item) => (
                <span
                  key={item.term}
                  className="rounded-full border border-violet-500/25 bg-violet-500/10 px-3 py-1.5 text-xs font-bold text-violet-200"
                >
                  {item.term} x{item.score}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-white/40">
              Add games to your library to generate taste attributes.
            </p>
          )}
        </div>

        <div>
          <h3 className="text-sm font-black uppercase tracking-wide text-white/70">
            Genre Breakdown
          </h3>

          <div className="mt-4 space-y-3">
            {genreBreakdown.length > 0 ? (
              genreBreakdown.map((item) => (
                <div key={item.genre}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-semibold capitalize text-white/70">
                      {item.genre}
                    </span>

                    <span className="font-mono text-white/35">
                      {item.percent}%
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-violet-500"
                      style={{
                        width: `${item.percent}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-white/40">
                No genre distribution available yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const LibrarySeedCard = ({ item, onRemove, onWeightChange }) => {
  const game = item.game;
  const activeWeight = item.weight || "normal";

  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-[#100f18] shadow-[0_16px_45px_rgba(0,0,0,0.35)]">
      <img
        src={game.header_image}
        alt={game.name}
        className="aspect-video w-full object-cover"
      />

      <div className="p-4">
        <h3 className="line-clamp-1 text-base font-black text-white">
          {game.name}
        </h3>

        <div className="mt-3 flex flex-wrap gap-2">
          {(game.genreList || []).slice(0, 3).map((genre) => (
            <span
              key={genre}
              className="rounded bg-white/[0.06] px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white/45"
            >
              {genre}
            </span>
          ))}
        </div>

        <div className="mt-5">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-white/35">
            Weight
          </p>

          <div className="grid grid-cols-3 gap-2">
            {weightOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() =>
                  onWeightChange({
                    appid: game.appid,
                    weight: option.value,
                  })
                }
                title={option.description}
                className={`rounded-lg border px-2 py-2 text-xs font-bold transition ${getWeightClass(
                  activeWeight === option.value,
                )}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onRemove(game.appid)}
          className="mt-4 w-full rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-300 transition hover:bg-red-500/20"
        >
          Remove
        </button>
      </div>
    </article>
  );
};

const ActiveSeedsSection = ({ library, onRemove, onWeightChange }) => {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
      <div className="mb-6">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-white/35">
          Active Seeds
        </p>

        <h2 className="mt-2 text-3xl font-black text-white">
          Your Saved Games
        </h2>

        <p className="mt-2 text-sm text-white/50">
          These games act as seed vectors for your personalized recommendations.
        </p>
      </div>

      {library.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {library.map((item) => (
            <LibrarySeedCard
              key={item.appid}
              item={item}
              onRemove={onRemove}
              onWeightChange={onWeightChange}
            />
          ))}
        </div>
      ) : (
        <EmptyState message="Your library is empty. Save games to start building your Gamer DNA." />
      )}
    </section>
  );
};

const LiveRecommendationsSection = ({
  recommendations,
  savedAppids,
  onToggleSave,
}) => {
  return (
    <section className="rounded-3xl border border-white/10 bg-[#100f18] p-6">
      <div className="mb-6">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
          Live Recommendations
        </p>

        <h2 className="mt-2 text-3xl font-black text-white">
          Generated Just for You
        </h2>

        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/50">
          Your aggregated user vector is compared against the game catalog using
          cosine similarity. Higher scores mean stronger mathematical overlap.
        </p>

        <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.035] p-4 font-mono text-xs text-white/45">
          Similarity(U, G) = U · G / (||U|| ||G||)
        </div>
      </div>

      {recommendations.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {recommendations.map((game) => (
            <div key={game.appid} className="relative">
              <div
                className="absolute right-3 top-3 z-20 rounded bg-emerald-500 px-2 py-1 text-xs font-black text-white shadow-lg"
                title={
                  game.matchReasons?.length
                    ? `Matched due to: ${game.matchReasons.join(", ")}`
                    : "Similarity score"
                }
              >
                {(Number(game.similarity_score) * 100).toFixed(1)}% Match
              </div>

              <GameCard
                game={game}
                isSaved={savedAppids.has(String(game.appid))}
                onToggleSave={onToggleSave}
              />

              {game.matchReasons?.length > 0 && (
                <p className="mt-2 line-clamp-1 text-xs text-white/35">
                  Matched: {game.matchReasons.join(", ")}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState message="Add more games to generate personalized recommendations." />
      )}
    </section>
  );
};

const LibraryPage = () => {
  const navigate = useNavigate();

  const {
    library,
    gamerDNA,
    recommendations,
    savedAppids,
    loading,
    error,
    removePreference,
    updatePreferenceWeight,
    togglePreference,
  } = usePreferences();

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-[1260px] px-4 py-10">
        <LoadingState variant="grid" count={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-[1260px] px-4 py-10">
        <ErrorState message={error} />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1260px] px-4 py-10 text-white">
      <section className="mb-10 rounded-3xl border border-white/10 bg-gradient-to-br from-violet-500/15 via-[#100f18] to-[#66c0f4]/10 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-violet-300">
          My Library
        </p>

        <h1 className="mt-4 text-4xl font-black md:text-6xl">
          Your recommendation command center.
        </h1>

        <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/55">
          Manage saved games, tune their influence, and watch your live
          recommendation profile update through content-based similarity.
        </p>

        <button
          type="button"
          onClick={() => navigate("/discover")}
          className="mt-6 rounded-xl bg-violet-600 px-5 py-3 text-sm font-black uppercase tracking-wide transition hover:bg-violet-500"
        >
          Discover More Games
        </button>
      </section>

      <div className="space-y-10">
        <GamerDNASection gamerDNA={gamerDNA} />

        <ActiveSeedsSection
          library={library}
          onRemove={removePreference}
          onWeightChange={updatePreferenceWeight}
        />

        <LiveRecommendationsSection
          recommendations={recommendations}
          savedAppids={savedAppids}
          onToggleSave={togglePreference}
        />
      </div>
    </div>
  );
};

export default LibraryPage;
