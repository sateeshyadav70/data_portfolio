import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

const getRequestUrl = (endpoint) => {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

const useFetch = (endpoint, options = {}, autoFetch = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  const stableOptions = useMemo(() => options, [options]);

  const fetchData = useCallback(
    async (overrideOptions = {}) => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios({
          url: getRequestUrl(endpoint),
          method: "get",
          ...stableOptions,
          ...overrideOptions,
        });
        setData(response.data);
        return response.data;
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch data.";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [endpoint, stableOptions]
  );

  useEffect(() => {
    if (!autoFetch) return;
    fetchData().catch(() => {});
  }, [autoFetch, fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export default useFetch;
