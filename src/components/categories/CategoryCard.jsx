const CategoryCard = ({ category, onSelect }) => {
  const {
    name,
    description,
    icon,
    badge,
    color = "violet",
    available = true,
  } = category;

  const colorClass = {
    red: "bg-red-500/10 text-red-300 border-red-500/20",
    violet: "bg-violet-500/10 text-violet-300 border-violet-500/20",
    green: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    blue: "bg-sky-500/10 text-sky-300 border-sky-500/20",
    pink: "bg-pink-500/10 text-pink-300 border-pink-500/20",
    gray: "bg-white/10 text-white/60 border-white/10",
  };

  return (
    <button
      type="button"
      disabled={!available}
      onClick={() => onSelect(category)}
      className="group relative min-h-[130px] overflow-hidden rounded-xl border border-white/10 bg-[#100f18] p-4 text-left shadow-[0_12px_32px_rgba(0,0,0,0.35)] transition duration-200 hover:-translate-y-1 hover:border-white/20 disabled:cursor-not-allowed disabled:opacity-40"
      aria-label={`Browse ${name}`}
    >
      <div
        className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl border text-xl ${
          colorClass[color] || colorClass.violet
        }`}
      >
        {icon}
      </div>

      <div className="relative z-10">
        <h3 className="text-sm font-bold uppercase tracking-wide text-white">
          {name}
        </h3>

        <p className="mt-1 line-clamp-2 text-xs text-white/45">{description}</p>

        {badge && (
          <span className="mt-3 inline-flex rounded bg-white/5 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/40">
            {badge}
          </span>
        )}
      </div>

      <span className="absolute bottom-3 right-4 translate-y-1 text-lg text-white/30 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
        ↗
      </span>

      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/[0.03]" />
    </button>
  );
};

export default CategoryCard;
