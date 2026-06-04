import { useMemo, useState } from "react";

import { discoverService, genreService, tagService } from "../services";

import useAsync from "../hooks/useAsync";
import usePreferences from "../hooks/usePreferences";

import DiscoverFilterSelect from "../components/discover/DiscoverFilterSelect";
import DiscoverSection from "../components/discover/DiscoverSection";

const RECENT_MIN_YEAR = 2020;

const CATEGORY_OPTIONS = [
  {
    label: "Free to Play",
    value: "free to play",
    terms: ["free to play"],
  },
  {
    label: "Action",
    value: "action",
    terms: ["action"],
  },
  {
    label: "Adventure",
    value: "adventure",
    terms: ["adventure"],
  },
  {
    label: "Early Access",
    value: "early access",
    terms: ["early access"],
  },
  {
    label: "Animation",
    value: "animation",
    terms: ["animation and modeling"],
  },
  {
    label: "Casual",
    value: "casual",
    terms: ["casual"],
  },
  {
    label: "Illustration",
    value: "illustration",
    terms: ["design and illustration"],
  },
  {
    label: "Documentary",
    value: "documentary",
    terms: ["documentary"],
  },
  {
    label: "Gore",
    value: "gore",
    terms: ["gore"],
  },
  {
    label: "Indie",
    value: "indie",
    terms: ["indie"],
  },
  {
    label: "MMORPG",
    value: "mmorpg",
    terms: ["massively multiplayer"],
  },
  {
    label: "Mature",
    value: "mature",
    terms: ["nudity", "sexual content"],
  },
  {
    label: "Racing",
    value: "racing",
    terms: ["racing"],
  },
  {
    label: "RPG",
    value: "rpg",
    terms: ["rpg"],
  },
  {
    label: "Simulation",
    value: "simulation",
    terms: ["simulation"],
  },
  {
    label: "Sport",
    value: "sports",
    terms: ["sports"],
  },
  {
    label: "Strategy",
    value: "strategy",
    terms: ["strategy"],
  },
  {
    label: "Learning",
    value: "learning",
    terms: ["education", "tutorial", "software training"],
  },
  {
    label: "Creative Tools",
    value: "creative-tools",
    terms: [
      "game development",
      "photo editing",
      "audio production",
      "video production",
      "web publishing",
    ],
  },
  {
    label: "Business & Utilities",
    value: "business-utilities",
    terms: ["accounting", "utilities"],
  },
];

const normalize = (value = "") => {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const getGameTerms = (game) => {
  const terms = [
    ...(game.genreList || []),
    ...(game.tagList || []),
    ...(game.categoryList || []),
    game.genres,
    game.tags,
    game.categories,
  ];

  return terms.filter(Boolean).map(normalize);
};

const matchesTerm = (game, term) => {
  if (!term) return true;

  const normalizedTerm = normalize(term);
  const terms = getGameTerms(game);

  return terms.some((item) => {
    return item === normalizedTerm || item.includes(normalizedTerm);
  });
};

const matchesCategory = (game, categoryValue) => {
  if (!categoryValue) return true;

  const selectedCategory = CATEGORY_OPTIONS.find((category) => {
    return category.value === categoryValue;
  });

  if (!selectedCategory) return true;

  return selectedCategory.terms.some((term) => matchesTerm(game, term));
};

const applyFilters = ({ games = [], genre = "", tag = "", category = "" }) => {
  return games.filter((game) => {
    return (
      matchesTerm(game, genre) &&
      matchesTerm(game, tag) &&
      matchesCategory(game, category)
    );
  });
};

const toSelectOptions = (items = []) => {
  return items.map((item) => ({
    label: item,
    value: item,
  }));
};

const DiscoverPage = () => {
  const { savedAppids, togglePreference } = usePreferences();

  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const genres = useAsync(() => genreService.getGenres());

  const tags = useAsync(() => tagService.getTags());

  const trending = useAsync(() =>
    discoverService.getTrendingGames({
      page: 1,
      limit: 30,
      minYear: RECENT_MIN_YEAR,
    }),
  );

  const topRated = useAsync(() =>
    discoverService.getTopRatedGames({
      page: 1,
      limit: 30,
      minReviews: 500,
      minYear: RECENT_MIN_YEAR,
    }),
  );

  const mostPlayed = useAsync(() =>
    discoverService.getMostPlayedGames({
      page: 1,
      limit: 30,
      minYear: RECENT_MIN_YEAR,
    }),
  );

  const genreOptions = useMemo(() => {
    return toSelectOptions(genres.data?.genres || []);
  }, [genres.data]);

  const tagOptions = useMemo(() => {
    return toSelectOptions(tags.data?.tags || tags.data?.topics || []);
  }, [tags.data]);

  const filteredTrending = useMemo(() => {
    return applyFilters({
      games: trending.data?.data || [],
      genre: selectedGenre,
      tag: selectedTag,
      category: selectedCategory,
    });
  }, [trending.data, selectedGenre, selectedTag, selectedCategory]);

  const filteredTopRated = useMemo(() => {
    return applyFilters({
      games: topRated.data?.data || [],
      genre: selectedGenre,
      tag: selectedTag,
      category: selectedCategory,
    });
  }, [topRated.data, selectedGenre, selectedTag, selectedCategory]);

  const filteredMostPlayed = useMemo(() => {
    return applyFilters({
      games: mostPlayed.data?.data || [],
      genre: selectedGenre,
      tag: selectedTag,
      category: selectedCategory,
    });
  }, [mostPlayed.data, selectedGenre, selectedTag, selectedCategory]);

  const handleClearFilters = () => {
    setSelectedGenre("");
    setSelectedTag("");
    setSelectedCategory("");
  };

  return (
    <div className="mx-auto w-full max-w-[1260px] px-4">
      <div className="grid grid-cols-1 gap-10 xl:grid-cols-7 xl:grid-rows-[auto_24px_auto_auto_auto_auto_auto_auto]">
        {/* Title */}
        <section className="xl:col-start-1 xl:col-end-4 xl:row-start-1 xl:row-end-2">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-white/35">
            Discover
          </p>

          <h1 className="mt-2 text-3xl font-black text-white">Explore Games</h1>

          <p className="mt-2 max-w-xl text-sm text-white/50">
            Browse recent games by trending score, rating, playtime, genre,
            tags, and curated categories.
          </p>
        </section>

        {/* Filter genre */}
        <div className="xl:col-start-5 xl:col-end-6 xl:row-start-1 xl:row-end-2">
          <DiscoverFilterSelect
            label="Genre"
            value={selectedGenre}
            options={genreOptions}
            placeholder="All genres"
            onChange={setSelectedGenre}
          />
        </div>

        {/* Filter tag */}
        <div className="xl:col-start-6 xl:col-end-7 xl:row-start-1 xl:row-end-2">
          <DiscoverFilterSelect
            label="Tag"
            value={selectedTag}
            options={tagOptions}
            placeholder="All tags"
            onChange={setSelectedTag}
          />
        </div>

        {/* Filter category */}
        <div className="xl:col-start-7 xl:col-end-8 xl:row-start-1 xl:row-end-2">
          <DiscoverFilterSelect
            label="Category"
            value={selectedCategory}
            options={CATEGORY_OPTIONS}
            placeholder="All categories"
            onChange={setSelectedCategory}
          />

          {(selectedGenre || selectedTag || selectedCategory) && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="mt-2 text-xs font-semibold text-violet-300 hover:text-violet-200"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Trending */}
        <div className="xl:col-start-1 xl:col-end-8 xl:row-start-3 xl:row-end-5">
          <DiscoverSection
            title="Trending"
            description="Recent games sorted by trending score"
            games={filteredTrending}
            loading={trending.loading}
            error={trending.error}
            savedAppids={savedAppids}
            onToggleSave={togglePreference}
          />
        </div>

        {/* Top Rated */}
        <div className="xl:col-start-1 xl:col-end-8 xl:row-start-5 xl:row-end-7">
          <DiscoverSection
            title="Top Rated"
            description="Recent games with strong rating percentage"
            games={filteredTopRated}
            loading={topRated.loading}
            error={topRated.error}
            savedAppids={savedAppids}
            onToggleSave={togglePreference}
          />
        </div>

        {/* Most Played */}
        <div className="xl:col-start-1 xl:col-end-8 xl:row-start-7 xl:row-end-9">
          <DiscoverSection
            title="Most Played"
            description="Recent games sorted by average playtime"
            games={filteredMostPlayed}
            loading={mostPlayed.loading}
            error={mostPlayed.error}
            savedAppids={savedAppids}
            onToggleSave={togglePreference}
          />
        </div>
      </div>
    </div>
  );
};

export default DiscoverPage;