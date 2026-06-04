import { useSearchParams } from "react-router-dom";

import { searchService } from "../services";

import useAsync from "../hooks/useAsync";

import GameGrid from "../components/games/GameGrid";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";

const SearchPage = () => {
  const [searchParams] = useSearchParams();

  const query = searchParams.get("q") || "";

  const { data, loading, error } = useAsync(
    () =>
      searchService.searchGames({
        q: query,
        page: 1,
        limit: 20,
      }),
    [query],
  );

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Search results for "{query}"</h1>

      {loading && <LoadingState />}

      {error && <ErrorState message={error} />}

      {!loading && !error && <GameGrid games={data?.data || []} />}
    </div>
  );
};

export default SearchPage;
