"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";

interface User {
  sub: string;
  name: string;
  email: string;
  exp: number;
  iat: number;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (
    credentials: Record<string, unknown>,
    redirectPath?: string
  ) => Promise<boolean>;
  logout: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

const setSecureCookie = (name: string, value: string, maxAge: number): void => {
  const encodedValue = encodeURIComponent(value);

  let cookieStr = `${name}=${encodedValue}; path=/; max-age=${maxAge}; SameSite=Lax`;

  if (typeof window !== "undefined" && window.location.protocol === "https:") {
    cookieStr += "; Secure";
  }

  document.cookie = cookieStr;
};

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = (): void => {
      try {
        const storedToken = localStorage.getItem("token");

        if (storedToken) {
          const decodedToken = jwtDecode<User>(storedToken);

          const currentTime = Date.now() / 1000;
          if (decodedToken.exp < currentTime) {
            handleLogout();
          } else {
            setToken(storedToken);
            setUser(decodedToken);
            setIsAuthenticated(true);
            setSecureCookie(
              "auth_token",
              storedToken,
              decodedToken.exp - currentTime
            );
          }
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du token:", error);
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (
    credentials: Record<string, unknown>,
    redirectPath = "/"
  ): Promise<boolean> => {
    try {
      // En production: Appel API pour s'authentifier et récupérer un JWT
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   body: JSON.stringify(credentials)
      // });
      // const data = await response.json();
      // const receivedToken = data.token;

      const fakePayload: User = {
        sub: "@jeanclaudedu06",
        name: "Jean Claude",
        email: "jeanclaudedu06@example.com",
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
        iat: Math.floor(Date.now() / 1000),
      };

      const payloadBase64 = btoa(JSON.stringify(fakePayload))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

      const fakeToken = `eyJhbGciOiJIUzI1NiJ9.${payloadBase64}.SIGNATURE`;

      localStorage.setItem("token", fakeToken);

      setToken(fakeToken);
      setUser(fakePayload);
      setIsAuthenticated(true);
      setSecureCookie("auth_token", fakeToken, 24 * 60 * 60);
      window.location.href = redirectPath;

      return true;
    } catch (error) {
      console.error("Erreur d'authentification:", error);
      return false;
    }
  };

  const handleLogout = (): void => {
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");

    const baseCookieStr =
      "auth_token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax";
    document.cookie = baseCookieStr;

    if (
      typeof window !== "undefined" &&
      window.location.protocol === "https:"
    ) {
      document.cookie = baseCookieStr + "; Secure";
    }
  };

  const logout = (): boolean => {
    handleLogout();
    window.location.href = "/";
    return true;
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    token,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
