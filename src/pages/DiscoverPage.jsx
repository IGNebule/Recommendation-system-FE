import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { discoverService, genreService, tagService } from "../services";

import useAsync from "../hooks/useAsync";
import usePreferences from "../hooks/usePreferences";

import DiscoverFilterSelect from "../components/discover/DiscoverFilterSelect";
import DiscoverPreviewSection from "../components/discover/DiscoverPreviewSection";
import AllGamesSection from "../components/discover/AllGamesSection";

const CATEGORY_OPTIONS = [
  {
    label: "Free to Play",
    value: "free-to-play",
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
    value: "early-access",
    terms: ["early access"],
  },
  {
    label: "Mature",
    value: "mature",
    terms: ["nudity", "sexual content"],
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
];

const toSelectOptions = (items = []) => {
  return items.map((item) => ({
    label: item,
    value: item,
  }));
};

const getSectionTitle = (section) => {
  if (section === "top-rated") return "Top Rated Games";
  if (section === "most-played") return "Most Played Games";

  return "Trending Games";
};

const DiscoverPage = () => {
  const { savedAppids, togglePreference } = usePreferences();

  const [searchParams, setSearchParams] = useSearchParams();

  const sectionFromUrl = searchParams.get("section") || "trending";

  const [selectedGenre, setSelectedGenre] = useState(
    searchParams.get("genre") || "",
  );
  const [selectedTag, setSelectedTag] = useState(searchParams.get("tag") || "");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "",
  );

  const selectedCategoryTerms = useMemo(() => {
    if (!selectedCategory) return "";

    const category = CATEGORY_OPTIONS.find((item) => {
      return item.value === selectedCategory;
    });

    if (!category) return "";

    return category.terms.join(",");
  }, [selectedCategory]);

  const allGamesFilters = useMemo(() => {
    return {
      sort: sectionFromUrl,
      genre: selectedGenre,
      tag: selectedTag,
      category: selectedCategoryTerms,
      minReviews: sectionFromUrl === "top-rated" ? 500 : undefined,
    };
  }, [sectionFromUrl, selectedGenre, selectedTag, selectedCategoryTerms]);

  const genres = useAsync(() => genreService.getGenres());
  const tags = useAsync(() => tagService.getTags());

  const trending = useAsync(() =>
    discoverService.getTrendingGames({
      page: 1,
      limit: 3,
    }),
  );

  const topRated = useAsync(() =>
    discoverService.getTopRatedGames({
      page: 1,
      limit: 3,
      minReviews: 500,
    }),
  );

  const mostPlayed = useAsync(() =>
    discoverService.getMostPlayedGames({
      page: 1,
      limit: 3,
    }),
  );

  const genreOptions = useMemo(() => {
    return toSelectOptions(genres.data?.genres || []);
  }, [genres.data]);

  const tagOptions = useMemo(() => {
    return toSelectOptions(tags.data?.tags || tags.data?.topics || []);
  }, [tags.data]);

  const updateUrl = ({
    section = sectionFromUrl,
    genre = selectedGenre,
    tag = selectedTag,
    category = selectedCategory,
  } = {}) => {
    const params = new URLSearchParams();

    if (section) params.set("section", section);
    if (genre) params.set("genre", genre);
    if (tag) params.set("tag", tag);
    if (category) params.set("category", category);

    setSearchParams(params);
  };

  const scrollToAllGames = () => {
    requestAnimationFrame(() => {
      document.getElementById("all-games")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const handleViewMore = (section) => {
    updateUrl({
      section,
    });

    scrollToAllGames();
  };

  const handleGenreChange = (value) => {
    setSelectedGenre(value);
    updateUrl({
      genre: value,
    });
  };

  const handleTagChange = (value) => {
    setSelectedTag(value);
    updateUrl({
      tag: value,
    });
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    updateUrl({
      category: value,
    });
  };

  const handleClearFilters = () => {
    setSelectedGenre("");
    setSelectedTag("");
    setSelectedCategory("");

    updateUrl({
      section: sectionFromUrl,
      genre: "",
      tag: "",
      category: "",
    });
  };

  return (
    <div className="mx-auto w-full max-w-[1260px] px-4">
      <div className="grid grid-cols-1 gap-10 xl:grid-cols-7">
        {/* Title */}
        <section className="xl:col-span-4 flex items-center">

          <h1 className="text-3xl font-bold uppercase text-white">discover</h1>
        </section>

        {/* Filters */}
        <div className="xl:col-span-3">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <DiscoverFilterSelect
              label="Genre"
              value={selectedGenre}
              options={genreOptions}
              placeholder="All genres"
              onChange={handleGenreChange}
            />

            <DiscoverFilterSelect
              label="Tag"
              value={selectedTag}
              options={tagOptions}
              placeholder="All tags"
              onChange={handleTagChange}
            />

            <div>
              <DiscoverFilterSelect
                label="Category"
                value={selectedCategory}
                options={CATEGORY_OPTIONS}
                placeholder="All categories"
                onChange={handleCategoryChange}
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
          </div>
        </div>

        {/* Preview sections */}
        <div className="xl:col-span-7">
          <DiscoverPreviewSection
            title="Trending"
            description=""
            games={trending.data?.data || []}
            loading={trending.loading}
            error={trending.error}
            savedAppids={savedAppids}
            onToggleSave={togglePreference}
            onViewMore={() => handleViewMore("trending")}
          />
        </div>

        <div className="xl:col-span-7">
          <DiscoverPreviewSection
            title="Top Rated"
            description=""
            games={topRated.data?.data || []}
            loading={topRated.loading}
            error={topRated.error}
            savedAppids={savedAppids}
            onToggleSave={togglePreference}
            onViewMore={() => handleViewMore("top-rated")}
          />
        </div>

        <div className="xl:col-span-7">
          <DiscoverPreviewSection
            title="Most Played"
            description=""
            games={mostPlayed.data?.data || []}
            loading={mostPlayed.loading}
            error={mostPlayed.error}
            savedAppids={savedAppids}
            onToggleSave={togglePreference}
            onViewMore={() => handleViewMore("most-played")}
          />
        </div>

        {/* Lazy-loaded section */}
        <div className="xl:col-span-7">
          <div className="mt-6 mb-8 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
            <p className="text-sm text-white/50">
              Showing{" "}
              <span className="font-semibold text-white">
                {getSectionTitle(sectionFromUrl)}
              </span>
              {selectedGenre && (
                <>
                  {" "}
                  with genre{" "}
                  <span className="font-semibold text-violet-300">
                    {selectedGenre}
                  </span>
                </>
              )}
            </p>
          </div>

          <AllGamesSection
            filters={allGamesFilters}
            savedAppids={savedAppids}
            onToggleSave={togglePreference}
          />
        </div>
      </div>
    </div>
  );
};

export default DiscoverPage;
