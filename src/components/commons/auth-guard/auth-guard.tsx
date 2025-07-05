"use client";
import { ReactNode } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useUser } from "@/hooks/commons/use-user";

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { isAuthenticated, loading } = useAuth();
  const { user, loading: userLoading } = useUser();

  // Afficher le fallback pendant le chargement
  if (loading || userLoading) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // Rediriger si non authentifié
  if (!isAuthenticated) {
    if (typeof window !== "undefined") {
      window.location.href = "/connexion";
    }
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Redirection vers la connexion...</p>
        </div>
      </div>
    );
  }

  // Afficher les enfants si authentifié et données utilisateur disponibles
  return <>{children}</>;
} 