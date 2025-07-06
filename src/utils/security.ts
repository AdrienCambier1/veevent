import { AUTH_CONFIG } from "@/config/auth.config";

/**
 * Nettoie et valide une chaîne de caractères pour éviter les injections
 */
export function sanitizeString(input: string, maxLength: number = 255): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Limiter la longueur
  const truncated = input.slice(0, maxLength);
  
  // Supprimer les caractères dangereux
  return truncated.replace(/[<>\"'&]/g, '');
}

/**
 * Valide un email selon les règles de sécurité
 */
export function validateEmail(email: string): { isValid: boolean; error?: string } {
  if (!email) {
    return { isValid: false, error: "L'adresse email est requise" };
  }

  if (email.length > AUTH_CONFIG.SECURITY.EMAIL_MAX_LENGTH) {
    return { isValid: false, error: "L'adresse email est trop longue" };
  }

  if (!AUTH_CONFIG.SECURITY.ALLOWED_CHARS.EMAIL.test(email)) {
    return { isValid: false, error: "Format d'email invalide" };
  }

  if (/[<>\"'&]/.test(email)) {
    return { isValid: false, error: "L'adresse email contient des caractères non autorisés" };
  }

  return { isValid: true };
}

/**
 * Valide un mot de passe selon les règles de sécurité
 */
export function validatePassword(password: string): { isValid: boolean; error?: string } {
  if (!password) {
    return { isValid: false, error: "Le mot de passe est requis" };
  }

  if (password.length < AUTH_CONFIG.SECURITY.PASSWORD_MIN_LENGTH) {
    return { isValid: false, error: `Le mot de passe doit contenir au moins ${AUTH_CONFIG.SECURITY.PASSWORD_MIN_LENGTH} caractères` };
  }

  if (password.length > AUTH_CONFIG.SECURITY.PASSWORD_MAX_LENGTH) {
    return { isValid: false, error: "Le mot de passe est trop long" };
  }

  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password)) {
    return { isValid: false, error: "Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial" };
  }

  if (/[<>\"'&]/.test(password)) {
    return { isValid: false, error: "Le mot de passe contient des caractères non autorisés" };
  }

  return { isValid: true };
}

/**
 * Valide un nom/prénom selon les règles de sécurité
 */
export function validateName(name: string, fieldName: string = "Nom"): { isValid: boolean; error?: string } {
  if (!name) {
    return { isValid: false, error: `Le ${fieldName.toLowerCase()} est requis` };
  }

  if (name.length < 2) {
    return { isValid: false, error: `Le ${fieldName.toLowerCase()} doit contenir au moins 2 caractères` };
  }

  if (name.length > AUTH_CONFIG.SECURITY.NAME_MAX_LENGTH) {
    return { isValid: false, error: `Le ${fieldName.toLowerCase()} est trop long` };
  }

  if (!AUTH_CONFIG.SECURITY.ALLOWED_CHARS.NAME.test(name)) {
    return { isValid: false, error: `Le ${fieldName.toLowerCase()} ne peut contenir que des lettres, espaces, tirets et apostrophes` };
  }

  if (/[<>\"'&]/.test(name)) {
    return { isValid: false, error: `Le ${fieldName.toLowerCase()} contient des caractères non autorisés` };
  }

  return { isValid: true };
}

/**
 * Valide un pseudo selon les règles de sécurité
 */
export function validatePseudo(pseudo: string): { isValid: boolean; error?: string } {
  if (!pseudo) {
    return { isValid: false, error: "Le pseudo est requis" };
  }

  if (pseudo.length < 3) {
    return { isValid: false, error: "Le pseudo doit contenir au moins 3 caractères" };
  }

  if (pseudo.length > AUTH_CONFIG.SECURITY.PSEUDO_MAX_LENGTH) {
    return { isValid: false, error: "Le pseudo est trop long" };
  }

  if (!AUTH_CONFIG.SECURITY.ALLOWED_CHARS.PSEUDO.test(pseudo)) {
    return { isValid: false, error: "Le pseudo ne peut contenir que des lettres, chiffres et underscores" };
  }

  if (/\s/.test(pseudo)) {
    return { isValid: false, error: "Le pseudo ne peut pas contenir d'espaces" };
  }

  if (/[àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ]/.test(pseudo)) {
    return { isValid: false, error: "Le pseudo ne peut pas contenir d'accents" };
  }

  return { isValid: true };
}

/**
 * Valide un numéro de téléphone
 */
export function validatePhone(phone: string): { isValid: boolean; error?: string } {
  if (!phone) {
    return { isValid: false, error: "Le téléphone est requis" };
  }

  if (!/^[\+]?[0-9\s\-\(\)]{10,20}$/.test(phone)) {
    return { isValid: false, error: "Format de téléphone invalide" };
  }

  if (/[<>\"'&]/.test(phone)) {
    return { isValid: false, error: "Le téléphone contient des caractères non autorisés" };
  }

  return { isValid: true };
}

/**
 * Valide une description
 */
export function validateDescription(description: string, maxLength: number = 500): { isValid: boolean; error?: string } {
  if (!description) {
    return { isValid: true }; // Optionnel
  }

  if (description.length > maxLength) {
    return { isValid: false, error: `La description ne peut pas dépasser ${maxLength} caractères` };
  }

  if (/[<>\"'&]/.test(description)) {
    return { isValid: false, error: "La description contient des caractères non autorisés" };
  }

  return { isValid: true };
}

/**
 * Nettoie un objet de données pour l'envoi à l'API
 */
export function sanitizeUserData(data: any): any {
  const sanitized: any = {};

  if (data.email) {
    sanitized.email = sanitizeString(data.email, AUTH_CONFIG.SECURITY.EMAIL_MAX_LENGTH);
  }

  if (data.firstName) {
    sanitized.firstName = sanitizeString(data.firstName, AUTH_CONFIG.SECURITY.NAME_MAX_LENGTH);
  }

  if (data.lastName) {
    sanitized.lastName = sanitizeString(data.lastName, AUTH_CONFIG.SECURITY.NAME_MAX_LENGTH);
  }

  if (data.pseudo) {
    sanitized.pseudo = sanitizeString(data.pseudo, AUTH_CONFIG.SECURITY.PSEUDO_MAX_LENGTH);
  }

  if (data.phone) {
    sanitized.phone = sanitizeString(data.phone, 20);
  }

  if (data.description) {
    sanitized.description = sanitizeString(data.description, 500);
  }

  if (data.password) {
    // Le mot de passe n'est pas nettoyé car il peut contenir des caractères spéciaux
    sanitized.password = data.password;
  }

  if (data.categoryKeys && Array.isArray(data.categoryKeys)) {
    sanitized.categoryKeys = data.categoryKeys.filter((cat: any) => 
      typeof cat === 'string' && cat.length <= 50
    );
  }

  return sanitized;
}

/**
 * Vérifie si un utilisateur est banni
 */
export function isUserBanned(user: any): boolean {
  return user?.role === "Banned";
}

/**
 * Valide l'accès d'un utilisateur (vérifie s'il n'est pas banni)
 */
export function validateUserAccess(user: any): { isValid: boolean; error?: string } {
  if (!user) {
    return { isValid: false, error: "Utilisateur non trouvé" };
  }

  if (isUserBanned(user)) {
    return { isValid: false, error: "Votre compte a été suspendu. Contactez l'administrateur pour plus d'informations." };
  }

  return { isValid: true };
} 