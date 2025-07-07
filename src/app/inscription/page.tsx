"use client";
import SelectorThemeTags from "@/components/tags/selector-theme-tags/selector-theme-tags";
import Link from "next/link";
import { FormEvent, useState, useEffect } from "react";
import { useHeader } from "@/contexts/header-context";
import { useAuth } from "@/contexts/auth-context";
import { categoryService } from "@/services/category-service";
import { Category } from "@/types";
import { usePageTitle } from "@/hooks/commons/use-page-title";
import { PAGE_TITLES } from "@/utils/page-titles";
import { PasswordStrength } from "@/components/commons/password-strength/password-strength";
import { ProgressSteps } from "@/components/commons/progress-steps/progress-steps";
import { authService } from "@/services/auth-service";

interface FormData {
  // Étape 1: Login
  email: string;
  pseudo: string;
  password: string;
  confirmPassword: string;
  
  // Étape 2: Informations personnelles
  firstName: string;
  lastName: string;
  phone: string;
  description: string;
  
  // Étape 3: Préférences
  categoryKeys: string[];
}

interface ValidationErrors {
  [key: string]: string;
}

export default function InscriptionPage() {
  const [step, setStep] = useState(1);
  const { setHideCitySelector } = useHeader();
  const { register, loading, error, clearError } = useAuth();
  
  // Gestion dynamique du titre de la page
  usePageTitle(PAGE_TITLES.auth.register);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const [formData, setFormData] = useState<FormData>({
    email: "",
    pseudo: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    description: "",
    categoryKeys: [],
  });

  useEffect(() => {
    setHideCitySelector(true);
    return () => setHideCitySelector(false);
  }, [setHideCitySelector]);

  // Nettoyer les erreurs quand l'utilisateur modifie les champs
  useEffect(() => {
    if (error) {
      // Si c'est une erreur d'email ou pseudo déjà existant, rediriger vers l'étape 1
      if (error.includes("adresse email est déjà utilisée") || error.includes("pseudo est déjà utilisé")) {
        setStep(1);
      }
    }
  }, [error]);

  // Nettoyer l'erreur quand l'utilisateur modifie l'email ou le pseudo
  useEffect(() => {
    if (error && (error.includes("adresse email est déjà utilisée") || error.includes("pseudo est déjà utilisé"))) {
      // Ne pas nettoyer automatiquement, laisser l'erreur visible
      // L'erreur sera nettoyée quand l'utilisateur modifie les champs
    }
  }, [formData.email, formData.pseudo, error, clearError]);

  // Charger les catégories depuis l'API
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true);
        const categoriesData = await categoryService.getAllCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Erreur lors du chargement des catégories:", error);
        // En cas d'erreur, utiliser les thèmes par défaut
        const fallbackCategories: Category[] = [
          { name: "Musique", key: "musique", description: "", trending: false, _links: { self: { href: "" } } },
          { name: "Sport", key: "sport", description: "", trending: false, _links: { self: { href: "" } } },
          { name: "Art", key: "art", description: "", trending: false, _links: { self: { href: "" } } },
          { name: "Cinéma", key: "cinema", description: "", trending: false, _links: { self: { href: "" } } },
          { name: "Théâtre", key: "theatre", description: "", trending: false, _links: { self: { href: "" } } },
          { name: "Jeux Vidéo", key: "jeux-video", description: "", trending: false, _links: { self: { href: "" } } },
          { name: "Cuisine", key: "cuisine", description: "", trending: false, _links: { self: { href: "" } } },
          { name: "Voyage", key: "voyage", description: "", trending: false, _links: { self: { href: "" } } },
          { name: "Photographie", key: "photographie", description: "", trending: false, _links: { self: { href: "" } } },
          { name: "Mode", key: "mode", description: "", trending: false, _links: { self: { href: "" } } },
          { name: "Technologie", key: "technologie", description: "", trending: true, _links: { self: { href: "" } } },
          { name: "Nature", key: "nature", description: "", trending: false, _links: { self: { href: "" } } },
          { name: "Bien-être", key: "bien-etre", description: "", trending: true, _links: { self: { href: "" } } },
        ];
        setCategories(fallbackCategories);
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  // Validation des champs par étape
  const validateStep = (currentStep: number): boolean => {
    const errors: ValidationErrors = {};

    switch (currentStep) {
      case 1:
        // Validation email
        if (!formData.email) {
          errors.email = "L'adresse email est requise";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          errors.email = "Format d'email invalide";
        } else if (formData.email.length > 254) {
          errors.email = "L'adresse email est trop longue";
        } else if (/[<>\"'&]/.test(formData.email)) {
          errors.email = "L'adresse email contient des caractères non autorisés";
        }

        // Validation pseudo
        if (!formData.pseudo) {
          errors.pseudo = "Le pseudo est requis";
        } else if (formData.pseudo.length < 3) {
          errors.pseudo = "Le pseudo doit contenir au moins 3 caractères";
        } else if (!/^[a-zA-Z0-9_]+$/.test(formData.pseudo)) {
          errors.pseudo = "Le pseudo ne peut contenir que des lettres (sans accent), chiffres et underscores";
        } else if (/\s/.test(formData.pseudo)) {
          errors.pseudo = "Le pseudo ne peut pas contenir d'espaces";
        } else if (/[àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ]/.test(formData.pseudo)) {
          errors.pseudo = "Le pseudo ne peut pas contenir d'accents";
        }

        // Validation mot de passe
        if (!formData.password) {
          errors.password = "Le mot de passe est requis";
        } else if (formData.password.length < 8) {
          errors.password = "Le mot de passe doit contenir au moins 8 caractères";
        } else if (formData.password.length > 128) {
          errors.password = "Le mot de passe est trop long";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
          errors.password = "Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre";
        } else if (/[<>\"'&]/.test(formData.password)) {
          errors.password = "Le mot de passe contient des caractères non autorisés";
        }

        // Validation confirmation mot de passe
        if (!formData.confirmPassword) {
          errors.confirmPassword = "La confirmation du mot de passe est requise";
        } else if (formData.password !== formData.confirmPassword) {
          errors.confirmPassword = "Les mots de passe ne correspondent pas";
        }
        break;

      case 2:
        // Validation prénom
        if (!formData.firstName) {
          errors.firstName = "Le prénom est requis";
        } else if (formData.firstName.length < 2) {
          errors.firstName = "Le prénom doit contenir au moins 2 caractères";
        } else if (formData.firstName.length > 50) {
          errors.firstName = "Le prénom est trop long";
        } else if (/[<>\"'&]/.test(formData.firstName)) {
          errors.firstName = "Le prénom contient des caractères non autorisés";
        }

        // Validation nom
        if (!formData.lastName) {
          errors.lastName = "Le nom est requis";
        } else if (formData.lastName.length < 2) {
          errors.lastName = "Le nom doit contenir au moins 2 caractères";
        } else if (formData.lastName.length > 50) {
          errors.lastName = "Le nom est trop long";
        } else if (/[<>\"'&]/.test(formData.lastName)) {
          errors.lastName = "Le nom contient des caractères non autorisés";
        }

        // Validation téléphone (optionnel mais format si fourni)
        if (formData.phone && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(formData.phone)) {
          errors.phone = "Format de téléphone invalide";
        }
        break;

      case 3:
        // Validation catégories (optionnel mais recommandé)
        if (formData.categoryKeys.length === 0) {
          errors.categories = "Sélectionnez au moins une catégorie d'intérêt";
        }
        break;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Nettoyer l'erreur du champ modifié
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    
    // Nettoyer l'erreur d'inscription si l'utilisateur modifie l'email ou le pseudo
    if (error && (field === 'email' || field === 'pseudo')) {
      clearError();
    }
  };

  const handleCategoriesChange = (selectedCategories: string[]) => {
    setFormData(prev => ({ ...prev, categoryKeys: selectedCategories }));
    
    // Nettoyer l'erreur des catégories
    if (validationErrors.categoryKeys) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.categoryKeys;
        return newErrors;
      });
    }
  };

  const handleNextStep = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateStep(step)) {
      return;
    }

    if (step < 3) {
      setStep(step + 1);
    } else {
             // Finalisation de l'inscription
             try {
        const registerData = {
          email: formData.email,
          password: formData.password,
          lastName: formData.lastName,
          firstName: formData.firstName,
          pseudo: formData.pseudo,
          phone: formData.phone || null,
          description: formData.description || null,
          imageUrl: null,
          bannerUrl: "",
          categoryKeys: formData.categoryKeys,
        };

        const success = await register(registerData, "/compte/tickets");
        
        if (success) {
          // Correction : poser le flag de profil complet si le profil l'est vraiment
          const token = authService.getStoredToken();
          if (token) {
            const isComplete = await authService.isProfileComplete(token);
            if (isComplete) {
              authService.markProfileAsComplete();
            }
          }
          // Redirection vers la page de connexion avec message de succès
          window.location.href = "/connexion?success=1";
        }
      } catch (error) {
        console.error("Erreur lors de l'inscription:", error);
      }
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const progressSteps = [
    {
      name: "Compte",
      value: 1,
      completed: step > 1,
      current: step === 1,
    },
    {
      name: "Profil",
      value: 2,
      completed: step > 2,
      current: step === 2,
    },
    {
      name: "Préférences",
      value: 3,
      completed: step > 3,
      current: step === 3,
    },
  ];

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div className="flex flex-col gap-2">
              <label>Adresse mail*</label>
              <input
                className={`input ${validationErrors.email ? 'border-red-500' : ''}`}
                type="email"
                placeholder="exemple@mail.com"
                value={formData.email}
                onChange={handleInputChange('email')}
                disabled={loading}
                required
              />
              {validationErrors.email && (
                <span className="text-red-500 text-sm">{validationErrors.email}</span>
              )}
            </div>
            
            <div className="flex flex-col gap-2">
              <label>Pseudo*</label>
              <input
                className={`input ${validationErrors.pseudo ? 'border-red-500' : ''}`}
                type="text"
                placeholder="monPseudo"
                value={formData.pseudo}
                onChange={handleInputChange('pseudo')}
                disabled={loading}
                required
              />
              {validationErrors.pseudo && (
                <span className="text-red-500 text-sm">{validationErrors.pseudo}</span>
              )}
            </div>
            
            <div className="flex flex-col gap-2">
              <label>Mot de passe*</label>
              <input
                className={`input ${validationErrors.password ? 'border-red-500' : ''}`}
                type="password"
                placeholder="******"
                value={formData.password}
                onChange={handleInputChange('password')}
                disabled={loading}
                required
              />
              <PasswordStrength password={formData.password} />
              {validationErrors.password && (
                <span className="text-red-500 text-sm">{validationErrors.password}</span>
              )}
            </div>
            
            <div className="flex flex-col gap-2">
              <label>Confirmer le mot de passe*</label>
              <input
                className={`input ${validationErrors.confirmPassword ? 'border-red-500' : ''}`}
                type="password"
                placeholder="******"
                value={formData.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
                disabled={loading}
                required
              />
              {validationErrors.confirmPassword && (
                <span className="text-red-500 text-sm">{validationErrors.confirmPassword}</span>
              )}
            </div>
          </>
        );

      case 2:
        return (
          <>
            <div className="flex flex-col gap-2">
              <label>Prénom*</label>
              <input
                className={`input ${validationErrors.firstName ? 'border-red-500' : ''}`}
                type="text"
                placeholder="John"
                value={formData.firstName}
                onChange={handleInputChange('firstName')}
                disabled={loading}
                required
              />
              {validationErrors.firstName && (
                <span className="text-red-500 text-sm">{validationErrors.firstName}</span>
              )}
            </div>
            
            <div className="flex flex-col gap-2">
              <label>Nom*</label>
              <input
                className={`input ${validationErrors.lastName ? 'border-red-500' : ''}`}
                type="text"
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleInputChange('lastName')}
                disabled={loading}
                required
              />
              {validationErrors.lastName && (
                <span className="text-red-500 text-sm">{validationErrors.lastName}</span>
              )}
            </div>
            
            <div className="flex flex-col gap-2">
              <label>Téléphone*</label>
              <input
                className={`input ${validationErrors.phone ? 'border-red-500' : ''}`}
                type="tel"
                placeholder="0601020304"
                value={formData.phone}
                onChange={handleInputChange('phone')}
                disabled={loading}
                required
              />
              {validationErrors.phone && (
                <span className="text-red-500 text-sm">{validationErrors.phone}</span>
              )}
            </div>
            
            <div className="flex flex-col gap-2">
              <label>Description</label>
              <textarea
                className="input min-h-[100px] resize-vertical"
                placeholder="Quelques mots pour vous décrire..."
                value={formData.description}
                onChange={handleInputChange('description')}
                disabled={loading}
              />
            </div>
          </>
        );

      case 3:
        return (
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Sélectionnez vos centres d'intérêts :
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Choisissez les catégories qui vous intéressent pour personnaliser votre expérience
              </p>
            </div>

            {loadingCategories ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Chargement des catégories...</p>
              </div>
            ) : (
              <SelectorThemeTags
                categories={categories}
                selectedThemes={formData.categoryKeys}
                onSelectionChange={handleCategoriesChange}
                itemsPerPage={8}
                showMoreLabel="Afficher plus de catégories"
              />
            )}

            {validationErrors.categoryKeys && (
              <span className="text-red-500 text-sm">{validationErrors.categoryKeys}</span>
            )}

            {formData.categoryKeys.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                <p className="text-sm text-primary-600">
                  <strong>{formData.categoryKeys.length}</strong> catégorie
                  {formData.categoryKeys.length > 1 ? "s" : ""} sélectionnée
                </p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <main>
      <section className="wrapper flex items-center">
        <p className="font-semibold text-base">
          Bienvenue sur{" "}
          <span className="text-[var(--primary-600)]">veevent</span>
        </p>
        
        <ProgressSteps steps={progressSteps} className="mb-6" />
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm w-full mb-4">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-medium">Erreur lors de l'inscription</p>
                <p className="mt-1">{error}</p>
                {error.includes("adresse email est déjà utilisée") && (
                  <p className="mt-2 text-sm">
                    <a href="/connexion" className="text-blue-600 hover:underline">
                      Cliquez ici pour vous connecter avec votre compte existant
                    </a>
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={handleNextStep} className="w-full">
          {renderStep()}
          
          <div className="flex gap-4 mt-6">
            {step > 1 && (
              <button
                type="button"
                onClick={handlePreviousStep}
                className="secondary-btn flex-1"
                disabled={loading}
              >
                Précédent
              </button>
            )}
            
            <button
              className="primary-btn flex-1"
              type="submit"
              disabled={loading || (step === 3 && formData.categoryKeys.length === 0)}
            >
              <span>
                {loading 
                  ? "Inscription en cours..." 
                  : step === 3 
                    ? "Créer mon compte" 
                    : "Suivant"
                }
              </span>
            </button>
          </div>
        </form>
        
        <p className="font-bold">
          Vous avez déjà un compte ?{" "}
          <Link className="text-primary-600" href="/connexion">
            Connectez-vous
          </Link>
        </p>
      </section>
    </main>
  );
}
