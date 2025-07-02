"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { searchGlobal, searchByType } from "@/services/search-service";
import { PaginationInfo } from "@/types";

interface UseSearchPaginatedOptions {
  initialQuery?: string;
  initialTypes?: string[];
  pageSize?: number;
  scrollTargetRef?: React.RefObject<HTMLElement | null>;
  debounceDelay?: number;
}

export function useSearchPaginated({
  initialQuery = "",
  initialTypes,
  pageSize = 20,
  scrollTargetRef,
  debounceDelay = 400,
}: UseSearchPaginatedOptions = {}) {
  const [query, setQuery] = useState<string>(initialQuery);
  const [types, setTypes] = useState<string[] | undefined>(initialTypes);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | undefined>(
    undefined
  );
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fetchRef = useRef<(() => void) | null>(null);

  const scrollToTarget = useCallback(() => {
    if (scrollTargetRef?.current) {
      const headerHeight = 80;
      const elementTop = scrollTargetRef.current.offsetTop;
      const offsetPosition = elementTop - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [scrollTargetRef]);

  const fetchSearchResults = useCallback(
    async (page: number, size: number = pageSize) => {
      if (!query) {
        setItems([]);
        setPagination(undefined);
        setError(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        let data;
        if (types && types.length > 0) {
          data = await searchByType(query, types, page, size);
        } else {
          data = await searchGlobal(query, page, size);
        }

        // Extraire les résultats de la réponse API
        const searchItems = data._embedded?.searchResultResponses || [];
        const searchPagination = data.page || {
          size,
          totalElements: 0,
          totalPages: 1,
          number: page,
        };

        setItems(searchItems);
        setPagination(searchPagination);
      } catch (err) {
        setError(err as Error);
        setItems([]);
        setPagination(undefined);
      } finally {
        setLoading(false);
      }
    },
    [query, types, pageSize]
  );

  // Mettre à jour la référence de la fonction
  useEffect(() => {
    fetchRef.current = () => fetchSearchResults(0);
  }, [fetchSearchResults]);

  // Recharger les données quand la requête ou les types changent avec debounce
  useEffect(() => {
    // Annuler le timeout précédent
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Créer un nouveau timeout
    debounceTimeoutRef.current = setTimeout(() => {
      if (fetchRef.current) {
        fetchRef.current();
      }
    }, debounceDelay);

    // Cleanup function
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [query, types, debounceDelay]);

  const loadPage = useCallback(
    (page: number) => {
      if (pagination && page >= 0 && page < pagination.totalPages) {
        fetchSearchResults(page);
        scrollToTarget();
      }
    },
    [pagination, fetchSearchResults, scrollToTarget]
  );

  const loadNextPage = useCallback(() => {
    if (pagination && pagination.number < pagination.totalPages - 1) {
      const nextPage = pagination.number + 1;
      fetchSearchResults(nextPage);
      scrollToTarget();
    }
  }, [pagination, fetchSearchResults, scrollToTarget]);

  const loadPreviousPage = useCallback(() => {
    if (pagination && pagination.number > 0) {
      const previousPage = pagination.number - 1;
      fetchSearchResults(previousPage);
      scrollToTarget();
    }
  }, [pagination, fetchSearchResults, scrollToTarget]);

  const hasNextPage = pagination
    ? pagination.number < pagination.totalPages - 1
    : false;
  const hasPreviousPage = pagination ? pagination.number > 0 : false;

  return {
    query,
    setQuery,
    types,
    setTypes,
    items,
    loading,
    error,
    pagination,
    hasNextPage,
    hasPreviousPage,
    loadPage,
    loadNextPage,
    loadPreviousPage,
  };
}
