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
import { UserData } from "@/types";

// interface Social {
//   name: string;
//   url: string;
// }

// interface User {
//   id: number;
//   name: string;
//   fistName: string;
//   pseudo: string;
//   email: string;
//   phone: string;
//   isOrganizer: boolean;
//   eventPastCount: number;
//   eventsCount: number;
//   description: string;
//   imageUrl: string;
//   bannerImgUrl: string;
//   socials: {
//     social: Social[];
//   };
//   themes: number[];
//   note: number;
// }

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
  user: UserData | null;
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
  const [user, setUser] = useState<UserData | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8090";

  // ✅ Fetch user data - sans throw
  const fetchUserData = useCallback(
    async (authToken: string): Promise<UserData | null> => {
      try {
        // 🔄 BACKEND: Décommenter quand API prête

        const response = await fetch(`${apiUrl}/users/me`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        if (!response.ok) {
          console.error("Erreur API user profile:", response.status);
          return null;
        }
        return await response.json();

        // 🗑️ SIMULATION
        // await new Promise((resolve) => setTimeout(resolve, 500));

        // const fakeUserData: UserData = {
        //   id: 1,
        //   lastName: "Doe",
        //   firstName: "John",
        //   pseudo: "johndoe123",
        //   email: "john.doe@mail.com",
        //   phone: "+1234567890",
        //   isOrganizer: true,
        //   eventPastCount: 5,
        //   eventsCount: 10,
        //   description: "Je suis un organisateur d'événements passionné...",
        //   imageUrl: "https://example.com/images/johndoe.jpg",
        //   bannerUrl: "https://example.com/images/banner-johndoe.jpg",
        //   // socials: {
        //   //   social: [
        //   //     { name: "Facebook", url: "https://facebook.com/johndoe" },
        //   //     { name: "Twitter", url: "https://twitter.com/johndoe" },
        //   //     { name: "LinkedIn", url: "https://linkedin.com/in/johndoe" },
        //   //   ],
        //   // },
        //   categories: [{ key: "music", name: "Concert", id: 1 }],
        //   note: 4.5,
        // };

        // return fakeUserData;
      } catch (error) {
        console.error("Erreur récupération données utilisateur:", error);
        return null;
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
      const startTime = Date.now();

      try {
        if (typeof window === "undefined") return;

        const storedToken = localStorage.getItem("token");
        if (!storedToken) return;

        const decodedToken = jwtDecode<JWTPayload>(storedToken);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          console.log("Token expiré, déconnexion automatique");
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
            console.log(
              "Impossible de récupérer les données utilisateur, déconnexion"
            );
            handleLogout();
          }
        }
      } catch (error) {
        console.error("Erreur vérification token:", error);
        handleLogout();
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
  }, [handleLogout, fetchUserData]);

  const login = useCallback(
    async (
      credentials: LoginCredentials,
      redirectPath = "/"
    ): Promise<boolean> => {
      try {
        setLoading(true);

        if (!credentials.email || !credentials.password) {
          console.error("Email et mot de passe requis");
          return false;
        }

        // 🔄 BACKEND: Décommenter quand API prête
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8090";
        const response = await fetch(`${apiUrl}/api/v1/auth/authenticate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });

        if (!response.ok) {
          console.error("Erreur login:", response.status);
          return false;
        }

        const { token: authToken } = await response.json();

        const userData = await fetchUserData(authToken);

        if (!userData) {
          console.error("Impossible de récupérer les données utilisateur");
          return false;
        }

        localStorage.setItem("token", authToken);
        setSecureCookie("auth_token", authToken, 24 * 60 * 60);

        setToken(authToken);
        setUser(userData);
        setIsAuthenticated(true);

        if (typeof window !== "undefined") {
          window.location.href = redirectPath;
        }

        return true;
      } catch (error) {
        console.error("Erreur connexion:", error);
        return false;
      }
    },
    [fetchUserData]
  );

  const register = useCallback(
    async (data: RegisterData, redirectPath = "/"): Promise<boolean> => {
      try {
        setLoading(true);

        if (!data.email || !data.password || !data.name || !data.firstName) {
          console.error("Tous les champs sont requis");
          return false;
        }

        if (data.password.length < 6) {
          console.error("Le mot de passe doit contenir au moins 6 caractères");
          return false;
        }

        // 🔄 BACKEND: Décommenter quand API prête
        const response = await fetch(`${apiUrl}/api/v1/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          console.error("Erreur register:", response.status);
          return false;
        }

        // 🗑️ SIMULATION
        // await new Promise((resolve) => setTimeout(resolve, 1000));

        // const jwtPayload: JWTPayload = {
        //   sub: data.email,
        //   id: Math.floor(Math.random() * 1000),
        //   email: data.email,
        //   exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
        //   iat: Math.floor(Date.now() / 1000),
        // };

        // const payloadBase64 = btoa(JSON.stringify(jwtPayload))
        //   .replace(/\+/g, "-")
        //   .replace(/\//g, "_")
        //   .replace(/=+$/, "");

        // const simulatedToken = `eyJhbGciOiJIUzI1NiJ9.${payloadBase64}.SIGNATURE`;

        const { token: authToken } = await response.json();

        // const newUserData: UserData = {
        //   id: jwtPayload.id,
        //   lastName: data.name,
        //   firstName: data.firstName,
        //   pseudo: data.email.split("@")[0],
        //   email: data.email,
        //   phone: "",
        //   isOrganizer: false,
        //   eventPastCount: 0,
        //   eventsCount: 0,
        //   description: "",
        //   imageUrl: "",
        //   bannerUrl: "",
        //   // socials: { social: [] },
        //   categories: [],
        //   note: 0,
        // };

        localStorage.setItem("token", authToken);
        setSecureCookie("auth_token", authToken, 24 * 60 * 60);

        setToken(authToken);
        // setUser(newUserData);
        setIsAuthenticated(false); // L'utilisateur n'est pas authentifié immédiatement après l'inscription

        if (typeof window !== "undefined") {
          window.location.href = redirectPath;
        }

        return true;
      } catch (error) {
        console.error("Erreur inscription:", error);
        return false;
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
