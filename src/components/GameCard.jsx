import { useState, useRef, useEffect } from "react";

export default function GameCard({ game }) {
  const [saved, setSaved] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [upvoted, setUpvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(
    Number(game.positive_ratings) || 0,
  );
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef(null);

  const total =
    Number(game.positive_ratings || 0) + Number(game.negative_ratings || 0);
  const rating =
    total > 0 ? Math.round((Number(game.positive_ratings) / total) * 100) : 0;

  const genres = game.genres
    ? game.genres
        .split(";")
        .map((g) => g.trim())
        .filter(Boolean)
    : [];

  const toggle = (e, setter) => {
    e.stopPropagation();
    setter((p) => !p);
  };
  const handleUpvote = (e) => {
    e.stopPropagation();
    setUpvoteCount((c) => (upvoted ? c - 1 : c + 1));
    setUpvoted((v) => !v);
  };

  // Auto-play video on hover
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playVideo = () => {
      video.play().catch(() => {
        // Autoplay blocked, show poster instead
      });
    };

    const pauseVideo = () => {
      video.pause();
      video.currentTime = 0;
    };

    const card = video.closest(".group");
    if (!card) return;

    card.addEventListener("mouseenter", playVideo);
    card.addEventListener("mouseleave", pauseVideo);

    return () => {
      card.removeEventListener("mouseenter", playVideo);
      card.removeEventListener("mouseleave", pauseVideo);
    };
  }, [game.movieVideo]);

  return (
    <div className="group relative z-0 hover:z-50">
      {/* Idle card */}
      <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-[#1a1a25] border border-white/[0.06] cursor-pointer">
        <img
          src={game.header_image}
          alt={game.name}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-0 transition-opacity">
          <div className="w-10 h-10 rounded-full bg-black/60 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 text-white ml-0.5"
              fill="currentColor"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Bottom gradient */}
        <div className="absolute inset-x-0 bottom-0 h-[35%] bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        {/* Platform icons + rating badge */}
        <div className="absolute top-2 left-2 flex items-center gap-1">
          <span className="text-[10px] text-white/60">🖥️</span>
        </div>
        <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-green-500/20 text-green-400 text-[11px] font-bold">
          {rating}
        </div>

        {/* Title + upvotes */}
        <div className="absolute bottom-2 left-2 right-2">
          <h3 className="text-white text-sm font-bold leading-tight line-clamp-1 group-hover:line-clamp-none">
            {game.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-white/50 text-[10px] flex items-center gap-0.5">
              <svg
                viewBox="0 0 24 24"
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 5v14M5 12l7-7 7 7" />
              </svg>
              {upvoteCount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Hover expansion - absolute, doesn't affect layout */}
      <div className="absolute top-0 left-0 w-full opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200">
        {/* Video section (replaces static image) */}
        <div className="relative aspect-[16/9] rounded-t-lg overflow-hidden bg-[#1a1a25]">
          {game.movieVideo ? (
            <>
              {/* Poster image while video loads */}
              <img
                src={game.header_image}
                alt={game.name}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${videoLoaded ? "opacity-0" : "opacity-100"}`}
              />
              <video
                ref={videoRef}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${videoLoaded ? "opacity-100" : "opacity-0"}`}
                muted
                loop
                playsInline
                preload="none"
                poster={game.header_image}
                onLoadedData={() => setVideoLoaded(true)}
              >
                <source src={game.movieVideo} type="video/webm" />
              </video>
            </>
          ) : (
            /* Fallback to static image if no video */
            <img
              src={game.header_image}
              alt={game.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          

         
        </div>

        {/* Expanded details panel */}
        <div className="bg-[#1a1a25] rounded-b-lg border border-t-0 border-white/[0.06] p-3 shadow-[0_16px_48px_rgba(0,0,0,0.8)]">
          {/* Title row */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-white text-sm font-bold leading-tight">
              {game.name}
            </h3>
            {game.price && parseFloat(game.price) > 0 && (
              <span className="text-green-400 text-xs font-bold whitespace-nowrap">
                ${game.price}
              </span>
            )}
          </div>

          {/* Upvote + actions */}
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={handleUpvote}
              className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-all ${upvoted ? "bg-pink-500/20 text-pink-300" : "bg-white/10 text-white/70 hover:bg-white/20"}`}
            >
              <svg
                viewBox="0 0 24 24"
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 5v14M5 12l7-7 7 7" />
              </svg>
              {upvoteCount.toLocaleString()}
            </button>
            <button
              onClick={(e) => toggle(e, setSaved)}
              className={`p-1.5 rounded transition-all ${saved ? "bg-pink-500/20 text-pink-300" : "bg-white/10 text-white/50 hover:bg-white/20"}`}
            >
              <svg
                viewBox="0 0 24 24"
                className="w-3.5 h-3.5"
                fill={saved ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </button>
            <button className="p-1.5 rounded bg-white/10 text-white/50 hover:bg-white/20">
              <svg
                viewBox="0 0 24 24"
                className="w-3.5 h-3.5"
                fill="currentColor"
              >
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </button>
          </div>

          {/* Meta details */}
          <div className="mt-3 space-y-1.5 text-[11px]">
            <div className="flex justify-between text-white/50">
              <span>Release date:</span>
              <span className="text-white/80">{game.release_date}</span>
            </div>
            <div className="flex justify-between text-white/50">
              <span>Genres:</span>
              <span className="text-white/80">
                {genres.slice(0, 2).join(", ")}
              </span>
            </div>
            <div className="flex justify-between text-white/50">
              <span>Chart:</span>
              <span className="text-white/80">
                #1 Top {game.release_date?.split("-")[0] || "N/A"}
              </span>
            </div>
          </div>

          {/* Show more button */}
          <button className="w-full mt-3 py-2 rounded bg-white/10 text-white/70 text-xs font-medium hover:bg-white/20 transition-all flex items-center justify-between px-3">
            Show more like this
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}