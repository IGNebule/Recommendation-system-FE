import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { genreService } from "../../services";

import useAsync from "../../hooks/useAsync";

import CategoryCarousel from "./CategoryCarousel";
import LoadingState from "../ui/LoadingState";
import ErrorState from "../ui/ErrorState";

import { CATEGORY_CONFIG } from "./categoryConfig";

const normalize = (value = "") => {
  return String(value).toLowerCase().trim();
};

const buildCategoriesFromGenres = (apiGenres = []) => {
  const apiGenreSet = new Set(apiGenres.map(normalize));

  return CATEGORY_CONFIG.map((category) => {
    const availableGenres = category.apiGenres.filter((genre) => {
      return apiGenreSet.has(normalize(genre));
    });

    return {
      ...category,
      availableGenres,
      available: availableGenres.length > 0,
      badge:
        availableGenres.length > 1
          ? `${availableGenres.length} genres`
          : availableGenres[0] || "Unavailable",
    };
  }).filter((category) => category.available);
};

const CategorySection = ({ autoLoop = true, delay = 8000, title }) => {
  const navigate = useNavigate();

  const [selected, setSelected] = useState(null);

  const { data, loading, error } = useAsync(() => genreService.getGenres());

  const categories = useMemo(() => {
    return buildCategoriesFromGenres(data?.genres || []);
  }, [data]);

  const handleSelectCategory = (category) => {
    setSelected(category);

    const primaryGenre = category.availableGenres?.[0];

    if (!primaryGenre) return;

    navigate(`/genres/${encodeURIComponent(primaryGenre)}`, {
      state: {
        categoryId: category.id,
        categoryName: category.name,
        genres: category.availableGenres,
      },
    });
  };

  return (
    <section className="mb-12 w-full">
      <div className="-mb-9">
        <h2 className="text-lg uppercase font-normal text-white">{title}</h2>
      </div>
      {loading && <LoadingState variant="category" count={3} />}

      {error && <ErrorState message={error} />}

      {!loading && !error && (
        <>
          <CategoryCarousel
            categories={categories}
            onSelect={handleSelectCategory}
            autoLoop={autoLoop}
            delay={delay}
          />

          {selected && (
            <p className="mt-4 text-sm text-white/45">
              Browsing{" "}
              <span className="font-semibold text-white">{selected.name}</span>{" "}
              via{" "}
              <span className="text-violet-300">
                {selected.availableGenres.join(", ")}
              </span>
            </p>
          )}
        </>
      )}
    </section>
  );
};

export default CategorySection;