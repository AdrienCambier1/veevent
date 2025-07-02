"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { UserData } from "@/types";
import { 
  authService, 
  LoginCredentials, 
  RegisterData, 
  AuthResponse, 
  AuthError 
} from "@/services/auth-service";

interface JWTPayload {
  sub: string;
  id: number;
  email: string;
  exp: number;
  iat: number;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserData | null;
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
  const [user, setUser] = useState<UserData | null>(null);
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
      const { token: storedToken, user: storedUser } = authService.getStoredAuthData();
      
      if (!storedToken) {
        setIsAuthenticated(false);
        setUser(null);
        setToken(null);
        return;
      }

      if (!authService.isTokenValid(storedToken)) {
        // Tentative de rafraîchissement du token
        const newToken = await authService.refreshToken(storedToken);
        if (newToken) {
          const userData = await authService.fetchUserData(newToken);
          if (userData) {
            authService.storeAuthData(newToken, userData);
            setToken(newToken);
            setUser(userData);
            setIsAuthenticated(true);
            return;
          }
        }
        
        // Si le rafraîchissement échoue, déconnexion
        authService.clearAuthData();
        setIsAuthenticated(false);
        setUser(null);
        setToken(null);
        return;
      }

      // Token valide, récupérer les données utilisateur si nécessaire
      if (!storedUser) {
        const userData = await authService.fetchUserData(storedToken);
        if (userData) {
          authService.storeAuthData(storedToken, userData);
          setUser(userData);
        } else {
          authService.clearAuthData();
          setIsAuthenticated(false);
          setUser(null);
          setToken(null);
          return;
        }
      } else {
        setUser(storedUser);
      }

      setToken(storedToken);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Erreur lors du rafraîchissement de l'authentification:", error);
      authService.clearAuthData();
      setIsAuthenticated(false);
      setUser(null);
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
        setUser(null);
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

        const { token: authToken, user: userData } = result;
        
        if (!userData) {
          setError("Impossible de récupérer les données utilisateur");
          return false;
        }

        authService.storeAuthData(authToken, userData);
        setToken(authToken);
        setUser(userData);
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
    setUser(null);
    setToken(null);
    clearError();
    
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  }, [clearError]);

  const value: AuthContextType = {
    isAuthenticated,
    user,
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
