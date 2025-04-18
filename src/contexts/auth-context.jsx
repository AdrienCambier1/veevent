"use client";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const storedAuth = localStorage.getItem("auth");
      if (storedAuth) {
        const parsedAuth = JSON.parse(storedAuth);
        setIsAuthenticated(parsedAuth.isAuthenticated);
        setUser(parsedAuth.user);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = (userData) => {
    /* Appel API pour authentifier */

    const defaultUser = {
      id: "@jeanclaudedu06",
      name: "Jean Claude",
      email: "jeanclaudedu06@example.com",
    };

    const userToStore = userData || defaultUser;

    setIsAuthenticated(true);
    setUser(userToStore);

    localStorage.setItem(
      "auth",
      JSON.stringify({
        isAuthenticated: true,
        user: userToStore,
      })
    );

    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);

    localStorage.removeItem("auth");
    window.location.href = "/";

    return true;
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
