// Configuration de l'authentification
export const AUTH_CONFIG = {
  // URLs de l'API
  API: {
    BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8090",
    ENDPOINTS: {
      LOGIN: "/auth/authenticate",
      REGISTER: "/auth/register",
      REFRESH: "/auth/refresh",
      USER_PROFILE: "/users/me",
    },
  },

  // Routes de l'application
  ROUTES: {
    PROTECTED: ["/compte", "/parametres"],
    AUTH: ["/connexion", "/inscription"],
    PUBLIC: ["/", "/evenements", "/lieux", "/villes", "/organisateurs"],
  },

  // Redirections par défaut
  REDIRECTS: {
    AFTER_LOGIN: "/compte",
    AFTER_LOGOUT: "/",
    LOGIN_PAGE: "/connexion",
    REGISTER_PAGE: "/inscription",
  },

  // Configuration des tokens
  TOKEN: {
    STORAGE_KEY: "auth_token",
    USER_DATA_KEY: "user_data",
    COOKIE_NAME: "auth_token",
    REFRESH_THRESHOLD: 5 * 60, // 5 minutes avant expiration
  },

  // Configuration de sécurité
  SECURITY: {
    PASSWORD_MIN_LENGTH: 6,
    SESSION_TIMEOUT: 24 * 60 * 60, // 24 heures
    COOKIE_SECURE: true,
    COOKIE_SAME_SITE: "Lax" as const,
  },

  // Messages d'erreur
  ERROR_MESSAGES: {
    MISSING_CREDENTIALS: "Email et mot de passe requis",
    WEAK_PASSWORD: "Le mot de passe doit contenir au moins 6 caractères",
    INVALID_TOKEN: "Token invalide ou expiré",
    USER_FETCH_FAILED: "Impossible de récupérer les données utilisateur",
    NETWORK_ERROR: "Erreur de connexion",
    AUTH_FAILED: "L'authentification a échoué",
    ACCESS_DENIED: "Accès refusé",
  },
} as const;

// Types pour la configuration
export type AuthRoute = typeof AUTH_CONFIG.ROUTES.PROTECTED[number] | typeof AUTH_CONFIG.ROUTES.AUTH[number];

export type RedirectType = keyof typeof AUTH_CONFIG.REDIRECTS;

// Fonctions utilitaires
export const isProtectedRoute = (path: string): boolean => {
  return AUTH_CONFIG.ROUTES.PROTECTED.some(route => 
    path === route || path.startsWith(`${route}/`)
  );
};

export const isAuthRoute = (path: string): boolean => {
  return AUTH_CONFIG.ROUTES.AUTH.some(route => 
    path === route || path.startsWith(`${route}/`)
  );
};

export const getRedirectUrl = (type: RedirectType, fallback?: string): string => {
  return AUTH_CONFIG.REDIRECTS[type] || fallback || "/";
}; 