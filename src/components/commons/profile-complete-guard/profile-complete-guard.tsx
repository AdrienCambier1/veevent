"use client";
import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { authService } from "@/services/auth-service";
import { useRouter } from "next/navigation";

interface ProfileCompleteGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
}

export function ProfileCompleteGuard({ 
  children, 
  fallback,
  redirectTo = "/auth/complete-profile"
}: ProfileCompleteGuardProps) {
  const { token, isAuthenticated, loading } = useAuth();
  const router = useRouter();
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

  useEffect(() => {
    if (!checking && profileComplete === false) {
      router.push(redirectTo);
    }
  }, [profileComplete, checking, router, redirectTo]);

  // Afficher le fallback pendant la vérification
  if (checking || loading) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification du profil...</p>
        </div>
      </div>
    );
  }

  // Si le profil n'est pas complet, ne rien afficher (redirection en cours)
  if (profileComplete === false) {
    return null;
  }

  // Si le profil est complet ou l'utilisateur n'est pas connecté, afficher les enfants
  return <>{children}</>;
} 