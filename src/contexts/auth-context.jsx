"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedToken = localStorage.getItem("token");

        if (storedToken) {
          const decodedToken = jwtDecode(storedToken);

          const currentTime = Date.now() / 1000;
          if (decodedToken.exp < currentTime) {
            handleLogout();
          } else {
            setToken(storedToken);
            setUser(decodedToken);
            setIsAuthenticated(true);

            document.cookie = `auth_token=${storedToken}; path=/; max-age=${
              decodedToken.exp - currentTime
            }; SameSite=Lax`;
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

  const login = async (credentials) => {
    try {
      // En production: Appel API pour s'authentifier et récupérer un JWT
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   body: JSON.stringify(credentials)
      // });
      // const data = await response.json();
      // const receivedToken = data.token;

      const fakePayload = {
        sub: "@jeanclaudedu06",
        name: "Jean Claude",
        email: "jeanclaudedu06@example.com",
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
        iat: Math.floor(Date.now() / 1000),
      };

      const fakeToken = `eyJhbGciOiJIUzI1NiJ9.${btoa(
        JSON.stringify(fakePayload)
      )}.SIGNATURE`;

      localStorage.setItem("token", fakeToken);

      document.cookie = `auth_token=${fakeToken}; path=/; max-age=${
        24 * 60 * 60
      }; SameSite=Lax`;

      setToken(fakeToken);
      setUser(fakePayload);
      setIsAuthenticated(true);

      return true;
    } catch (error) {
      console.error("Erreur d'authentification:", error);
      return false;
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    document.cookie = "auth_token=; path=/; max-age=0; SameSite=Lax";
  };

  const logout = () => {
    handleLogout();
    window.location.href = "/";
    return true;
  };

  const value = {
    isAuthenticated,
    user,
    token,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
