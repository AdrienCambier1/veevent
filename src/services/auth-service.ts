import { jwtDecode } from "jwt-decode";
import { UserData } from "@/types";

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
  user?: UserData;
}

export interface AuthError {
  message: string;
  code?: string;
}

import { AUTH_CONFIG } from "@/config/auth.config";

class AuthService {
  private apiUrl: string;
  private tokenKey: string;
  private userKey: string;

  constructor() {
    this.apiUrl = AUTH_CONFIG.API.BASE_URL;
    this.tokenKey = AUTH_CONFIG.TOKEN.STORAGE_KEY;
    this.userKey = AUTH_CONFIG.TOKEN.USER_DATA_KEY;
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

  // Validation du token
  public isTokenValid(token: string): boolean {
    try {
      const decoded = jwtDecode<JWTPayload>(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch {
      return false;
    }
  }

  // Récupération des données utilisateur
  public async fetchUserData(token: string): Promise<UserData | null> {
    try {
      const response = await fetch(`${this.apiUrl}${AUTH_CONFIG.API.ENDPOINTS.USER_PROFILE}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      if (!response.ok) {
        console.error("Erreur API user profile:", response.status);
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error("Erreur récupération données utilisateur:", error);
      return null;
    }
  }

  // Connexion
  public async login(credentials: LoginCredentials): Promise<AuthResponse | AuthError> {
    try {
      if (!credentials.email || !credentials.password) {
        return { message: AUTH_CONFIG.ERROR_MESSAGES.MISSING_CREDENTIALS, code: "MISSING_CREDENTIALS" };
      }

      const response = await fetch(`${this.apiUrl}${AUTH_CONFIG.API.ENDPOINTS.LOGIN}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      // Gestion du cas où le backend retourne une redirection 302 (identifiants invalides)
      if (response.status === 302) {
        return {
          message: AUTH_CONFIG.ERROR_MESSAGES.AUTH_FAILED,
          code: "INVALID_CREDENTIALS"
        };
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { 
          message: errorData.message || AUTH_CONFIG.ERROR_MESSAGES.AUTH_FAILED, 
          code: `HTTP_${response.status}` 
        };
      }

      const { token } = await response.json();

      if (!this.isTokenValid(token)) {
        return { message: AUTH_CONFIG.ERROR_MESSAGES.INVALID_TOKEN, code: "INVALID_TOKEN" };
      }

      const userData = await this.fetchUserData(token);
      if (!userData) {
        return { message: AUTH_CONFIG.ERROR_MESSAGES.USER_FETCH_FAILED, code: "USER_FETCH_FAILED" };
      }

      return { token, user: userData };
    } catch (error) {
      console.error("Erreur connexion:", error);
      return { message: AUTH_CONFIG.ERROR_MESSAGES.NETWORK_ERROR, code: "NETWORK_ERROR" };
    }
  }

  // Inscription
  public async register(data: RegisterData): Promise<AuthResponse | AuthError> {
    try {
      if (!data.email || !data.password || !data.lastName || !data.firstName || !data.pseudo) {
        return { message: "Tous les champs obligatoires sont requis", code: "MISSING_FIELDS" };
      }

      if (data.password.length < AUTH_CONFIG.SECURITY.PASSWORD_MIN_LENGTH) {
        return { message: AUTH_CONFIG.ERROR_MESSAGES.WEAK_PASSWORD, code: "WEAK_PASSWORD" };
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

      const response = await fetch(`${this.apiUrl}${AUTH_CONFIG.API.ENDPOINTS.REGISTER}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { 
          message: errorData.message || "Erreur d'inscription", 
          code: `HTTP_${response.status}` 
        };
      }

      const { token } = await response.json();

      if (!this.isTokenValid(token)) {
        return { message: AUTH_CONFIG.ERROR_MESSAGES.INVALID_TOKEN, code: "INVALID_TOKEN" };
      }

      return { token };
    } catch (error) {
      console.error("Erreur inscription:", error);
      return { message: AUTH_CONFIG.ERROR_MESSAGES.NETWORK_ERROR, code: "NETWORK_ERROR" };
    }
  }

  // Stockage des données d'authentification
  public storeAuthData(token: string, user?: UserData): void {
    if (typeof window === "undefined") return;

    localStorage.setItem(this.tokenKey, token);
    if (user) {
      localStorage.setItem(this.userKey, JSON.stringify(user));
    }

    const decoded = jwtDecode<JWTPayload>(token);
    const maxAge = Math.floor(decoded.exp - Date.now() / 1000);
    this.setSecureCookie(this.tokenKey, token, maxAge);
  }

  // Récupération des données stockées
  public getStoredAuthData(): { token: string | null; user: UserData | null } {
    if (typeof window === "undefined") {
      return { token: null, user: null };
    }

    const token = localStorage.getItem(this.tokenKey);
    const userStr = localStorage.getItem(this.userKey);
    const user = userStr ? JSON.parse(userStr) : null;

    return { token, user };
  }

  // Nettoyage des données d'authentification
  public clearAuthData(): void {
    if (typeof window === "undefined") return;

    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.clearSecureCookie(this.tokenKey);
  }

  // Rafraîchissement du token (si nécessaire)
  public async refreshToken(token: string): Promise<string | null> {
    try {
      const response = await fetch(`${this.apiUrl}${AUTH_CONFIG.API.ENDPOINTS.REFRESH}`, {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

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