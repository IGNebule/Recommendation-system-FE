const getInitials = (name = "") => {
  return name
    .split(" ")
    .map((item) => item[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const API_ORIGIN = import.meta.env.VITE_API_ORIGIN

const getAssetUrl = (url) => {
  if (!url) return "";

  if (String(url).startsWith("http")) {
    return url;
  }

  return `${API_ORIGIN}${url}`;
};

const ReviewCard = ({ review }) => {
  const avatarSrc = getAssetUrl(review.authorAvatarUrl);

  return (
    <article className="min-h-[210px] rounded-xl border border-white/10 bg-[#171720] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.28)] transition hover:-translate-y-1 hover:border-violet-400/40 hover:bg-[#1d1d29]">
      <div className="flex items-center gap-3">
        {avatarSrc ? (
          <img
            src={avatarSrc}
            alt={review.authorName}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 text-xs font-black text-white">
            {getInitials(review.authorName)}
          </div>
        )}

        <div className="min-w-0">
          <h3 className="truncate text-sm font-bold text-white">
            {review.authorName || "Anonymous Player"}
          </h3>

          <p className="truncate text-[11px] text-white/35">
            {review.authorTitle || "New Explorer"}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <h4 className="line-clamp-1 text-base font-black text-white">
          {review.reviewTitle}
        </h4>

        <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-white/58">
          {review.message}
        </p>
      </div>

      <div className="mt-5 flex items-center gap-1 text-lg text-pink-200">
        {Array.from({ length: 5 }).map((_, index) => (
          <span key={index}>{index < Number(review.rating) ? "★" : "☆"}</span>
        ))}
      </div>
    </article>
  );
};

export default ReviewCard;
