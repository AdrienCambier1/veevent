"use client";
import { ReactNode, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
}

export function AuthGuard({ 
  children, 
  fallback, 
  redirectTo = "/connexion",
  requireAuth = true 
}: AuthGuardProps) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && requireAuth && !isAuthenticated) {
      const currentPath = window.location.pathname;
      const encodedRedirectPath = encodeURIComponent(currentPath);
      router.push(`${redirectTo}?redirect=${encodedRedirectPath}`);
    }
  }, [isAuthenticated, loading, requireAuth, redirectTo, router]);

  // Affichage du fallback pendant le chargement
  if (loading) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  // Si l'authentification n'est pas requise ou si l'utilisateur est authentifié
  if (!requireAuth || isAuthenticated) {
    return <>{children}</>;
  }

  // Si l'utilisateur n'est pas authentifié et que l'authentification est requise
  return null;
} 