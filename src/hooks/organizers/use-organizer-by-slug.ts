"use client";
import { useState, useEffect, useCallback } from "react";
import { userService } from "@/services/user-service";
import { useAuth } from "@/contexts/auth-context";
import { UserData } from "@/types";

export function useOrganizerBySlug(slug: string) {
  const { token } = useAuth();
  const [organizer, setOrganizer] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchOrganizer = useCallback(async () => {
    if (!slug) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await userService.getUserBySlug(slug, token ?? undefined);
      setOrganizer(data);
    } catch (err) {
      setError(err as Error);
      setOrganizer(null);
    } finally {
      setLoading(false);
    }
  }, [slug, token]);

  useEffect(() => {
    fetchOrganizer();
  }, [fetchOrganizer]);

  const refetch = useCallback(() => {
    fetchOrganizer();
  }, [fetchOrganizer]);

  return { organizer, loading, error, refetch };
} 