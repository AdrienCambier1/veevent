import { useState, useEffect, useCallback, useRef } from "react";
import { PaginationInfo } from "@/types";

interface UsePaginatedDataOptions<T> {
  fetchData: (page: number, size?: number) => Promise<{
    items: T[];
    pagination: PaginationInfo;
  }>;
  pageSize?: number;
  scrollTargetRef?: React.RefObject<HTMLElement | null>;
}

interface UsePaginatedDataReturn<T> {
  items: T[];
  loading: boolean;
  error: Error | null;
  pagination?: PaginationInfo;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  loadNextPage: () => void;
  loadPreviousPage: () => void;
  loadPage: (page: number) => void;
  refetch: () => void;
}

export function usePaginatedData<T>({
  fetchData,
  pageSize = 10,
  scrollTargetRef,
}: UsePaginatedDataOptions<T>): UsePaginatedDataReturn<T> {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | undefined>(undefined);
  const fetchDataRef = useRef(fetchData);

  const scrollToTarget = useCallback(() => {
    if (scrollTargetRef?.current) {
      const headerHeight = 80;
      const elementTop = scrollTargetRef.current.offsetTop;
      const offsetPosition = elementTop - headerHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [scrollTargetRef]);

  const fetchPage = useCallback(async (page: number) => {
    try {
      setLoading(true);
      setError(null);

      const result = await fetchDataRef.current(page, pageSize);
      setItems(result.items);
      setPagination(result.pagination);
    } catch (err) {
      setError(err as Error);
      setItems([]);
      setPagination(undefined);
    } finally {
      setLoading(false);
    }
  }, [pageSize]);

  // Chargement initial et rechargement quand fetchData change
  useEffect(() => {
    fetchDataRef.current = fetchData;
    fetchPage(0);
  }, [fetchData, fetchPage]);

  const refetch = useCallback(() => {
    fetchPage(0);
  }, [fetchPage]);

  const loadNextPage = useCallback(() => {
    if (pagination && pagination.number < pagination.totalPages - 1) {
      const nextPage = pagination.number + 1;
      fetchPage(nextPage);
      scrollToTarget();
    }
  }, [pagination, fetchPage, scrollToTarget]);

  const loadPreviousPage = useCallback(() => {
    if (pagination && pagination.number > 0) {
      const previousPage = pagination.number - 1;
      fetchPage(previousPage);
      scrollToTarget();
    }
  }, [pagination, fetchPage, scrollToTarget]);

  const loadPage = useCallback((page: number) => {
    if (pagination && page >= 0 && page < pagination.totalPages) {
      fetchPage(page);
      scrollToTarget();
    }
  }, [pagination, fetchPage, scrollToTarget]);

  const hasNextPage = pagination ? pagination.number < pagination.totalPages - 1 : false;
  const hasPreviousPage = pagination ? pagination.number > 0 : false;

  return {
    items,
    loading,
    error,
    pagination,
    hasNextPage,
    hasPreviousPage,
    loadNextPage,
    loadPreviousPage,
    loadPage,
    refetch,
  };
} 