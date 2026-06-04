import { useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const formatPrice = (price) => {
  const value = Number(price);

  if (!Number.isFinite(value) || value <= 0) {
    return "Free";
  }

  return `$${value.toFixed(2)}`;
};

const formatNumber = (value) => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "0";
  }

  return number.toLocaleString();
};

const getReleaseDate = (game) => {
  if (!game.release_date) {
    return "Unknown";
  }

  const date = new Date(game.release_date);

  if (Number.isNaN(date.getTime())) {
    return game.release_date;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getTags = (game) => {
  if (Array.isArray(game.tagList) && game.tagList.length > 0) {
    return game.tagList.slice(0, 4);
  }

  if (Array.isArray(game.genreList) && game.genreList.length > 0) {
    return game.genreList.slice(0, 4);
  }

  if (game.tags) {
    return String(game.tags).split(" ").slice(0, 4);
  }

  if (game.genres) {
    return String(game.genres).split(" ").slice(0, 4);
  }

  return [];
};

const GameCard = ({ game, isSaved = false, onToggleSave }) => {
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const [hovered, setHovered] = useState(false);
  const [localSaved, setLocalSaved] = useState(isSaved);
  const [saving, setSaving] = useState(false);

  const saved = onToggleSave ? isSaved : localSaved;

  const rating = Math.round(Number(game.rating_percent) || 0);

  const tags = useMemo(() => getTags(game), [game]);

  const videoUrl = useMemo(() => {
    if (!game.movieVideo) return null;

    return String(game.movieVideo).replace(/^http:/, "https:");
  }, [game.movieVideo]);

  const image =
    game.header_image ||
    game.background ||
    "https://placehold.co/640x360?text=No+Image";

  const previewImage = game.background || game.header_image || image;

  const handleOpenDetail = () => {
    navigate(`/games/${game.appid}`);
  };

  const handleMouseEnter = () => {
    setHovered(true);

    const video = videoRef.current;

    if (!video || !videoUrl) return;

    video.currentTime = 0;

    video.play().catch((err) => {
      console.log("Video autoplay failed:", err.message);
    });
  };

  const handleMouseLeave = () => {
    setHovered(false);

    const video = videoRef.current;

    if (!video) return;

    video.pause();
    video.currentTime = 0;
  };

  const handleToggleSave = async (e) => {
    e.stopPropagation();

    if (saving) return;

    try {
      setSaving(true);

      if (onToggleSave) {
        await onToggleSave(game.appid);
        return;
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setSaving(false);
    }

    setLocalSaved((prev) => !prev);
  };

  return (
    <article
      onClick={handleOpenDetail}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group w-full cursor-pointer overflow-hidden rounded-xl bg-[#161224] shadow-[0_12px_48px_rgba(0,0,0,0.85)] transition duration-300 hover:-translate-y-1.5 hover:scale-[1.012] hover:shadow-[0_32px_72px_rgba(0,0,0,0.92),0_0_0_1px_rgba(245,166,35,0.15)]"
    >
      {/* Top image / preview */}
      <div className="relative h-[174px] overflow-hidden bg-[#100f18]">
        {/* Static layer */}
        <div className="absolute inset-0 z-0 opacity-100 transition-opacity duration-500 group-hover:opacity-0">
          <img
            src={image}
            alt={game.name}
            loading="lazy"
            className="block h-full w-full object-cover"
          />
        </div>

        {/* Hover preview layer */}
        <div className="absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          {videoUrl ? (
            <video
              ref={videoRef}
              muted
              loop
              playsInline
              preload="metadata"
              poster={image}
              className="block h-full w-full scale-100 object-cover"
            >
              <source src={videoUrl} type="video/webm" />
            </video>
          ) : (
            <img
              src={previewImage}
              alt={game.name}
              loading="lazy"
              className="block h-full w-full scale-100 object-cover transition duration-[14000ms] group-hover:translate-x-3 group-hover:-translate-y-1"
            />
          )}
        </div>

        {/* One shared gradient only */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-transparent from-[45%] to-[#100f18]" />

        {/* Preview label */}
        <div className="absolute bottom-1 left-1 z-20 flex items-center gap-1.5 rounded border border-[#9000e4]/20 bg-[#08060f]/20 px-2.5 py-1 font-mono text-[8.5px] uppercase tracking-[0.12em] text-[#9000e4]/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#9000e4]" />
          Preview
        </div>
      </div>

      {/* Bottom content */}
      <div className="relative -mt-px h-[159px] overflow-hidden bg-[#100f18]">
        {/* Default view */}
        <div className="absolute inset-0 p-3.5 transition duration-300 group-hover:-translate-y-2.5 group-hover:opacity-0">
          <h3 className="line-clamp-1 text-[16px] font-black uppercase leading-none tracking-wide text-[#f4edf8]">
            {game.name}
          </h3>

          <p className="mt-1 font-mono text-[12px] tracking-wider text-[#A78BFA]/50">
            Released {getReleaseDate(game)}
          </p>

          <div className="mt-4 flex flex-wrap gap-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded bg-[#A78BFA]/10 px-2 py-0.5 text-[8.5px] font-semibold uppercase tracking-wider text-[#A78BFA]"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-7 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-[5px] w-12 overflow-hidden rounded bg-[#1c1a28]">
                <div
                  className="h-full rounded bg-gradient-to-r from-[#000000] to-[#A78BFA]"
                  style={{
                    width: `${Math.min(Math.max(rating, 0), 100)}%`,
                  }}
                />
              </div>

              <span className="font-mono text-[14px] font-bold text-[#fff]">
                {rating}%
              </span>
            </div>

            <span className="text-[22px] font-bold text-[#f0edf8]">
              {formatPrice(game.price)}
            </span>
          </div>
        </div>

        {/* Hover view */}
        <div className="pointer-events-none absolute inset-0 flex translate-y-2.5 gap-0 p-3.5 opacity-0 transition duration-300 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
          <div className="flex-[2] overflow-hidden border-r border-[#9000e4]/20 pr-3">
            <h4 className="mb-1.5 line-clamp-1 text-[16px] font-black uppercase tracking-wider text-[#A78BFA]">
              {game.name}
            </h4>

            <p className="line-clamp-5 text-[10.5px] leading-relaxed text-[#fff]/70">
              {game.short_description || "No description available."}
            </p>
          </div>

          <div className="flex flex-1 flex-col justify-between gap-1.5 pl-3">
            <div className="flex justify-around gap-2">
              <div>
                <span className="block text-[8px] font-semibold uppercase tracking-[0.13em] text-[#fff]/40">
                  Reviews
                </span>
                <span className="font-mono text-lg font-bold text-[#fff]">
                  {formatNumber(game.total_reviews)}
                </span>
              </div>

              <div>
                <span className="block text-[8px] font-semibold uppercase tracking-[0.13em] text-[#fff]/40">
                  Rating
                </span>
                <span className="font-mono text-lg font-bold text-[#A78BFA]">
                  {rating}%
                </span>
              </div>
            </div>

            <button
              type="button"
              disabled={saving}
              onClick={handleToggleSave}
              className={`flex w-full items-center justify-center gap-1 rounded border px-1.5 py-1 mt-8 text-[10px] font-semibold uppercase tracking-wider transition ${
                saved
                  ? "border-[#9000e4]/20 bg-[#9000e4]/10 text-[#9000e4]"
                  : "border-[#9000e438] bg-transparent text-[#fff] hover:border-[#9000e48e] hover:bg-[#9000e4]/5 hover:text-[#9300e9]"
              }`}
            >
              {saving ? "..." : saved ? "★ Saved" : "☆ Save"}
            </button>

            <div className="text-right text-lg font-bold text-[#f0edf8]">
              {formatPrice(game.price)}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default GameCard;
