"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/services/auth-service";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        setLoading(true);
        const token = searchParams?.get("token");
        
        // URL de redirection par défaut
        let redirectUrl = searchParams?.get("redirect") || "/compte/tickets";
        
        // Sécurité : empêcher les redirections vers des pages d'auth
        if (redirectUrl.startsWith("/auth/") || redirectUrl.startsWith("/connexion") || redirectUrl.startsWith("/inscription")) {
          redirectUrl = "/compte/tickets";
        }

        if (!token) {
          setError("Aucun token trouvé dans l'URL de callback.");
          router.replace(
            `/connexion?error=auth_failed&redirect=${encodeURIComponent(redirectUrl)}`
          );
          return;
        }

        // Validation du token
        if (!authService.isTokenValid(token)) {
          setError("Token invalide ou expiré.");
          router.replace(
            `/connexion?error=invalid_token&redirect=${encodeURIComponent(redirectUrl)}`
          );
          return;
        }

        // Récupération des données utilisateur
        const userData = await authService.fetchUserData(token);
        if (!userData) {
          setError("Impossible de récupérer les données utilisateur.");
          router.replace(
            `/connexion?error=user_fetch_failed&redirect=${encodeURIComponent(redirectUrl)}`
          );
          return;
        }

        // Stockage des données d'authentification
        authService.storeAuthData(token);
        
        // Redirection vers la page demandée
        router.replace(redirectUrl);
        
      } catch (err: any) {
        console.error("Erreur lors du traitement du callback:", err);
        setError(err.message || "Erreur d'authentification");
        
        const redirectUrl = searchParams?.get("redirect") || "/compte/tickets";
        router.replace(
          `/connexion?error=auth_failed&redirect=${encodeURIComponent(redirectUrl)}`
        );
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
  }, [searchParams, router]);

  // Affichage de chargement
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Authentification en cours...</p>
        </div>
      </div>
    );
  }

  // Affichage d'erreur
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg max-w-md">
            <h2 className="text-lg font-semibold mb-2">Erreur d'authentification</h2>
            <p className="text-sm">{error}</p>
            <button 
              onClick={() => router.push("/connexion")}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
            >
              Retour à la connexion
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
