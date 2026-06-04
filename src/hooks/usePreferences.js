import { useCallback, useEffect, useMemo, useState } from "react";

import { preferenceService } from "../services";

const usePreferences = () => {
  const [libraryData, setLibraryData] = useState({
    savedAppids: [],
    library: [],
    gamerDNA: {
      topAttributes: [],
      genreBreakdown: [],
    },
    recommendations: [],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const savedAppids = useMemo(() => {
    return new Set((libraryData.savedAppids || []).map(String));
  }, [libraryData.savedAppids]);

  const fetchPreferences = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await preferenceService.getPreferences();

      setLibraryData({
        savedAppids: result.savedAppids || [],
        library: result.library || [],
        gamerDNA: result.gamerDNA || {
          topAttributes: [],
          genreBreakdown: [],
        },
        recommendations: result.recommendations || [],
      });
    } catch (err) {
      setError(err.message || "Failed to fetch library");
    } finally {
      setLoading(false);
    }
  }, []);

  const savePreference = async (appid) => {
    const result = await preferenceService.savePreference(appid);

    setLibraryData({
      savedAppids: result.savedAppids || [],
      library: result.library || [],
      gamerDNA: result.gamerDNA || {
        topAttributes: [],
        genreBreakdown: [],
      },
      recommendations: result.recommendations || [],
    });

    return result;
  };

  const removePreference = async (appid) => {
    const result = await preferenceService.removePreference(appid);

    setLibraryData({
      savedAppids: result.savedAppids || [],
      library: result.library || [],
      gamerDNA: result.gamerDNA || {
        topAttributes: [],
        genreBreakdown: [],
      },
      recommendations: result.recommendations || [],
    });

    return result;
  };

  const togglePreference = async (appid) => {
    try {
      setSaving(true);

      if (savedAppids.has(String(appid))) {
        return await removePreference(appid);
      }

      return await savePreference(appid);
    } finally {
      setSaving(false);
    }
  };

  const updatePreferenceWeight = async ({ appid, weight }) => {
    const result = await preferenceService.updatePreferenceWeight({
      appid,
      weight,
    });

    setLibraryData({
      savedAppids: result.savedAppids || [],
      library: result.library || [],
      gamerDNA: result.gamerDNA || {
        topAttributes: [],
        genreBreakdown: [],
      },
      recommendations: result.recommendations || [],
    });

    return result;
  };

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  return {
    ...libraryData,
    savedAppids,
    loading,
    saving,
    error,
    refetch: fetchPreferences,
    savePreference,
    removePreference,
    togglePreference,
    updatePreferenceWeight,
  };
};

export default usePreferences;
