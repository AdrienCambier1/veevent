"use client";
import {
  authService,
  LoginCredentials,
  RegisterData
} from "@/services/auth-service";
import { userService } from "@/services/user-service";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";




interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials, redirectPath?: string) => Promise<boolean>;
  register: (data: RegisterData, redirectPath?: string) => Promise<boolean>;
  updateProfile: (data: {
    firstName: string;
    lastName: string;
    pseudo?: string;
    phone?: string | null;
    description?: string | null;
    categoryKeys?: string[];
  }) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  requestOrganizerRole: (reason: string) => Promise<boolean>;
  deleteAccount: () => Promise<boolean>;
  logout: (redirectToLogin?: boolean, errorCode?: string) => void;
  clearError: () => void;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  


  // Nettoyer les erreurs
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Rafraîchir l'authentification
  const refreshAuth = useCallback(async () => {
    try {
      console.log("🔄 refreshAuth appelé");
      const storedToken = authService.getStoredToken();
      console.log("🔑 Token stocké:", !!storedToken);
      if (!storedToken) {
        console.log("❌ Pas de token stocké");
        setIsAuthenticated(false);
        setToken(null);
        return;
      }

      // Vérification locale d'abord
      if (authService.isTokenExpired(storedToken)) {
        // Tentative de rafraîchissement du token
        const newToken = await authService.refreshToken(storedToken);
        if (newToken) {
          authService.storeAuthData(newToken);
          setToken(newToken);
          setIsAuthenticated(true);
          return;
        }
        
        // Si le rafraîchissement échoue, déconnexion
        authService.clearAuthData();
        setIsAuthenticated(false);
        setToken(null);
        return;
      }

      // Token non expiré localement, on l'accepte temporairement
      // La validation serveur se fera plus tard via le hook useUser
      setToken(storedToken);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Erreur lors du rafraîchissement de l'authentification:", error);
      authService.clearAuthData();
      setIsAuthenticated(false);
      setToken(null);
    }
  }, []);

  // Vérification initiale de l'authentification
  useEffect(() => {
    const checkAuth = async () => {
      const startTime = Date.now();
      
      try {
        console.log("🔍 Vérification initiale de l'authentification...");
        await refreshAuth();
        console.log("✅ Vérification initiale terminée");
      } catch (error) {
        console.error("Erreur vérification authentification:", error);
        setIsAuthenticated(false);
        setToken(null);
      } finally {
        const elapsed = Date.now() - startTime;
        const minDelay = 1000;

        if (elapsed < minDelay) {
          setTimeout(() => setLoading(false), minDelay - elapsed);
        } else {
          setLoading(false);
        }
      }
    };

    checkAuth();
  }, [refreshAuth]);



  // Vérification périodique de la validité du token (toutes les 5 minutes)
  useEffect(() => {
    if (!isAuthenticated || !token) return;

    const interval = setInterval(async () => {
      try {
        const isTokenValid = await authService.isTokenValid(token);
        if (!isTokenValid) {
          console.warn("Token devenu invalide, déconnexion automatique");
          authService.clearAuthData();
          setIsAuthenticated(false);
          setToken(null);
          // Rediriger vers la page de connexion
          logout(true);
        }
      } catch (error) {
        console.error("Erreur lors de la vérification périodique du token:", error);
        // En cas d'erreur de réseau ou autre, on peut aussi déconnecter pour être sûr
        if (error instanceof Error && (
          error.message.includes("Unauthorized") ||
          error.message.includes("401") ||
          error.message.includes("token")
        )) {
          console.warn("Erreur d'authentification détectée, déconnexion automatique");
          logout(true);
        }
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [isAuthenticated, token]);

  // Connexion
  const login = useCallback(
    async (credentials: LoginCredentials, redirectPath = "/compte"): Promise<boolean> => {
      try {
        setLoading(true);
        clearError();

        const result = await authService.login(credentials);
        
        if ('message' in result) {
          setError(result.message);
          return false;
        }

        const { token: authToken } = result;
        
        authService.storeAuthData(authToken);
        setToken(authToken);
        setIsAuthenticated(true);

        if (typeof window !== "undefined") {
          window.location.href = redirectPath;
        }

        return true;
      } catch (error) {
        console.error("Erreur connexion:", error);
        setError("Erreur de connexion");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [clearError]
  );

  // Inscription
  const register = useCallback(
    async (data: RegisterData, redirectPath = "/connexion"): Promise<boolean> => {
      try {
        setLoading(true);
        clearError();

        const result = await authService.register(data);
        
        if ('message' in result) {
          setError(result.message);
          return false;
        }
        // Après inscription réussie, rediriger vers la connexion
        if (typeof window !== "undefined") {
          window.location.href = redirectPath;
        }

        return true;
      } catch (error) {
        console.error("Erreur inscription:", error);
        setError("Erreur d'inscription");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [clearError]
  );

  // Mise à jour du profil
  const updateProfile = useCallback(
    async (data: {
      firstName: string;
      lastName: string;
      pseudo?: string;
      phone?: string | null;
      description?: string | null;
      categoryKeys?: string[];
    }): Promise<boolean> => {
      try {
        if (!token) {
          setError("Token d'authentification manquant");
          return false;
        }

        setLoading(true);
        clearError();

        const result = await authService.updateUserProfile(token, data);
        
        if ('message' in result) {
          setError(result.message);
          return false;
        }

        return true;
      } catch (error) {
        console.error("Erreur mise à jour profil:", error);
        setError("Erreur lors de la mise à jour du profil");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [token, clearError]
  );

  // Déconnexion
  const logout = useCallback((redirectToLogin = false, errorCode?: string) => {
    authService.clearAuthData();
    setIsAuthenticated(false);
    setToken(null);
    clearError();
    
    if (typeof window !== "undefined") {
      if (redirectToLogin) {
        const errorParam = errorCode ? `?error=${errorCode}` : "";
        window.location.href = `/connexion${errorParam}`;
      } else {
        window.location.href = "/";
      }
    }
  }, [clearError]);

  // Changement de mot de passe
  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string): Promise<boolean> => {
      try {
        if (!token) {
          setError("Token d'authentification manquant");
          return false;
        }

        setLoading(true);
        clearError();

        // Changer directement le mot de passe
        try {
          await userService.changePassword(newPassword, token);
          
          // Déconnexion après changement de mot de passe réussi
          logout(true);
          
          return true;
        } catch (error) {
          setError(error instanceof Error ? error.message : "Erreur lors du changement de mot de passe");
          return false;
        }
      } catch (error) {
        console.error("Erreur changement mot de passe:", error);
        setError(error instanceof Error ? error.message : "Erreur lors du changement de mot de passe");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [token, clearError]
  );

  // Demande pour devenir organisateur
  const requestOrganizerRole = useCallback(
    async (): Promise<boolean> => {
      try {
        if (!token) {
          setError("Token d'authentification manquant");
          return false;
        }

        setLoading(true);
        clearError();

        await userService.requestOrganizerRole(token);
        return true;
      } catch (error) {
        console.error("Erreur demande organisateur:", error);
        setError(error instanceof Error ? error.message : "Erreur lors de la demande d'organisation");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [token, clearError]
  );

  // Suppression du compte
  const deleteAccount = useCallback(
    async (): Promise<boolean> => {
      try {
        if (!token) {
          setError("Token d'authentification manquant");
          return false;
        }

        setLoading(true);
        clearError();

        await userService.deleteAccount(token);
        
        // Déconnexion après suppression
        logout();
        
        return true;
      } catch (error) {
        console.error("Erreur suppression compte:", error);
        setError(error instanceof Error ? error.message : "Erreur lors de la suppression du compte");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [token, clearError, logout]
  );

  const value: AuthContextType = {
    isAuthenticated,
    token,
    loading,
    error,
    login,
    register,
    updateProfile,
    changePassword,
    requestOrganizerRole,
    deleteAccount,
    logout,
    clearError,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
