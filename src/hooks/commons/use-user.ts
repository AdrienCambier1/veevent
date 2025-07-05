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
      
      // Vérifier d'abord si le token est valide côté serveur
      const isTokenValid = await authService.isTokenValid(token);
      if (!isTokenValid) {
        // Token invalide côté serveur, déconnecter l'utilisateur
        console.warn("Token invalide côté serveur, déconnexion automatique");
        // Note: On ne peut pas appeler logout() directement depuis le hook
        // La déconnexion se fera via le contexte lors du prochain refreshAuth
        setUser(null);
        setError(new Error("Token invalide"));
        return;
      }
      
      const userData = await authService.fetchUserData(token);
      setUser(userData);
    } catch (err) {
      console.error("Erreur lors de la récupération des données utilisateur:", err);
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