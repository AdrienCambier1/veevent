import { useState, useEffect, useCallback } from "react";
import { cityService } from "@/services/city-service";
import { SingleUser, PaginationInfo } from "@/types";

interface UseOrganizersPaginatedReturn {
  organizers: SingleUser[];
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

export const useOrganizersPaginated = (
  pageSize: number = 20,
  scrollTargetRef?: React.RefObject<HTMLElement | null>
): UseOrganizersPaginatedReturn => {
  const [organizers, setOrganizers] = useState<SingleUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(0);

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

  const fetchOrganizers = useCallback(async (page: number = 0) => {
    try {
      setLoading(true);
      setError(null);

      const organizersResponse = await cityService.getOrganizers(page, pageSize);
      
      setOrganizers(organizersResponse._embedded?.userResponses || []);
      setPagination(organizersResponse.page);
      setCurrentPage(page);
    } catch (err) {
      setError(err as Error);
      setOrganizers([]);
      setPagination(undefined);
    } finally {
      setLoading(false);
    }
  }, [pageSize]);

  useEffect(() => {
    fetchOrganizers(0);
  }, [fetchOrganizers]);

  const loadPage = useCallback((page: number) => {
    if (pagination && page >= 0 && page < pagination.totalPages) {
      fetchOrganizers(page);
      scrollToTarget();
    }
  }, [pagination, fetchOrganizers, scrollToTarget]);

  const loadNextPage = useCallback(() => {
    if (pagination && currentPage < pagination.totalPages - 1) {
      const nextPage = currentPage + 1;
      fetchOrganizers(nextPage);
      scrollToTarget();
    }
  }, [pagination, currentPage, fetchOrganizers, scrollToTarget]);

  const loadPreviousPage = useCallback(() => {
    if (pagination && currentPage > 0) {
      const previousPage = currentPage - 1;
      fetchOrganizers(previousPage);
      scrollToTarget();
    }
  }, [pagination, currentPage, fetchOrganizers, scrollToTarget]);

  const refetch = useCallback(() => {
    fetchOrganizers(currentPage);
  }, [fetchOrganizers, currentPage]);

  const hasNextPage = pagination ? currentPage < pagination.totalPages - 1 : false;
  const hasPreviousPage = pagination ? currentPage > 0 : false;

  return {
    organizers,
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
}; 