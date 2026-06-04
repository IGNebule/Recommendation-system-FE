import { useCallback, useEffect, useState } from "react";

const useAsync = (asyncFunction, dependencies = [], options = {}) => {
  const { enabled = true, initialData = null } = options;

  const [data, setData] = useState(initialData);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(enabled);

  const execute = useCallback(async () => {
    if (!enabled) {
      setLoading(false)
      setError("")
      return
    }

    try {
      setLoading(true);
      setError("");

      const result = await asyncFunction();

      setData(result);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [enabled, ...dependencies]);

  useEffect(() => {
    execute();
  }, [execute]);

  return {
    data,
    error,
    loading,
    refetch: execute,
  };
};

export default useAsync;
