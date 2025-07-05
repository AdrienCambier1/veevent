"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { authService } from "@/services/auth-service";

export function TokenStatus() {
  const { token, isAuthenticated } = useAuth();
  const [tokenStatus, setTokenStatus] = useState<{
    isValid: boolean;
    isExpired: boolean;
    loading: boolean;
    error?: string;
  }>({
    isValid: false,
    isExpired: false,
    loading: false,
  });

  const checkTokenStatus = async () => {
    if (!token) {
      setTokenStatus({
        isValid: false,
        isExpired: true,
        loading: false,
      });
      return;
    }

    setTokenStatus(prev => ({ ...prev, loading: true }));

    try {
      // Vérification locale de l'expiration
      const isExpired = authService.isTokenExpired(token);
      
      // Vérification complète côté serveur
      const isValid = await authService.isTokenValid(token);

      setTokenStatus({
        isValid,
        isExpired,
        loading: false,
      });
    } catch (error) {
      setTokenStatus({
        isValid: false,
        isExpired: true,
        loading: false,
        error: "Erreur lors de la vérification",
      });
    }
  };

  useEffect(() => {
    checkTokenStatus();
  }, [token]);

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-700 mb-2">Statut du Token</h3>
        <p className="text-gray-600">Non authentifié</p>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm">
      <h3 className="font-semibold text-gray-700 mb-3">Statut du Token</h3>
      
      {tokenStatus.loading ? (
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Vérification en cours...</span>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Expiration locale:</span>
            <span className={`text-sm font-medium ${tokenStatus.isExpired ? 'text-red-600' : 'text-green-600'}`}>
              {tokenStatus.isExpired ? 'Expiré' : 'Valide'}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Validation serveur:</span>
            <span className={`text-sm font-medium ${tokenStatus.isValid ? 'text-green-600' : 'text-red-600'}`}>
              {tokenStatus.isValid ? 'Valide' : 'Invalide'}
            </span>
          </div>

          {tokenStatus.error && (
            <div className="text-sm text-red-600 mt-2">
              {tokenStatus.error}
            </div>
          )}

          <button
            onClick={checkTokenStatus}
            className="mt-3 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
          >
            Re-vérifier
          </button>
        </div>
      )}
    </div>
  );
} 