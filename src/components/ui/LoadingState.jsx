const SkeletonBox = ({ className = "" }) => {
  return (
    <div
      className={`animate-pulse rounded-lg bg-white/[0.07] ${className}`}
    />
  );
};

const GameCardSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-xl bg-[#100f18] shadow-[0_12px_32px_rgba(0,0,0,0.35)]">
      <SkeletonBox className="aspect-[16/9] w-full" />

      <div className="space-y-3 p-4">
        <SkeletonBox className="h-4 w-3/4" />
        <SkeletonBox className="h-3 w-1/2" />

        <div className="flex gap-2">
          <SkeletonBox className="h-5 w-16 rounded" />
          <SkeletonBox className="h-5 w-20 rounded" />
          <SkeletonBox className="h-5 w-14 rounded" />
        </div>

        <div className="flex items-center justify-between pt-3">
          <SkeletonBox className="h-3 w-20" />
          <SkeletonBox className="h-5 w-14" />
        </div>
      </div>
    </div>
  );
};

const BannerSkeleton = () => {
  return (
    <div className="w-full animate-pulse rounded-xl bg-[#100f18] p-3">
      <div className="grid h-[340px] grid-cols-5 gap-4">
        <SkeletonBox className="col-span-3 h-full" />

        <div className="col-span-2 flex flex-col gap-4">
          <SkeletonBox className="h-[160px] w-full" />

          <div className="space-y-3">
            <SkeletonBox className="h-5 w-2/3" />
            <SkeletonBox className="h-3 w-1/2" />
            <SkeletonBox className="h-3 w-full" />
            <SkeletonBox className="h-3 w-4/5" />
          </div>

          <div className="mt-auto flex justify-between">
            <SkeletonBox className="h-8 w-20" />
            <SkeletonBox className="h-8 w-24" />
          </div>
        </div>
      </div>
    </div>
  );
};

const CategorySkeleton = () => {
  return (
    <div className="rounded-xl border border-white/10 bg-[#100f18] p-4">
      <SkeletonBox className="mb-4 h-11 w-11 rounded-xl" />
      <SkeletonBox className="mb-2 h-4 w-2/3" />
      <SkeletonBox className="mb-2 h-3 w-full" />
      <SkeletonBox className="h-3 w-4/5" />
    </div>
  );
};

const LoadingState = ({
  variant = "grid",
  count = 3,
}) => {
  if (variant === "banner") {
    return <BannerSkeleton />;
  }

  if (variant === "category") {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {Array.from({ length: count }).map((_, index) => (
          <CategorySkeleton key={index} />
        ))}
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className="space-y-3">
        <SkeletonBox className="h-4 w-1/3" />
        <SkeletonBox className="h-4 w-1/2" />
        <SkeletonBox className="h-4 w-2/5" />
      </div>
    );
  }

  return (
    <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <GameCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default LoadingState;