import { preferenceService } from "../services";

import useAsync from "../hooks/useAsync";

import GameGrid from "../components/games/GameGrid";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";

const PreferencesPage = () => {
  const { data, loading, error } = useAsync(() =>
    preferenceService.getPreferences(),
  );

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Your Saved Games</h1>

      {loading && <LoadingState />}

      {error && <ErrorState message={error} />}

      {!loading && !error && <GameGrid games={data?.preferences || []} />}
    </div>
  );
};

export default PreferencesPage;
