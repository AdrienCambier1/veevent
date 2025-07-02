import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

export function useAuthError() {
  const searchParams = useSearchParams();
  const { clearError } = useAuth();

  useEffect(() => {
    const error = searchParams?.get("error");
    
    if (error) {
      // Nettoyer l'erreur de l'URL après l'avoir traitée
      const url = new URL(window.location.href);
      url.searchParams.delete("error");
      window.history.replaceState({}, "", url.toString());
    }
  }, [searchParams, clearError]);

  const getErrorMessage = (errorCode: string | null | undefined): string => {
    switch (errorCode) {
      case "auth_failed":
        return "L'authentification a échoué. Veuillez réessayer.";
      case "invalid_token":
        return "Votre session a expiré. Veuillez vous reconnecter.";
      case "user_fetch_failed":
        return "Impossible de récupérer vos informations. Veuillez réessayer.";
      case "access_denied":
        return "Accès refusé. Vous n'avez pas les permissions nécessaires.";
      case "network_error":
        return "Erreur de connexion. Vérifiez votre connexion internet.";
      default:
        return "Une erreur s'est produite. Veuillez réessayer.";
    }
  };

  return {
    error: searchParams?.get("error"),
    errorMessage: getErrorMessage(searchParams?.get("error")),
    clearError,
  };
} 