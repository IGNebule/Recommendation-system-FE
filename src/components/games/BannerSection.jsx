import GameBannerCarousel from "./GameBannerCarousel";
import LoadingState from "../ui/LoadingState";
import ErrorState from "../ui/ErrorState";

const BannerSection = ({
  title,
  games = [],
  loading = false,
  error = "",
  savedAppids = new Set(),
  onToggleSave,
}) => {
  return (
    <section className="mb-12">
      <div className="mb-5">
        <h2 className="text-l font-normal text-white">{title}</h2>
      </div>

      {loading && <LoadingState message="Loading featured games..." />}

      {error && <ErrorState message={error} />}

      {!loading && !error && (
        <div className="flex items-center justify-center">
          <GameBannerCarousel
            games={games}
            savedAppids={savedAppids}
            onToggleSave={onToggleSave}
          />
        </div>
      )}
    </section>
  );
};

export default BannerSection;
