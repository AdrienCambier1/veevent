"use client";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/auth-context";
import { authService } from "@/services/auth-service";
import { AuthenticatedUser } from "@/types";

export function useUser() {
  const { token, isAuthenticated } = useAuth();
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchUser = useCallback(async () => {
    if (!token || !isAuthenticated) {
      setUser(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const userData = await authService.fetchUserData(token);
      setUser(userData);
    } catch (err) {
      setError(err as Error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [token, isAuthenticated]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const refetch = useCallback(() => {
    fetchUser();
  }, [fetchUser]);

  return { user, loading, error, refetch };
} 