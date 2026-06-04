import { useParams } from "react-router-dom";

import { tagService } from "../services";

import useAsync from "../hooks/useAsync";

import GameGrid from "../components/games/GameGrid";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";

const TagPage = () => {
  const { tag } = useParams();

  const { data, loading, error } = useAsync(
    () =>
      tagService.getGamesByTag({
        tag,
        page: 1,
        limit: 20,
      }),
    [tag],
  );

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold capitalize">Tag: {tag}</h1>

      {loading && <LoadingState />}

      {error && <ErrorState message={error} />}

      {!loading && !error && <GameGrid games={data?.data || []} />}
    </div>
  );
};

export default TagPage;
