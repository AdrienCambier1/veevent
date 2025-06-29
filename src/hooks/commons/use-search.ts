"use client";
import { useState, useEffect } from "react";
import { searchGlobal, searchByType } from "@/services/search-service";

export function useSearch({ initialQuery = "", initialTypes = undefined }: { initialQuery?: string, initialTypes?: string[] }) {
  const [query, setQuery] = useState(initialQuery);
  const [types, setTypes] = useState<string[] | undefined>(initialTypes);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) {
      setResults([]);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    const timeout = setTimeout(() => {
      if (types && types.length > 0) {
        searchByType(query, types)
          .then(data => {
            setResults(data);
            setLoading(false);
          })
          .catch((err) => {
            setError(err.message || "Erreur lors de la recherche");
            setLoading(false);
          });
      } else {
        searchGlobal(query)
          .then(data => {
            setResults(data);
            setLoading(false);
          })
          .catch((err) => {
            setError(err.message || "Erreur lors de la recherche");
            setLoading(false);
          });
      }
    }, 400);
    return () => clearTimeout(timeout);
  }, [query, types]);

  return {
    query,
    setQuery,
    types,
    setTypes,
    results,
    loading,
    error,
  };
} 