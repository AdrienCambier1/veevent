"use client";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/auth-context";
import { authService } from "@/services/auth-service";
import { AuthenticatedUser } from "@/types";
import { validateUserAccess } from "@/utils/security";
import { AUTH_CONFIG } from "@/config/auth.config";

export function useUser() {
  const { token, isAuthenticated, logout } = useAuth();
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
        // Token invalide côté serveur, déconnecter l'utilisateur automatiquement
        console.warn("Token invalide côté serveur, déconnexion automatique");
        setUser(null);
        setError(new Error("Token invalide"));
        // Déclencher la déconnexion via le contexte
        logout();
        return;
      }
      
      const userData = await authService.fetchUserData(token);
      
      // Vérifier si l'utilisateur n'est pas banni
      const accessValidation = validateUserAccess(userData);
      if (!accessValidation.isValid) {
        setError(new Error(AUTH_CONFIG.ERROR_MESSAGES.USER_BANNED));
        setUser(null);
        logout(true, "banned");
        return;
      }
      
      setUser(userData);
    } catch (err) {
      console.error("Erreur lors de la récupération des données utilisateur:", err);
      setError(err as Error);
      setUser(null);
      
      // Si l'erreur indique un problème d'authentification, déconnecter automatiquement
      if (err instanceof Error && (
        err.message.includes("Token invalide") ||
        err.message.includes("Unauthorized") ||
        err.message.includes("401") ||
        err.message.includes("token")
      )) {
        console.warn("Erreur d'authentification détectée, déconnexion automatique");
        logout();
      }
    } finally {
      setLoading(false);
    }
  }, [token, isAuthenticated, logout]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const refetch = useCallback(() => {
    fetchUser();
  }, [fetchUser]);

  return { user, loading, error, refetch };
} 