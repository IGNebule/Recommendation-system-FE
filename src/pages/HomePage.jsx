import { discoverService, recommendationService } from "../services";

import useAsync from "../hooks/useAsync";
import useAuth from "../hooks/useAuth";
import usePreferences from "../hooks/usePreferences";

import LoginRequiredState from "../components/ui/LoginRequiredState";

import GameSection from "../components/games/GameSection";
import BannerSection from "../components/games/BannerSection";
import BrowseByCategory from "../components/categories/BrowseByCategories";

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const { savedAppids, togglePreference } = usePreferences();

  const RECENT_MIN_YEAR = 2019

  const trending = useAsync(() =>
    discoverService.getTrendingGames({
      page: 1,
      limit: 6,
      minYear: RECENT_MIN_YEAR,
    }),
  );

  const featuredGame = trending.data?.data?.[0];

  const topRated = useAsync(() =>
    discoverService.getTopRatedGames({
      page: 1,
      limit: 6,
      minReviews: 1500,
      minYear: RECENT_MIN_YEAR,
    }),
  );

  const mostPlayed = useAsync(() =>
    discoverService.getMostPlayedGames({
      page: 1,
      limit: 10,
      minYear: RECENT_MIN_YEAR,
    }),
  );

  const personalized = useAsync(
    () => recommendationService.getPersonalizedRecommendations(),
    [isAuthenticated],
    {
      enabled: isAuthenticated,
      initialData: {
        recommendations: [],
      },
    },
  );

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-[1260px] px-4">
        <BannerSection
          title="Featured & Recommended"
          games={trending.data?.data || []}
          loading={trending.loading}
          error={trending.error}
          savedAppids={savedAppids}
          onToggleSave={togglePreference}
        />

        <BrowseByCategory />

        <section className="mb-10">
          <div className="mb-4">
            <h2 className="text-lg uppercase font-normal text-white">
              Recommended For You
            </h2>
          </div>

          {isAuthenticated ? (
            <GameSection
              title=""
              games={personalized.data?.recommendations || []}
              loading={personalized.loading}
              error={personalized.error}
              savedAppids={savedAppids}
              onToggleSave={togglePreference}
            />
          ) : (
            <LoginRequiredState message="You must login to see personalized recommendations." />
          )}
        </section>

        <GameSection
          title="Trending Games"
          games={trending.data?.data || []}
          loading={trending.loading}
          error={trending.error}
          savedAppids={savedAppids}
          onToggleSave={togglePreference}
        />

        <GameSection
          title="Top Rated"
          games={topRated.data?.data || []}
          loading={topRated.loading}
          error={topRated.error}
          savedAppids={savedAppids}
          onToggleSave={togglePreference}
        />

        <GameSection
          title="Most Played"
          games={mostPlayed.data?.data || []}
          loading={mostPlayed.loading}
          error={mostPlayed.error}
          savedAppids={savedAppids}
          onToggleSave={togglePreference}
        />
      </div>
    </div>
  );
};

export default HomePage;
