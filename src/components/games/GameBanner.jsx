import { useMemo, useState } from "react";
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

const getRatingLabel = (rating) => {
  const value = Number(rating) || 0;

  if (value >= 90) return "Overwhelmingly Positive";
  if (value >= 80) return "Very Positive";
  if (value >= 70) return "Mostly Positive";
  if (value >= 50) return "Mixed";

  return "Low Rated";
};

const getBannerTags = (game) => {
  if (Array.isArray(game.tagList) && game.tagList.length > 0) {
    return game.tagList.slice(0, 3);
  }

  if (Array.isArray(game.genreList) && game.genreList.length > 0) {
    return game.genreList.slice(0, 3);
  }

  if (game.tags) {
    return String(game.tags).split(" ").slice(0, 3);
  }

  if (game.genres) {
    return String(game.genres).split(" ").slice(0, 3);
  }

  return [];
};

const GameBanner = ({
  game,
  label = "Featured & Recommended",
  badge = "Featured",
  isSaved = false,
  onToggleSave,
}) => {
  const navigate = useNavigate();

  const [localSaved, setLocalSaved] = useState(isSaved);
  const [saving, setSaving] = useState(false);

  const saved = onToggleSave ? isSaved : localSaved;

  const rating = Math.round(Number(game?.rating_percent) || 0);

  const tags = useMemo(() => {
    if (!game) return [];

    return getBannerTags(game);
  }, [game]);

  if (!game) {
    return null;
  }

  const heroImage =
    game.header_image || "https://placehold.co/900x600?text=No+Image";

  const screenshot =
    game.bannerScreenshot ||
    game.screenshots?.[0] ||
    game.background ||
    game.header_image ||
    heroImage;
  
    const getScreenshots = (game) => {
      if (!Array.isArray(game?.screenshots)) {
        return []
      }

      return game.screenshots.filter(Boolean).slice(0, 5)
    }

  const ratingLabel = getRatingLabel(rating);

  const handleOpenDetail = () => {
    navigate(`/games/${game.appid}`);
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

      setLocalSaved((prev) => !prev);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to update preference");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="space-y-6">
      <article
        onClick={handleOpenDetail}
        className="grid h-[380px] w-full cursor-pointer grid-cols-5 grid-rows-5 gap-3 bg-[#0e0d17] p-2 shadow-[0_28px_80px_rgba(0,0,0,0.75),0_0_0_1px_rgba(255,255,255,0.025)] transition duration-300 hover:-translate-y-1"
      >
        {/* LEFT HERO */}
        <div className="relative col-span-3 row-span-5 overflow-hidden">
          <img
            src={heroImage}
            alt={game.name}
            className="block h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-transparent from-45% to-[#0e0d17]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0d17] from-0% to-transparent to-30%" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />

          <div className="absolute left-2.5 top-2.5 flex items-center gap-1 rounded border border-[#9000e4]/20 bg-[#9000e4]/10 px-2.5 py-1 font-mono text-[8.5px] font-extrabold uppercase tracking-[0.13em] text-[#fff]">
            <span className="text-[12px]">★</span>
            {badge}
          </div>
        </div>

        {/* RIGHT TOP SCREENSHOT */}
        <div className="relative col-span-2 row-span-3 overflow-hidden ">
          <img
            src={screenshot}
            alt={`${game.name} screenshot`}
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0d17]/70 to-transparent" />

          <div className="absolute bottom-2 left-2 p-1 font-mono font-extrabold text-[9px] bg-[#9000e4]/10 border border-[#9000e4]/20 tracking-wide text-[#fff]">
            {ratingLabel}
          </div>
        </div>

        {/* RIGHT MID */}
        <div className="col-span-2 flex min-w-0 items-center justify-between gap-2 border-t border-white/10 py-1.5 px-2">
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-[17px] font-black uppercase leading-none tracking-wider text-[#eeecf7]">
              {game.name}
            </h2>

            <div className="mt-2 flex gap-1 overflow-hidden">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="shrink-0 rounded bg-[#A78BFA]/10 px-1.5 py-0.5 text-[8.5px] font-semibold uppercase tracking-wider text-[#A78BFA]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="shrink-0 pl-2 text-right">
            <div className="font-mono text-[22px] font-bold leading-none tracking-tight text-[#A78BFA]">
              {rating}
              <span className="text-xs">%</span>
            </div>

            <div className="mt-0.5 font-mono text-[12px] uppercase tracking-wider text-[#fff]">
              Rating
            </div>
          </div>
        </div>

        {/* RIGHT BOTTOM */}
        <div className="col-span-2 flex min-w-0 flex-col justify-between border-t border-white/10 py-1.5 px-2">
          <p className="line-clamp-2 text-[12px] leading-relaxed text-[#4a4762] mb-2">
            {game.short_description || "No description available."}
          </p>

          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1.5">
              <span className="rounded border border-white/[0.07] bg-white/[0.04] px-1.5 py-0.5 font-mono text-[12px] font-bold tracking-wide text-[#A78BFA]">
                PC
              </span>

              {game.release_year && (
                <span className="rounded border border-white/[0.07] bg-white/[0.04] px-1.5 py-0.5 font-mono text-[12px] font-bold tracking-wide text-[#A78BFA]">
                  {game.release_year}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={saving}
                onClick={handleToggleSave}
                className={`rounded border px-2 py-1 text-[8px] font-bold uppercase tracking-wider transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  saved
                    ? "border-[#9000e4]/30 bg-[#9000e4]/10 text-[#9000e4]"
                    : "border-[#9000e4]/20 bg-[#9000e4]/10 text-[#fff] hover:border-[#9000e4]/30 hover:text-[#A78BFA]"
                }`}
              >
                {saving ? "..." : saved ? "★" : "☆"}
              </button>

              <span className="text-[21px] font-black leading-none tracking-wide text-[#eeecf7]">
                {formatPrice(game.price)}
              </span>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
};

export default GameBanner;
