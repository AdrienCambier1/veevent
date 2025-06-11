"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { jwtDecode } from "jwt-decode";

interface Social {
  name: string;
  url: string;
}

interface User {
  id: number;
  name: string;
  fistName: string;
  pseudo: string;
  email: string;
  phone: string;
  isOrganizer: boolean;
  eventPastCount: number;
  eventsCount: number;
  description: string;
  imageUrl: string;
  bannerImgUrl: string;
  socials: {
    social: Social[];
  };
  themes: number[];
  note: number;
}

interface JWTPayload {
  sub: string;
  id: number;
  email: string;
  exp: number;
  iat: number;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  firstName: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (
    credentials: LoginCredentials,
    redirectPath?: string
  ) => Promise<boolean>;
  register: (data: RegisterData, redirectPath?: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ✅ Fonctions utilitaires - parfaites
const setSecureCookie = (name: string, value: string, maxAge: number) => {
  if (typeof window === "undefined") return;

  const encodedValue = encodeURIComponent(value);
  let cookieStr = `${name}=${encodedValue}; path=/; max-age=${maxAge}; SameSite=Lax`;

  if (window.location.protocol === "https:") {
    cookieStr += "; Secure";
  }

  document.cookie = cookieStr;
};

const clearSecureCookie = (name: string) => {
  if (typeof window === "undefined") return;

  const baseCookieStr = `${name}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax`;
  document.cookie = baseCookieStr;

  if (window.location.protocol === "https:") {
    document.cookie = baseCookieStr + "; Secure";
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = useCallback(
    async (authToken: string): Promise<User | null> => {
      try {
        // 🔄 BACKEND: Décommenter quand API prête
        // const response = await fetch('/api/user/profile', {
        //   headers: { Authorization: `Bearer ${authToken}` }
        // });
        // return await response.json();

        // 🗑️ SIMULATION
        await new Promise((resolve) => setTimeout(resolve, 500));

        const fakeUserData: User = {
          id: 1,
          name: "Doe",
          fistName: "John",
          pseudo: "johndoe123",
          email: "john.doe@mail.com",
          phone: "+1234567890",
          isOrganizer: true,
          eventPastCount: 5,
          eventsCount: 10,
          description: "Je suis un organisateur d'événements passionné...",
          imageUrl: "https://example.com/images/johndoe.jpg",
          bannerImgUrl: "https://example.com/images/banner-johndoe.jpg",
          socials: {
            social: [
              { name: "Facebook", url: "https://facebook.com/johndoe" },
              { name: "Twitter", url: "https://twitter.com/johndoe" },
              { name: "LinkedIn", url: "https://linkedin.com/in/johndoe" },
            ],
          },
          themes: [1, 2, 3],
          note: 4.5,
        };

        return fakeUserData;
      } catch (error) {
        throw new Error(
          "Erreur lors de la récupération des données utilisateur : " +
            (error as Error).message
        );
      }
    },
    []
  );

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);

    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      clearSecureCookie("auth_token");
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (typeof window === "undefined") return;

        const storedToken = localStorage.getItem("token");
        if (!storedToken) return;

        const decodedToken = jwtDecode<JWTPayload>(storedToken);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          handleLogout();
        } else {
          const userData = await fetchUserData(storedToken);

          if (userData) {
            setToken(storedToken);
            setUser(userData);
            setIsAuthenticated(true);
            setSecureCookie(
              "auth_token",
              storedToken,
              Math.floor(decodedToken.exp - currentTime)
            );
          } else {
            handleLogout();
          }
        }
      } catch (error) {
        handleLogout();
        throw new Error(
          "Erreur lors de la vérification du token : " +
            (error as Error).message
        );
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [handleLogout, fetchUserData]);

  const login = useCallback(
    async (
      credentials: LoginCredentials,
      redirectPath: string = "/"
    ): Promise<boolean> => {
      try {
        setLoading(true);

        if (!credentials.email || !credentials.password) {
          throw new Error("Email et mot de passe requis");
        }

        // 🔄 BACKEND: Décommenter quand API prête
        // const response = await fetch('/api/auth/login', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(credentials)
        // });
        // const { token: authToken } = await response.json();

        // 🗑️ SIMULATION
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const jwtPayload: JWTPayload = {
          sub: credentials.email,
          id: 1,
          email: credentials.email,
          exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
          iat: Math.floor(Date.now() / 1000),
        };

        const payloadBase64 = btoa(JSON.stringify(jwtPayload))
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
          .replace(/=+$/, "");

        const simulatedToken = `eyJhbGciOiJIUzI1NiJ9.${payloadBase64}.SIGNATURE`;

        const userData = await fetchUserData(simulatedToken);

        if (!userData) {
          throw new Error("Impossible de récupérer les données utilisateur");
        }

        localStorage.setItem("token", simulatedToken);
        setSecureCookie("auth_token", simulatedToken, 24 * 60 * 60);

        setToken(simulatedToken);
        setUser(userData);
        setIsAuthenticated(true);

        if (typeof window !== "undefined") {
          window.location.href = redirectPath;
        }

        return true;
      } catch (error) {
        throw new Error("Erreur de connexion : " + (error as Error).message);
      } finally {
        setLoading(false);
      }
    },
    [fetchUserData]
  );

  const register = useCallback(
    async (
      data: RegisterData,
      redirectPath: string = "/"
    ): Promise<boolean> => {
      try {
        setLoading(true);

        if (!data.email || !data.password || !data.name || !data.firstName) {
          throw new Error("Tous les champs sont requis");
        }

        if (data.password.length < 6) {
          throw new Error(
            "Le mot de passe doit contenir au moins 6 caractères"
          );
        }

        // 🔄 BACKEND: Décommenter quand API prête
        // const response = await fetch('/api/auth/register', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(data)
        // });

        // 🗑️ SIMULATION
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const jwtPayload: JWTPayload = {
          sub: data.email,
          id: Math.floor(Math.random() * 1000),
          email: data.email,
          exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
          iat: Math.floor(Date.now() / 1000),
        };

        const payloadBase64 = btoa(JSON.stringify(jwtPayload))
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
          .replace(/=+$/, "");

        const simulatedToken = `eyJhbGciOiJIUzI1NiJ9.${payloadBase64}.SIGNATURE`;

        const newUserData: User = {
          id: jwtPayload.id,
          name: data.name,
          fistName: data.firstName,
          pseudo: data.email.split("@")[0],
          email: data.email,
          phone: "",
          isOrganizer: false,
          eventPastCount: 0,
          eventsCount: 0,
          description: "",
          imageUrl: "",
          bannerImgUrl: "",
          socials: { social: [] },
          themes: [],
          note: 0,
        };

        localStorage.setItem("token", simulatedToken);
        setSecureCookie("auth_token", simulatedToken, 24 * 60 * 60);

        setToken(simulatedToken);
        setUser(newUserData);
        setIsAuthenticated(true);

        if (typeof window !== "undefined") {
          window.location.href = redirectPath;
        }

        return true;
      } catch (error) {
        throw new Error("Erreur d'inscription : " + (error as Error).message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const logout = useCallback(() => {
    handleLogout();
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  }, [handleLogout]);

  const value: AuthContextType = {
    isAuthenticated,
    user,
    token,
    loading,

    login,
    register,
    logout,
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
