import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { gameService } from "../../services";

const subLinks = [
  { label: "Library", path: "/preferences" },
  { label: "Reports", path: "/reports" },
];

const SearchIcon = () => (
  <svg
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m21 21-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
    />
  </svg>
);

const normalize = (value = "") => {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const extractGames = (payload) => {
  if (Array.isArray(payload)) return payload;

  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.games)) return payload.games;

  return [];
};

const buildSearchText = (game) => {
  return normalize(`
    ${game.name || ""}
    ${game.search_name || ""}
    ${game.genres || ""}
    ${game.categories || ""}
    ${game.tags || ""}
    ${game.developer || ""}
    ${game.publisher || ""}
  `);
};

const SubNavbar = ({ isScrolled = false }) => {
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const [query, setQuery] = useState("");
  const [games, setGames] = useState([]);
  const [searchFocused, setSearchFocused] = useState(false);
  const [loadingSearchIndex, setLoadingSearchIndex] = useState(false);
  const [hasLoadedSearchIndex, setHasLoadedSearchIndex] = useState(false);

  const loadSearchIndex = async () => {
    if (hasLoadedSearchIndex || loadingSearchIndex) return;

    try {
      setLoadingSearchIndex(true);

      const payload = await gameService.getGames({
        page: 1,
        limit: 50000,
        sort: "search",
      });

      const results = extractGames(payload);

      setGames(results);
      setHasLoadedSearchIndex(true);
    } catch (err) {
      console.error("Failed to load search index:", err);
    } finally {
      setLoadingSearchIndex(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!searchRef.current) return;

      if (!searchRef.current.contains(event.target)) {
        setSearchFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const searchResults = useMemo(() => {
    const normalizedQuery = normalize(query);

    if (normalizedQuery.length < 2) return [];

    return games
      .map((game) => ({
        ...game,
        searchText: buildSearchText(game),
      }))
      .filter((game) => {
        return game.searchText.includes(normalizedQuery);
      })
      .slice(0, 8);
  }, [games, query]);

  const showDropdown = searchFocused && query.trim().length >= 2;

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmed = query.trim();

    if (!trimmed) return;

    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    setSearchFocused(false);
  };

  const handleSelectGame = (game) => {
    setQuery("");
    setSearchFocused(false);

    navigate(`/games/${game.appid}`);
  };

  return (
    <div
      className={`w-full bg-gradient-to-r from-[#1d1830]/90 via-[#161224]/90 to-[#020105]/90 transition-all duration-300 ease-in-out ${
        isScrolled ? "shadow-[0_8px_24px_rgba(0,0,0,0.35)]" : ""
      }`}
    >
      <div className="mx-auto max-w-[1260px] px-4">
        <div
          className={`flex min-h-[48px] items-center justify-between gap-4 px-4 transition-all duration-300 ${
            isScrolled ? "rounded-none" : ""
          }`}
        >
          <nav className="flex items-center gap-1">
            {subLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  [
                    "relative px-4 py-3 text-sm font-semibold text-white/80 transition",
                    "hover:bg-white/10 hover:text-white",
                    isActive ? "bg-white/10 text-white" : "text-white/70",
                  ].join(" ")
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <form
            ref={searchRef}
            onSubmit={handleSubmit}
            className="relative hidden w-full max-w-md items-center md:flex"
          >
            <input
              value={query}
              onFocus={() => {
                setSearchFocused(true);
                loadSearchIndex();
              }}
              onChange={(e) => {
                setQuery(e.target.value);
                setSearchFocused(true);
              }}
              placeholder="Search the store"
              className="h-9 flex-1 border border-[#2D2643] bg-transparent px-4 text-sm italic text-white outline-none placeholder:text-[#9CA3AF] focus:border-[#7C3AED]"
            />

            <button
              type="submit"
              className="flex h-9 w-11 items-center justify-center bg-[#7C3AED] text-white transition hover:bg-[#7cccf5]"
              aria-label="Search"
            >
              <SearchIcon />
            </button>

            {showDropdown ? (
              <div className="absolute right-0 top-[42px] z-50 w-full overflow-hidden border border-[#2D2643] bg-[#0d0a16] shadow-[0_18px_45px_rgba(0,0,0,0.45)]">
                {loadingSearchIndex ? (
                  <div className="px-4 py-3 text-sm text-white/60">
                    Loading search index...
                  </div>
                ) : searchResults.length > 0 ? (
                  <>

                    {searchResults.map((game) => (
                      <button
                        key={game.appid}
                        type="button"
                        onClick={() => handleSelectGame(game)}
                        className="flex w-full items-center gap-3 border-b border-white/5 px-3 py-3 text-left transition hover:bg-white/10"
                      >
                        <img
                          src={game.header_image || game.background}
                          alt={game.name}
                          className="h-12 w-20 object-cover"
                          loading="lazy"
                        />

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-white">
                            {game.name}
                          </p>

                          <p className="mt-1 truncate text-xs text-white/50">
                            {game.genres || game.tags || "Game"}
                          </p>
                        </div>

                        <div className="text-xs font-semibold text-[#7cccf5]">
                          {game.rating_percent
                            ? `${Number(game.rating_percent).toFixed(0)}%`
                            : ""}
                        </div>
                      </button>
                    ))}

                    <button
                      type="submit"
                      className="w-full px-4 py-3 text-left text-sm font-semibold text-[#7cccf5] transition hover:bg-white/10"
                    >
                      View all results for "{query}"
                    </button>
                  </>
                ) : (
                  <div className="px-4 py-3 text-sm text-white/60">
                    No games found for "{query}"
                  </div>
                )}
              </div>
            ) : null}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubNavbar;
