import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { gameService, recommendationService } from "../services";

import useAsync from "../hooks/useAsync";
import usePreferences from "../hooks/usePreferences";

import GameCard from "../components/games/GameCard";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";

const toHttps = (url) => {
  if (!url) return "";
  return String(url).replace(/^http:/, "https:");
};

const toNumber = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
};

const formatPrice = (price) => {
  const num = Number(price);

  if (!Number.isFinite(num) || num === 0) {
    return "Free";
  }

  return `$${num.toFixed(2)}`;
};

const formatPlaytime = (minutes) => {
  const value = Number(minutes);

  if (!Number.isFinite(value) || value <= 0) {
    return "0 hrs";
  }

  return `${(value / 60).toFixed(1)} hrs`;
};

const getRatingColor = (rating) => {
  const value = toNumber(rating);

  if (value >= 80) return "bg-emerald-500";
  if (value >= 50) return "bg-yellow-400";

  return "bg-red-500";
};

const getSteamUrl = (appid) => {
  return `https://store.steampowered.com/app/${appid}`;
};

const PlatformIcon = ({ platform }) => {
  const normalized = String(platform).toLowerCase();

  const labelMap = {
    windows: "Win",
    mac: "Mac",
    linux: "Linux",
  };

  return (
    <span className="rounded border border-white/10 bg-white/[0.05] px-2.5 py-1 text-xs font-bold text-white/70">
      {labelMap[normalized] || platform}
    </span>
  );
};

const DetailChip = ({ type, value }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    const queryKey =
      type === "genre" ? "genre" : type === "tag" ? "tag" : "category";

    navigate(`/discover?${queryKey}=${encodeURIComponent(value)}`);
  };

  const colorClass = {
    genre: "border-violet-500/25 bg-violet-500/10 text-violet-200",
    category: "border-sky-500/25 bg-sky-500/10 text-sky-200",
    tag: "border-pink-500/25 bg-pink-500/10 text-pink-200",
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`rounded px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition hover:-translate-y-0.5 ${
        colorClass[type] || colorClass.tag
      }`}
    >
      {value}
    </button>
  );
};

const GameHero = ({ game }) => {
  const heroImage = toHttps(
    game.bannerScreenshot || game.background || game.header_image,
  );

  const mediaImage = toHttps(game.header_image);
  const movieVideo = toHttps(game.movieVideo);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#100f18] shadow-[0_24px_90px_rgba(0,0,0,0.65)]">
      {heroImage && (
        <img
          src={heroImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-[#07070d] via-[#07070d]/85 to-[#07070d]/35" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#07070d] via-[#07070d]/45 to-transparent" />

      <div className="relative z-10 grid gap-8 p-6 md:p-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
          {movieVideo ? (
            <video
              src={movieVideo}
              poster={mediaImage}
              autoPlay
              muted
              loop
              playsInline
              className="aspect-video w-full object-cover"
            />
          ) : (
            <img
              src={mediaImage || heroImage}
              alt={game.name}
              className="aspect-video w-full object-cover"
            />
          )}
        </div>

        <div className="pb-2">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-violet-300">
            Game Detail
          </p>

          <h1 className="mt-3 text-4xl font-black leading-tight text-white md:text-6xl">
            {game.name}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-white/55">
            <span>{game.release_year || "Unknown Year"}</span>
            <span className="h-1 w-1 rounded-full bg-white/30" />
            <span>{game.developer || "Unknown Developer"}</span>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="rounded-xl border border-white/10 bg-white/[0.06] px-5 py-3">
              <p className="text-xs uppercase tracking-wide text-white/35">
                Price
              </p>
              <p className="text-2xl font-black text-white">
                {formatPrice(game.price)}
              </p>
            </div>

            <a
              href={getSteamUrl(game.appid)}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-violet-600 px-6 py-4 text-sm font-black uppercase tracking-wide text-white transition hover:bg-violet-500"
            >
              View on Steam
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

const TagCloud = ({ game }) => {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-6">
      <h2 className="text-2xl font-black text-white">Game DNA</h2>

      <p className="mt-2 text-sm text-white/45">
        These attributes power the content-based recommendation engine.
      </p>

      <div className="mt-6 space-y-5">
        {game.genreList?.length > 0 && (
          <div>
            <p className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.16em] text-white/35">
              Genres
            </p>

            <div className="flex flex-wrap gap-2">
              {game.genreList.map((item) => (
                <DetailChip key={`genre-${item}`} type="genre" value={item} />
              ))}
            </div>
          </div>
        )}

        {game.categoryList?.length > 0 && (
          <div>
            <p className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.16em] text-white/35">
              Categories
            </p>

            <div className="flex flex-wrap gap-2">
              {game.categoryList.map((item) => (
                <DetailChip
                  key={`category-${item}`}
                  type="category"
                  value={item}
                />
              ))}
            </div>
          </div>
        )}

        {game.tagList?.length > 0 && (
          <div>
            <p className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.16em] text-white/35">
              Tags
            </p>

            <div className="flex flex-wrap gap-2">
              {game.tagList.map((item) => (
                <DetailChip key={`tag-${item}`} type="tag" value={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

const MediaGallery = ({ screenshots = [] }) => {
  const images = screenshots.map(toHttps).filter(Boolean).slice(0, 8);

  if (!images.length) return null;

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-6">
      <h2 className="text-2xl font-black text-white">Screenshots</h2>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        {images.map((image, index) => (
          <a
            key={image}
            href={image}
            target="_blank"
            rel="noreferrer"
            className="group overflow-hidden rounded-xl border border-white/10 bg-black"
          >
            <img
              src={image}
              alt={`Screenshot ${index + 1}`}
              className="aspect-video w-full object-cover opacity-85 transition duration-300 group-hover:scale-105 group-hover:opacity-100"
            />
          </a>
        ))}
      </div>
    </section>
  );
};

const StatsSidebar = ({ game }) => {
  const rating = toNumber(game.rating_percent);
  const trending = toNumber(game.trending_score);

  return (
    <aside className="space-y-5 lg:sticky lg:top-32 lg:self-start">
      <section className="rounded-2xl border border-white/10 bg-[#100f18] p-6">
        <h2 className="text-xl font-black text-white">Game Details</h2>

        <div className="mt-5 space-y-4 text-sm">
          <div>
            <p className="text-white/35">Developer</p>
            <p className="font-semibold text-white">{game.developer || "-"}</p>
          </div>

          <div>
            <p className="text-white/35">Publisher</p>
            <p className="font-semibold text-white">{game.publisher || "-"}</p>
          </div>

          <div>
            <p className="text-white/35">Release Date</p>
            <p className="font-semibold text-white">
              {game.release_date || "-"}
            </p>
          </div>

          <div>
            <p className="text-white/35">Platforms</p>

            <div className="mt-2 flex flex-wrap gap-2">
              {game.platformList?.length ? (
                game.platformList.map((platform) => (
                  <PlatformIcon key={platform} platform={platform} />
                ))
              ) : (
                <span className="text-white/45">Unknown</span>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#100f18] p-6">
        <h2 className="text-xl font-black text-white">Ratings & Stats</h2>

        <div className="mt-5">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm text-white/35">Community Sentiment</p>
              <p className="mt-1 text-3xl font-black text-white">
                {rating.toFixed(0)}%
              </p>
            </div>

            <span className="rounded bg-white/5 px-2 py-1 text-xs text-white/45">
              Rating
            </span>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className={`h-full ${getRatingColor(rating)}`}
              style={{
                width: `${Math.min(100, Math.max(0, rating))}%`,
              }}
            />
          </div>

          <p className="mt-3 text-xs text-white/40">
            {game.positive_ratings || 0} positive / {game.negative_ratings || 0}{" "}
            negative out of {game.total_reviews || 0} reviews.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-xs text-white/35">Average Playtime</p>
            <p className="mt-2 text-xl font-black text-white">
              {formatPlaytime(game.average_playtime)}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-xs text-white/35">Median Playtime</p>
            <p className="mt-2 text-xl font-black text-white">
              {formatPlaytime(game.median_playtime)}
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-orange-500/20 bg-orange-500/10 p-4">
          <p className="text-xs text-orange-200/70">Site Velocity</p>

          <p className="mt-1 text-2xl font-black text-orange-200">
            {trending >= 70 ? "🔥 " : ""}
            {trending.toFixed(2)}
          </p>
        </div>
      </section>
    </aside>
  );
};

const SimilarGamesSection = ({
  game,
  recommendations = [],
  loading,
  error,
  savedAppids,
  onToggleSave,
}) => {
  const similarGames = useMemo(() => {
    if (Array.isArray(recommendations)) return recommendations.slice(0, 5);

    if (Array.isArray(recommendations?.recommendations)) {
      return recommendations.recommendations.slice(0, 5);
    }

    return [];
  }, [recommendations]);

  return (
    <section className="mt-14 rounded-3xl border border-white/10 bg-[#100f18] p-6 md:p-8">
      <div className="mb-6">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-violet-300">
          Math Matches
        </p>

        <h2 className="mt-2 text-3xl font-black text-white">
          Because you looked at {game.name}
        </h2>

        <p className="mt-2 max-w-3xl text-sm text-white/45">
          Similar games are generated from content-based filtering using game
          genres, tags, categories, text patterns, TF-IDF, and cosine
          similarity.
        </p>
      </div>

      {loading && <LoadingState variant="grid" count={3} />}

      {error && <ErrorState message={error} />}

      {!loading && !error && similarGames.length > 0 && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {similarGames.map((item) => (
            <div key={item.appid} className="relative">
              {item.similarity_score !== undefined && (
                <div className="absolute right-3 top-3 z-20 rounded bg-emerald-500 px-2 py-1 text-xs font-black text-white shadow-lg">
                  {(Number(item.similarity_score) * 100).toFixed(0)}% Match
                </div>
              )}

              <GameCard
                game={item}
                isSaved={savedAppids.has(String(item.appid))}
                onToggleSave={onToggleSave}
              />
            </div>
          ))}
        </div>
      )}

      {!loading && !error && similarGames.length === 0 && (
        <p className="text-sm text-white/45">
          No similar games found for this title.
        </p>
      )}
    </section>
  );
};

const GameDetailPage = () => {
  const { appid } = useParams();
  const { savedAppids, togglePreference } = usePreferences();

  const gameRequest = useAsync(() => gameService.getGameById(appid), [appid]);

  const recommendationsRequest = useAsync(
    () => recommendationService.getGameRecommendations(appid),
    [appid],
  );

  const game = gameRequest.data;

  if (gameRequest.loading) {
    return (
      <div className="mx-auto w-full max-w-[1260px] px-4 py-10">
        <LoadingState variant="banner" />
      </div>
    );
  }

  if (gameRequest.error) {
    return (
      <div className="mx-auto w-full max-w-[1260px] px-4 py-10">
        <ErrorState message={gameRequest.error} />
      </div>
    );
  }

  if (!game) {
    return (
      <div className="mx-auto w-full max-w-[1260px] px-4 py-10 text-white">
        Game not found.
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1260px] px-4 py-8 text-white">
      <GameHero game={game} />

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,0.7fr)_minmax(320px,0.3fr)]">
        <main className="space-y-8">
          <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-6">
            <h2 className="text-2xl font-black text-white">About the Game</h2>

            <p className="mt-4 leading-relaxed text-white/60">
              {game.short_description || "No description available."}
            </p>
          </section>

          <TagCloud game={game} />

          <MediaGallery
            screenshots={game.screenshotUrls || game.screenshots || []}
          />
        </main>

        <StatsSidebar game={game} />
      </div>

      <SimilarGamesSection
        game={game}
        recommendations={recommendationsRequest.data}
        loading={recommendationsRequest.loading}
        error={recommendationsRequest.error}
        savedAppids={savedAppids}
        onToggleSave={togglePreference}
      />
    </div>
  );
};

export default GameDetailPage;
