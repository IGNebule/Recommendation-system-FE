import { useCallback, useEffect, useState } from "react";

import { preferenceService } from "../services";

const getAppid = (item) => {
  if (!item) return null;

  if (typeof item === "object") {
    return String(item.appid);
  }

  return String(item);
};

const usePreferences = () => {
  const [savedAppids, setSavedAppids] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadPreferences = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await preferenceService.getPreferences();

      const preferences = result.preferences || [];

      const ids = preferences.map(getAppid).filter(Boolean);

      setSavedAppids(new Set(ids));
    } catch (err) {
      setError(err.message || "Failed to load preferences");
    } finally {
      setLoading(false);
    }
  }, []);

  const togglePreference = useCallback(
    async (appid) => {
      const id = String(appid);
      const alreadySaved = savedAppids.has(id);

      setSavedAppids((prev) => {
        const next = new Set(prev);

        if (alreadySaved) {
          next.delete(id);
        } else {
          next.add(id);
        }

        return next;
      });

      try {
        if (alreadySaved) {
          await preferenceService.removePreferences(id);
        } else {
          await preferenceService.savePreferences(id);
        }
      } catch (err) {
        setSavedAppids((prev) => {
          const next = new Set(prev);

          if (alreadySaved) {
            next.add(id);
          } else {
            next.delete(id);
          }

          return next;
        });

        throw err;
      }
    },
    [savedAppids],
  );

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  return {
    savedAppids,
    loading,
    error,
    togglePreference,
    refetch: loadPreferences,
  };
};

console.log("Preference Service:", preferenceService)
export default usePreferences;
