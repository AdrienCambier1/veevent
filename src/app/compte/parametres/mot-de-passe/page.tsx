"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useHeader } from "@/contexts/header-context";
import { PasswordStrength } from "@/components/commons/password-strength/password-strength";
import { ArrowLeft } from "iconoir-react";
import Link from "next/link";
import "../parametres.scss";

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ValidationErrors {
  [key: string]: string;
}

export default function MotDePassePage() {
  const { setHideCitySelector } = useHeader();
  const { changePassword, loading, error, clearError } = useAuth();
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [successMessage, setSuccessMessage] = useState<string>("");

  const [passwordForm, setPasswordForm] = useState<PasswordFormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Effacer les erreurs quand l'utilisateur modifie les champs
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [passwordForm.currentPassword, passwordForm.newPassword, passwordForm.confirmPassword, error, clearError]);

  // Validation du formulaire
  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (!passwordForm.currentPassword) {
      errors.currentPassword = "Le mot de passe actuel est requis";
    }

    if (!passwordForm.newPassword) {
      errors.newPassword = "Le nouveau mot de passe est requis";
    } else if (passwordForm.newPassword.length < 8) {
      errors.newPassword = "Le mot de passe doit contenir au moins 8 caractères";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordForm.newPassword)) {
      errors.newPassword = "Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre";
    }

    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = "La confirmation du mot de passe est requise";
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Gestion des changements de champs
  const handleInputChange = (field: keyof PasswordFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setPasswordForm(prev => ({ ...prev, [field]: value }));
    
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Changer le mot de passe
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      clearError(); // Effacer les erreurs précédentes
      const success = await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      
      if (success) {
        setSuccessMessage("Mot de passe modifié avec succès ! Vous allez être redirigé vers la page de connexion.");
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        // Pas de setTimeout car l'utilisateur sera redirigé automatiquement
      }
    } catch (error) {
      console.error("Erreur lors du changement de mot de passe:", error);
    }
  };

  return (
    <section className="wrapper">
      <div className="parametres-page">
        {/* Header avec navigation */}
        <div className="mb-4">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              href="/compte/parametres"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Retour</span>
            </Link>
          </div>
          <h1 className="text-3xl font-bold mb-2">Mot de passe</h1>
          <p className="text-gray-600">Changez votre mot de passe</p>
        </div>

        {/* Messages de succès/erreur */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium">Succès</h3>
                <p className="text-sm mt-1">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium">Erreur</h3>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Formulaire */}
        <div className="flex flex-col gap-4">
          <form onSubmit={handleChangePassword}>
            <div className="flex flex-col gap-4">
              <div className="form-group">
                <label className="form-label">Mot de passe actuel *</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={handleInputChange('currentPassword')}
                  className={`form-input ${validationErrors.currentPassword ? 'error' : ''}`}
                  disabled={loading}
                  placeholder="Entrez votre mot de passe actuel"
                />
                {validationErrors.currentPassword && (
                  <span className="error-message">{validationErrors.currentPassword}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Nouveau mot de passe *</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={handleInputChange('newPassword')}
                  className={`form-input ${validationErrors.newPassword ? 'error' : ''}`}
                  disabled={loading}
                  placeholder="Entrez votre nouveau mot de passe"
                />
                <PasswordStrength password={passwordForm.newPassword} />
                {validationErrors.newPassword && (
                  <span className="error-message">{validationErrors.newPassword}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Confirmer le nouveau mot de passe *</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={handleInputChange('confirmPassword')}
                  className={`form-input ${validationErrors.confirmPassword ? 'error' : ''}`}
                  disabled={loading}
                  placeholder="Confirmez votre nouveau mot de passe"
                />
                {validationErrors.confirmPassword && (
                  <span className="error-message">{validationErrors.confirmPassword}</span>
                )}
              </div>
            </div>

            {/* Bouton de sauvegarde */}
            <div className="flex justify-end mt-8">
              <button
                type="submit"
                disabled={loading}
                className="primary-btn"
              >
                <span>{loading ? "Changement..." : "Changer le mot de passe"}</span>
              </button>
            </div>
          </form>
        </div>

      </div>
    </section>
  );
} 