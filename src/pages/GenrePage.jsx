import { useParams } from "react-router-dom";

import { genreService } from "../services";

import useAsync from "../hooks/useAsync";

import GameGrid from "../components/games/GameGrid";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";

const GenrePage = () => {
  const { genre } = useParams();

  const { data, loading, error } = useAsync(
    () =>
      genreService.getGamesByGenre({
        genre,
        page: 1,
        limit: 20,
      }),
    [genre],
  );

    console.log("GENRE PARAM:", genre);
    console.log("GENRE DATA:", data);
    console.log("GENRE LOADING:", loading);
    console.log("GENRE ERROR:", error);
    console.log("GENRE GAMES:", data?.data);
    console.log("GENRE GAMES LENGTH:", data?.data?.length);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold capitalize">Genre: {genre}</h1>

      {loading && <LoadingState />}

      {error && <ErrorState message={error} />}

      {!loading && !error && <GameGrid games={data?.data || []} />}
    </div>
  );
};

export default GenrePage;
