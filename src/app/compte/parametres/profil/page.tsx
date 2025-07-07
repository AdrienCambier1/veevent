"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useUser } from "@/hooks/commons/use-user";
import { useHeader } from "@/contexts/header-context";
import { categoryService } from "@/services/category-service";
import { Category } from "@/types";
import { PasswordStrength } from "@/components/commons/password-strength/password-strength";
import SelectorThemeTags from "@/components/tags/selector-theme-tags/selector-theme-tags";
import { ArrowLeft } from "iconoir-react";
import Link from "next/link";
import "../parametres.scss";

interface ProfileFormData {
  firstName: string;
  lastName: string;
  pseudo: string;
  phone: string;
  description: string;
  categoryKeys: string[];
}

interface ValidationErrors {
  [key: string]: string;
}

export default function ProfilPage() {
  const { setHideCitySelector } = useHeader();
  const { updateProfile, loading, error, clearError } = useAuth();
  const { user, refetch: refetchUser } = useUser();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [successMessage, setSuccessMessage] = useState<string>("");

  const [profileForm, setProfileForm] = useState<ProfileFormData>({
    firstName: "",
    lastName: "",
    pseudo: "",
    phone: "",
    description: "",
    categoryKeys: [],
  });

  useEffect(() => {
    setHideCitySelector(true);
    return () => setHideCitySelector(false);
  }, [setHideCitySelector]);

  // Charger les données utilisateur dans le formulaire
  useEffect(() => {
    if (user) {
      setProfileForm(prev => ({
        ...prev,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        pseudo: user.pseudo || "",
        phone: user.phone || "",
        description: user.description || "",
        categoryKeys: user.categories?.map(cat => cat.key) || [],
      }));
    }
  }, [user]);

  // Charger les catégories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true);
        const categoriesData = await categoryService.getAllCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Erreur lors du chargement des catégories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  // Validation du formulaire
  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (!profileForm.firstName) {
      errors.firstName = "Le prénom est requis";
    } else if (profileForm.firstName.length < 2) {
      errors.firstName = "Le prénom doit contenir au moins 2 caractères";
    } else if (profileForm.firstName.length > 50) {
      errors.firstName = "Le prénom est trop long";
    }

    if (!profileForm.lastName) {
      errors.lastName = "Le nom est requis";
    } else if (profileForm.lastName.length < 2) {
      errors.lastName = "Le nom doit contenir au moins 2 caractères";
    } else if (profileForm.lastName.length > 50) {
      errors.lastName = "Le nom est trop long";
    }

    if (!profileForm.pseudo) {
      errors.pseudo = "Le pseudo est requis";
    } else if (profileForm.pseudo.length < 3) {
      errors.pseudo = "Le pseudo doit contenir au moins 3 caractères";
    } else if (!/^[a-zA-Z0-9_]+$/.test(profileForm.pseudo)) {
      errors.pseudo = "Le pseudo ne peut contenir que des lettres, chiffres et underscores";
    }

    if (profileForm.phone && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(profileForm.phone)) {
      errors.phone = "Format de téléphone invalide";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Gestion des changements de champs
  const handleInputChange = (field: keyof ProfileFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setProfileForm(prev => ({ ...prev, [field]: value }));
    
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleCategoriesChange = (selectedCategories: string[]) => {
    setProfileForm(prev => ({ ...prev, categoryKeys: selectedCategories }));
  };

  // Sauvegarder le profil
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const success = await updateProfile({
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        pseudo: profileForm.pseudo,
        phone: profileForm.phone || null,
        description: profileForm.description || null,
        categoryKeys: profileForm.categoryKeys,
      });

      if (success) {
        setSuccessMessage("Profil mis à jour avec succès !");
        refetchUser();
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
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
          <h1 className="text-3xl font-bold mb-2">Profil</h1>
          <p className="text-gray-600">Modifiez vos informations personnelles</p>
        </div>

        {/* Messages de succès/erreur */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Formulaire */}
        <div className="flex flex-col gap-4">
          <form onSubmit={handleSaveProfile}>
            <div className="flex flex-col gap-4">
              {/* Informations de base */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Prénom *</label>
                  <input
                    type="text"
                    value={profileForm.firstName}
                    onChange={handleInputChange('firstName')}
                    className={`form-input ${validationErrors.firstName ? 'error' : ''}`}
                    disabled={loading}
                    placeholder="Votre prénom"
                  />
                  {validationErrors.firstName && (
                    <span className="error-message">{validationErrors.firstName}</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Nom *</label>
                  <input
                    type="text"
                    value={profileForm.lastName}
                    onChange={handleInputChange('lastName')}
                    className={`form-input ${validationErrors.lastName ? 'error' : ''}`}
                    disabled={loading}
                    placeholder="Votre nom"
                  />
                  {validationErrors.lastName && (
                    <span className="error-message">{validationErrors.lastName}</span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Pseudo *</label>
                <input
                  type="text"
                  value={profileForm.pseudo}
                  onChange={handleInputChange('pseudo')}
                  className={`form-input ${validationErrors.pseudo ? 'error' : ''}`}
                  disabled={loading}
                  placeholder="votre_pseudo"
                />
                {validationErrors.pseudo && (
                  <span className="error-message">{validationErrors.pseudo}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Téléphone*</label>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={handleInputChange('phone')}
                  className={`form-input ${validationErrors.phone ? 'error' : ''}`}
                  disabled={loading}
                  placeholder="0601020304"
                  required
                />
                {validationErrors.phone && (
                  <span className="error-message">{validationErrors.phone}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  value={profileForm.description}
                  onChange={handleInputChange('description')}
                  className="form-input min-h-[100px] resize-none"
                  disabled={loading}
                  placeholder="Parlez-nous de vous..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Catégories d'intérêt</label>
                {loadingCategories ? (
                  <div className="text-gray-500">Chargement des catégories...</div>
                ) : (
                  <SelectorThemeTags
                    categories={categories}
                    selectedThemes={profileForm.categoryKeys}
                    onSelectionChange={handleCategoriesChange}
                  />
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
                 <span>{loading ? "Sauvegarde..." : "Sauvegarder"}</span>
               </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
} 