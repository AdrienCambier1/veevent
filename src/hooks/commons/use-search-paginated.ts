"use client";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { searchGlobal, searchByType } from "@/services/search-service";
import { PaginationInfo, EventFilters } from "@/types";

interface UseSearchPaginatedOptions {
  initialQuery?: string;
  initialTypes?: string[];
  pageSize?: number;
  scrollTargetRef?: React.RefObject<HTMLElement | null>;
  debounceDelay?: number;
  filters?: EventFilters;
}

export function useSearchPaginated({
  initialQuery = "",
  initialTypes,
  pageSize = 20,
  scrollTargetRef,
  debounceDelay = 400,
  filters = {},
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

  const stableFilters = useMemo(() => {
    if (!filters || Object.keys(filters).length === 0) return {};
    
    const validFilters: EventFilters = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (Array.isArray(value) && value.length > 0) {
          (validFilters as any)[key] = value;
        } else if (!Array.isArray(value)) {
          (validFilters as any)[key] = value;
        }
      }
    });
    return validFilters;
  }, [
    filters?.cityName,
    filters?.placeName,
    filters?.categories,
    filters?.minPrice,
    filters?.maxPrice,
    filters?.startDate,
    filters?.endDate,
    filters?.sortBy,
    filters?.sortOrder,
  ]);

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
          data = await searchByType(query, types, page, size, stableFilters);
        } else {
          data = await searchGlobal(query, page, size);
        }

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
    [query, types, pageSize, stableFilters]
  );

  useEffect(() => {
    fetchRef.current = () => fetchSearchResults(0);
  }, [fetchSearchResults]);

  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (query.trim()) {
      debounceTimeoutRef.current = setTimeout(() => {
        if (fetchRef.current) {
          fetchRef.current();
        }
      }, debounceDelay);
    }

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [query, types, stableFilters, debounceDelay]);

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
