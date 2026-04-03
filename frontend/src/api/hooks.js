import { useState, useEffect, useCallback } from "react";
import { gridApi, standingsApi, teamsApi, driversApi, racesApi } from "./client";


// ── Generic async hook ────────────────────────────────────────────────────────
function useAsync(asyncFn, deps = []) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await asyncFn());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => { run(); }, [run]);

  return { data, loading, error, refetch: run };
}