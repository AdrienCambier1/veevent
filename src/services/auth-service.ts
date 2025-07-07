import { jwtDecode } from "jwt-decode";
import { UserData, AuthenticatedUser } from "@/types";
import { AUTH_CONFIG } from "@/config/auth.config";
import { sanitizeUserData, validateEmail, validatePassword, validateName, validatePseudo, validateUserAccess } from "@/utils/security";

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

    // Encodage sécurisé de la valeur
    const encodedValue = encodeURIComponent(value);
    
    // Construction du cookie avec sécurité adaptée à l'environnement
    let cookieStr = `${name}=${encodedValue}; path=/; max-age=${maxAge}`;
    
    // SameSite adapté à l'environnement
    if (window.location.protocol === "https:" || process.env.NODE_ENV === "production") {
      cookieStr += "; SameSite=Strict";
      cookieStr += "; Secure";
    } else {
      // En développement local (HTTP), utiliser Lax pour éviter les problèmes
      cookieStr += "; SameSite=Lax";
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
      return userData;
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
      // Validation des données d'entrée
      const emailValidation = validateEmail(credentials.email);
      if (!emailValidation.isValid) {
        return {
          message: emailValidation.error || AUTH_CONFIG.ERROR_MESSAGES.MISSING_CREDENTIALS,
          code: "INVALID_EMAIL",
        };
      }

      const passwordValidation = validatePassword(credentials.password);
      if (!passwordValidation.isValid) {
        return {
          message: passwordValidation.error || AUTH_CONFIG.ERROR_MESSAGES.MISSING_CREDENTIALS,
          code: "INVALID_PASSWORD",
        };
      }

      // Nettoyage des données avant envoi
      const sanitizedCredentials = {
        email: credentials.email.trim().toLowerCase(),
        password: credentials.password,
      };

      const response = await fetch(
        `${this.apiUrl}${AUTH_CONFIG.API.ENDPOINTS.LOGIN}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sanitizedCredentials),
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

      // Vérifier si l'utilisateur n'est pas banni
      const accessValidation = validateUserAccess(userData);
      if (!accessValidation.isValid) {
        // Rediriger vers la page de connexion avec le paramètre d'erreur
        if (typeof window !== "undefined") {
          window.location.href = "/connexion?error=banned";
        }
        return {
          message: AUTH_CONFIG.ERROR_MESSAGES.USER_BANNED,
          code: "USER_BANNED",
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
      // Validation des données d'entrée avec les nouvelles fonctions de sécurité
      const emailValidation = validateEmail(data.email);
      if (!emailValidation.isValid) {
        return {
          message: emailValidation.error || "Email invalide",
          code: "INVALID_EMAIL",
        };
      }

      const passwordValidation = validatePassword(data.password);
      if (!passwordValidation.isValid) {
        return {
          message: passwordValidation.error || AUTH_CONFIG.ERROR_MESSAGES.WEAK_PASSWORD,
          code: "INVALID_PASSWORD",
        };
      }

      const firstNameValidation = validateName(data.firstName, "Prénom");
      if (!firstNameValidation.isValid) {
        return {
          message: firstNameValidation.error || "Prénom invalide",
          code: "INVALID_FIRST_NAME",
        };
      }

      const lastNameValidation = validateName(data.lastName, "Nom");
      if (!lastNameValidation.isValid) {
        return {
          message: lastNameValidation.error || "Nom invalide",
          code: "INVALID_LAST_NAME",
        };
      }

      const pseudoValidation = validatePseudo(data.pseudo);
      if (!pseudoValidation.isValid) {
        return {
          message: pseudoValidation.error || "Pseudo invalide",
          code: "INVALID_PSEUDO",
        };
      }

      // Nettoyage des données avant envoi
      const sanitizedData = sanitizeUserData({
        ...data,
        email: data.email.trim().toLowerCase(),
      });

      const response = await fetch(
        `${this.apiUrl}${AUTH_CONFIG.API.ENDPOINTS.REGISTER}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sanitizedData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // Gestion spécifique des erreurs de contrainte unique
        if (errorData.message && errorData.message.includes("duplicate key value violates unique constraint")) {
          if (errorData.message.includes("_user_email_key")) {
            return {
              message: "Cette adresse email est déjà utilisée. Veuillez utiliser une autre adresse email ou vous connecter avec votre compte existant.",
              code: "EMAIL_ALREADY_EXISTS",
            };
          } else if (errorData.message.includes("_user_pseudo_key")) {
            return {
              message: "Ce pseudo est déjà utilisé. Veuillez choisir un autre pseudo.",
              code: "PSEUDO_ALREADY_EXISTS",
            };
          }
        }
        
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

  // Mise à jour du profil utilisateur
  public async updateUserProfile(
    token: string,
    data: {
      firstName: string;
      lastName: string;
      pseudo?: string;
      phone?: string | null;
      description?: string | null;
      categoryKeys?: string[];
    }
  ): Promise<AuthenticatedUser | AuthError> {
    try {
      const response = await fetch(
        `${this.apiUrl}${AUTH_CONFIG.API.ENDPOINTS.USER_PROFILE}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          message: errorData.message || "Erreur lors de la mise à jour du profil",
          code: `HTTP_${response.status}`,
        };
      }

      const updatedUser = await response.json();
      return updatedUser;
    } catch (error) {
      console.error("Erreur mise à jour profil:", error);
      return {
        message: AUTH_CONFIG.ERROR_MESSAGES.NETWORK_ERROR,
        code: "NETWORK_ERROR",
      };
    }
  }

  // Vérifier si un utilisateur a un profil complet
  public async isProfileComplete(token: string): Promise<boolean> {
    try {
      const userData = await this.fetchUserData(token);
      if (!userData) {
        console.log("isProfileComplete: Pas de données utilisateur");
        return false;
      }

      // Vérifier si tous les champs importants sont remplis
      const hasBasicInfo = !!(userData.firstName && userData.lastName);
      const hasContactInfo = !!userData.phone;
      const hasCategories = !!(userData.categories && userData.categories.length > 0);

      // Pour un profil vraiment complet, on veut au moins les infos de base + téléphone + catégories
      const isComplete = hasBasicInfo && hasContactInfo && hasCategories;
      
      return isComplete;
    } catch (error) {
      console.error("Erreur vérification profil complet:", error);
      return false;
    }
  }

  // Marquer le profil comme complet (stockage en cookie)
  public markProfileAsComplete(): void {
    if (typeof window === "undefined") return;
    
    // Stocker un flag dans un cookie pour indiquer que le profil est complet
    // Cookie valide pour 1 an
    const maxAge = 365 * 24 * 60 * 60;
    this.setSecureCookie("profile_complete", "true", maxAge);
    console.log("🔍 AuthService - Profil marqué comme complet, cookie créé");
  }

  // Vérifier si le profil a été marqué comme complet
  public isProfileMarkedAsComplete(): boolean {
    if (typeof window === "undefined") return false;
    
    const cookies = document.cookie.split(';');
    const profileCompleteCookie = cookies.find(cookie => 
      cookie.trim().startsWith("profile_complete=")
    );
    
    const isComplete = profileCompleteCookie?.split('=')[1] === "true";
    console.log("🔍 AuthService - Vérification profil complet:", isComplete, "Cookie:", profileCompleteCookie);
    
    return isComplete;
  }

  // Nettoyer le flag de profil complet
  public clearProfileCompleteFlag(): void {
    if (typeof window === "undefined") return;
    
    this.clearSecureCookie("profile_complete");
  }
}

export const authService = new AuthService();
