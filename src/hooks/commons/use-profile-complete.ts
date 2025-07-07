"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { authService } from "@/services/auth-service";

export function useProfileComplete() {
  const { token, isAuthenticated, loading } = useAuth();
  const [profileComplete, setProfileComplete] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkProfileComplete = async () => {
      if (loading) return;

      if (!isAuthenticated || !token) {
        setProfileComplete(null);
        setChecking(false);
        return;
      }

      try {
        // Vérifier d'abord le flag local
        const isMarkedComplete = authService.isProfileMarkedAsComplete();
        
        if (isMarkedComplete) {
          setProfileComplete(true);
          setChecking(false);
          return;
        }

        // Si pas marqué comme complet, vérifier côté serveur
        const isComplete = await authService.isProfileComplete(token);
        
        if (isComplete) {
          // Marquer comme complet si c'est le cas côté serveur
          authService.markProfileAsComplete();
          setProfileComplete(true);
        } else {
          setProfileComplete(false);
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du profil complet:", error);
        setProfileComplete(false);
      } finally {
        setChecking(false);
      }
    };

    checkProfileComplete();
  }, [token, isAuthenticated, loading]);

  const markAsComplete = () => {
    authService.markProfileAsComplete();
    setProfileComplete(true);
  };

  const clearCompleteFlag = () => {
    authService.clearProfileCompleteFlag();
    setProfileComplete(false);
  };

  return {
    profileComplete,
    checking,
    markAsComplete,
    clearCompleteFlag,
  };
} 