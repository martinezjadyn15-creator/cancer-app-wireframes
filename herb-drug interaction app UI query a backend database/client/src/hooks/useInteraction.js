import { useState, useEffect } from 'react';
import { fetchInteraction } from '../api.js';

export function useInteraction(drug) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!drug) {
      setData(null);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchInteraction(drug)
      .then((result) => {
        if (cancelled) return;
        setData(result);
        if (!result) setError(`No interaction data for ${drug}`);
      })
      .catch((err) => {
        if (cancelled) return;
        setData(null);
        setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [drug]);

  return { data, loading, error };
}
