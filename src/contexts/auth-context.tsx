"use client";
import {
  authService,
  LoginCredentials,
  RegisterData
} from "@/services/auth-service";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";


interface JWTPayload {
  sub: string;
  id: number;
  email: string;
  exp: number;
  iat: number;
}

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials, redirectPath?: string) => Promise<boolean>;
  register: (data: RegisterData, redirectPath?: string) => Promise<boolean>;
  logout: () => void;
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
      const storedToken = authService.getStoredToken();
      if (!storedToken) {
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
        await refreshAuth();
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
        }
      } catch (error) {
        console.error("Erreur lors de la vérification périodique du token:", error);
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

  // Déconnexion
  const logout = useCallback(() => {
    authService.clearAuthData();
    setIsAuthenticated(false);
    setToken(null);
    clearError();
    
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  }, [clearError]);

  const value: AuthContextType = {
    isAuthenticated,
    token,
    loading,
    error,
    login,
    register,
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
