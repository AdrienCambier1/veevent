import { jwtDecode } from "jwt-decode";
import { UserData, AuthenticatedUser } from "@/types";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  lastName: string;
  firstName: string;
  pseudo: string;
  email: string;
  password: string;
  phone?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  bannerUrl?: string | null;
  categories?: string[];
}

export interface JWTPayload {
  sub: string;
  id: number;
  email: string;
  exp: number;
  iat: number;
}

export interface AuthResponse {
  token: string;
  user?: AuthenticatedUser;
}

export interface AuthError {
  message: string;
  code?: string;
}

import { AUTH_CONFIG } from "@/config/auth.config";

// Fonction pour convertir SingleUser vers AuthenticatedUser
function convertSingleUserToAuthenticatedUser(singleUser: any): AuthenticatedUser {
  return {
    id: singleUser.id,
    firstName: singleUser.firstName,
    lastName: singleUser.lastName,
    pseudo: singleUser.pseudo,
    email: singleUser.email,
    phone: singleUser.phone,
    description: singleUser.description,
    imageUrl: singleUser.imageUrl,
    bannerUrl: singleUser.bannerUrl,
    note: singleUser.note,
    role: singleUser.role,
    eventsCount: singleUser.eventsCount,
    eventPastCount: singleUser.eventPastCount,
    socials: singleUser.socials,
    categories: singleUser.categories?.map((cat: string) => ({
      key: cat,
      name: cat,
      description: "",
      trending: false
    })) || [],
    isOrganizer: singleUser.role === "Organizer" || singleUser.role === "Admin" || singleUser.role === "AuthService",
    // Préserver les liens HATEOAS
    _links: singleUser._links
  };
}

class AuthService {
  private apiUrl: string;
  private tokenKey: string;
  private validationCache: Map<string, { isValid: boolean; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 30000; // 30 secondes

  constructor() {
    this.apiUrl = AUTH_CONFIG.API.BASE_URL;
    this.tokenKey = AUTH_CONFIG.TOKEN.STORAGE_KEY;
  }

  // Gestion des cookies sécurisés
  private setSecureCookie(name: string, value: string, maxAge: number): void {
    if (typeof window === "undefined") return;

    const encodedValue = encodeURIComponent(value);
    let cookieStr = `${name}=${encodedValue}; path=/; max-age=${maxAge}; SameSite=Lax`;

    if (window.location.protocol === "https:") {
      cookieStr += "; Secure";
    }

    document.cookie = cookieStr;
  }

  private clearSecureCookie(name: string): void {
    if (typeof window === "undefined") return;

    const baseCookieStr = `${name}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax`;
    document.cookie = baseCookieStr;

    if (window.location.protocol === "https:") {
      document.cookie = baseCookieStr + "; Secure";
    }
  }

  // Validation du token (vérification locale de l'expiration)
  public isTokenExpired(token: string): boolean {
    try {
      const decoded = jwtDecode<JWTPayload>(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp <= currentTime;
    } catch {
      return true;
    }
  }

  // Validation complète du token (vérification côté serveur avec cache)
  public async isTokenValid(token: string): Promise<boolean> {
    try {
      // Vérification locale de l'expiration (rapide)
      if (this.isTokenExpired(token)) {
        return false;
      }

      // Vérifier le cache
      const cached = this.validationCache.get(token);
      const now = Date.now();
      if (cached && (now - cached.timestamp) < this.CACHE_DURATION) {
        return cached.isValid;
      }

      // Vérification côté serveur que l'utilisateur existe toujours
      const response = await fetch(
        `${this.apiUrl}${AUTH_CONFIG.API.ENDPOINTS.USER_PROFILE}`,
        {
          method: 'HEAD', // Utiliser HEAD pour éviter de récupérer les données
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const isValid = response.ok;
      
      if (!isValid) {
        console.log("Token invalide côté serveur:", response.status);
      }

      // Mettre en cache le résultat
      this.validationCache.set(token, { isValid, timestamp: now });

      return isValid;
    } catch (error) {
      console.error("Erreur lors de la validation du token:", error);
      return false;
    }
  }

  // Récupération des données utilisateur
  public async fetchUserData(token: string): Promise<AuthenticatedUser | null> {
    try {
      const response = await fetch(
        `${this.apiUrl}${AUTH_CONFIG.API.ENDPOINTS.USER_PROFILE}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        console.error("Erreur API user profile:", response.status);
        return null;
      }

      const userData = await response.json();
      return convertSingleUserToAuthenticatedUser(userData);
    } catch (error) {
      console.error("Erreur récupération données utilisateur:", error);
      return null;
    }
  }

  // Connexion
  public async login(
    credentials: LoginCredentials
  ): Promise<AuthResponse | AuthError> {
    try {
      if (!credentials.email || !credentials.password) {
        return {
          message: AUTH_CONFIG.ERROR_MESSAGES.MISSING_CREDENTIALS,
          code: "MISSING_CREDENTIALS",
        };
      }

      const response = await fetch(
        `${this.apiUrl}${AUTH_CONFIG.API.ENDPOINTS.LOGIN}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        }
      );

      // Gestion du cas où le backend retourne une redirection 302 (identifiants invalides)
      if (response.status === 302) {
        return {
          message: AUTH_CONFIG.ERROR_MESSAGES.AUTH_FAILED,
          code: "INVALID_CREDENTIALS",
        };
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          message: errorData.message || AUTH_CONFIG.ERROR_MESSAGES.AUTH_FAILED,
          code: `HTTP_${response.status}`,
        };
      }

      const { token } = await response.json();

      if (this.isTokenExpired(token)) {
        return {
          message: AUTH_CONFIG.ERROR_MESSAGES.INVALID_TOKEN,
          code: "INVALID_TOKEN",
        };
      }

      const userData = await this.fetchUserData(token);
      if (!userData) {
        return {
          message: AUTH_CONFIG.ERROR_MESSAGES.USER_FETCH_FAILED,
          code: "USER_FETCH_FAILED",
        };
      }

      return { token, user: userData };
    } catch (error) {
      console.error("Erreur connexion:", error);
      return {
        message: AUTH_CONFIG.ERROR_MESSAGES.NETWORK_ERROR,
        code: "NETWORK_ERROR",
      };
    }
  }

  // Inscription
  public async register(data: RegisterData): Promise<AuthResponse | AuthError> {
    try {
      if (
        !data.email ||
        !data.password ||
        !data.lastName ||
        !data.firstName ||
        !data.pseudo
      ) {
        return {
          message: "Tous les champs obligatoires sont requis",
          code: "MISSING_FIELDS",
        };
      }

      if (data.password.length < AUTH_CONFIG.SECURITY.PASSWORD_MIN_LENGTH) {
        return {
          message: AUTH_CONFIG.ERROR_MESSAGES.WEAK_PASSWORD,
          code: "WEAK_PASSWORD",
        };
      }

      // Préparer les données pour l'API
      const apiData = {
        lastName: data.lastName,
        firstName: data.firstName,
        pseudo: data.pseudo,
        email: data.email,
        password: data.password,
        phone: data.phone || null,
        description: data.description || null,
        imageUrl: data.imageUrl || null,
        bannerUrl: data.bannerUrl || "",
        categoryKeys: (data as any).categoryKeys || [],
      };

      const response = await fetch(
        `${this.apiUrl}${AUTH_CONFIG.API.ENDPOINTS.REGISTER}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(apiData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          message: errorData.message || "Erreur d'inscription",
          code: `HTTP_${response.status}`,
        };
      }

      const { token } = await response.json();

      if (this.isTokenExpired(token)) {
        return {
          message: AUTH_CONFIG.ERROR_MESSAGES.INVALID_TOKEN,
          code: "INVALID_TOKEN",
        };
      }

      return { token };
    } catch (error) {
      console.error("Erreur inscription:", error);
      return {
        message: AUTH_CONFIG.ERROR_MESSAGES.NETWORK_ERROR,
        code: "NETWORK_ERROR",
      };
    }
  }

  // Stockage des données d'authentification (uniquement en cookies sécurisés)
  public storeAuthData(token: string): void {
    if (typeof window === "undefined") return;

    const decoded = jwtDecode<JWTPayload>(token);
    const maxAge = Math.floor(decoded.exp - Date.now() / 1000);
    this.setSecureCookie(this.tokenKey, token, maxAge);
  }

  // Récupération du token stocké (depuis les cookies)
  public getStoredToken(): string | null {
    if (typeof window === "undefined") {
      return null;
    }

    // Récupérer depuis les cookies plutôt que localStorage
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => 
      cookie.trim().startsWith(`${this.tokenKey}=`)
    );
    
    if (tokenCookie) {
      return decodeURIComponent(tokenCookie.split('=')[1]);
    }

    return null;
  }

  // Nettoyage des données d'authentification
  public clearAuthData(): void {
    if (typeof window === "undefined") return;

    this.clearSecureCookie(this.tokenKey);
    this.validationCache.clear(); // Nettoyer le cache de validation
  }

  // Rafraîchissement du token (si nécessaire)
  public async refreshToken(token: string): Promise<string | null> {
    try {
      const response = await fetch(
        `${this.apiUrl}${AUTH_CONFIG.API.ENDPOINTS.REFRESH}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) return null;

      const { token: newToken } = await response.json();
      return newToken;
    } catch (error) {
      console.error("Erreur rafraîchissement token:", error);
      return null;
    }
  }
}

export const authService = new AuthService();
