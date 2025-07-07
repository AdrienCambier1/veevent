"use client";
import SelectorThemeTags from "@/components/tags/selector-theme-tags/selector-theme-tags";
import { FormEvent, useState, useEffect, Suspense } from "react";
import { useHeader } from "@/contexts/header-context";
import { useAuth } from "@/contexts/auth-context";
import { categoryService } from "@/services/category-service";
import { authService } from "@/services/auth-service";
import { Category } from "@/types";
import { ProgressSteps } from "@/components/commons/progress-steps/progress-steps";
import { useRouter, useSearchParams } from "next/navigation";

interface FormData {
  // Étape 1: Informations personnelles
  firstName: string;
  lastName: string;
  pseudo: string;
  phone: string;
  description: string;
  
  // Étape 2: Préférences
  categoryKeys: string[];
}

interface ValidationErrors {
  [key: string]: string;
}

// Composant wrapper pour gérer useSearchParams avec Suspense
function CompleteProfileContent() {
  const [step, setStep] = useState(1);
  const { setHideCitySelector } = useHeader();
  const { token, loading, error, clearError, updateProfile } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    pseudo: "",
    phone: "",
    description: "",
    categoryKeys: [],
  });

  useEffect(() => {
    setHideCitySelector(true);
    return () => {
      setHideCitySelector(false);
    };
  }, [setHideCitySelector]);

  // Vérifier si l'utilisateur est authentifié et charger ses données
  useEffect(() => {
    console.log("🔍 CompleteProfile - Loading:", loading, "Token:", !!token);
    
    // Attendre que le contexte d'authentification soit complètement initialisé
    if (loading) {
      return;
    }

    if (!token) {
      console.log("🔍 CompleteProfile - Pas de token, redirection vers connexion");
      router.push("/connexion");
      return;
    }

    // Vérifier si le profil est déjà marqué comme complet
    const isMarkedComplete = authService.isProfileMarkedAsComplete();
    console.log("🔍 CompleteProfile - Profil marqué comme complet:", isMarkedComplete);
    
    if (isMarkedComplete) {
      console.log("🔍 CompleteProfile - Profil déjà complet, redirection vers tickets");
      router.push("/compte/tickets");
      return;
    }

    // Charger les données utilisateur existantes pour pré-remplir le formulaire
    const loadUserData = async () => {
      try {
        const userData = await authService.fetchUserData(token);
        
        if (userData) {
          // Vérifier si le profil est déjà complet côté serveur
          const isProfileComplete = await authService.isProfileComplete(token);
          
          // Si le profil est déjà complet côté serveur, le marquer comme complet et rediriger
          if (isProfileComplete) {
            authService.markProfileAsComplete();
            router.push("/compte/tickets");
            return;
          }
          
          setFormData(prev => ({
            ...prev,
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            pseudo: "", // Ne pas pré-remplir le pseudo OAuth temporaire
            phone: userData.phone || "",
            description: userData.description || "",
            categoryKeys: userData.categories?.map(cat => cat.key) || [],
          }));
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données utilisateur:", error);
      }
    };

    loadUserData();
  }, [token, loading, router]);

  // Nettoyer les erreurs quand l'utilisateur modifie les champs
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [formData, error, clearError]);

  // Empêcher l'utilisateur de quitter la page sans avoir complété son profil
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Vérifier si le formulaire a été soumis avec succès
      if (!authService.isProfileMarkedAsComplete()) {
        e.preventDefault();
        e.returnValue = "Vous devez compléter votre profil avant de quitter cette page.";
        return "Vous devez compléter votre profil avant de quitter cette page.";
      }
    };

    const handlePopState = (e: PopStateEvent) => {
      // Empêcher la navigation arrière si le profil n'est pas complet
      if (!authService.isProfileMarkedAsComplete()) {
        e.preventDefault();
        window.history.pushState(null, "", window.location.pathname);
        alert("Vous devez compléter votre profil avant de quitter cette page.");
      }
    };

    // Ajouter les event listeners
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);
    
    // Empêcher la navigation arrière initiale
    window.history.pushState(null, "", window.location.pathname);

    // Nettoyer les event listeners
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

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

        // Validation pseudo
        if (!formData.pseudo) {
          errors.pseudo = "Le pseudo est requis";
        } else if (formData.pseudo.length < 3) {
          errors.pseudo = "Le pseudo doit contenir au moins 3 caractères";
        } else if (formData.pseudo.length > 30) {
          errors.pseudo = "Le pseudo est trop long";
        } else if (!/^[a-zA-Z0-9_]+$/.test(formData.pseudo)) {
          errors.pseudo = "Le pseudo ne peut contenir que des lettres (sans accent), chiffres et underscores";
        } else if (/\s/.test(formData.pseudo)) {
          errors.pseudo = "Le pseudo ne peut pas contenir d'espaces";
        } else if (/[àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ]/.test(formData.pseudo)) {
          errors.pseudo = "Le pseudo ne peut pas contenir d'accents";
        }

        // Validation téléphone (requis pour un profil complet)
        if (!formData.phone) {
          errors.phone = "Le téléphone est requis pour compléter votre profil";
        } else if (!/^[\+]?[0-9\s\-\(\)]{10,20}$/.test(formData.phone)) {
          errors.phone = "Format de téléphone invalide";
        } else if (/[<>\"'&]/.test(formData.phone)) {
          errors.phone = "Le téléphone contient des caractères non autorisés";
        }

        // Validation description (optionnelle mais avec limites)
        if (formData.description && formData.description.length > 500) {
          errors.description = "La description ne peut pas dépasser 500 caractères";
        } else if (formData.description && /[<>\"'&]/.test(formData.description)) {
          errors.description = "La description contient des caractères non autorisés";
        }
        break;

      case 2:
        // Validation catégories (requis pour un profil complet)
        if (formData.categoryKeys.length === 0) {
          errors.categoryKeys = "Sélectionnez au moins une catégorie d'intérêt pour personnaliser votre expérience";
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

    if (step < 2) {
      setStep(step + 1);
    } else {
      // Finalisation de la complétion du profil
      try {
        setSubmitting(true);
        
        const updateData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          pseudo: formData.pseudo,
          phone: formData.phone || null,
          description: formData.description || null,
          categoryKeys: formData.categoryKeys,
        };

        const success = await updateUserProfile(updateData);
        console.log("🔍 CompleteProfile - Mise à jour profil réussie:", success);
        
        if (success) {
          // Marquer le profil comme complet après mise à jour réussie
          authService.markProfileAsComplete();
          console.log("🔍 CompleteProfile - Profil marqué comme complet");
          
          // Vérifier s'il y a une redirection demandée
          const redirectParam = searchParams?.get("redirect");
          const redirectUrl = redirectParam || "/compte/tickets";
          
          console.log("🔍 CompleteProfile - Redirection vers:", redirectUrl);
          
          // Utiliser setTimeout pour éviter les conflits avec les états asynchrones
          setTimeout(() => {
            router.push(redirectUrl);
          }, 100);
        } else {
          console.error("🔍 CompleteProfile - Échec de la mise à jour du profil");
        }
      } catch (error) {
        console.error("Erreur lors de la mise à jour du profil:", error);
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const updateUserProfile = async (data: any): Promise<boolean> => {
    try {
      console.log("🔍 CompleteProfile - Début mise à jour profil avec données:", data);
      const result = await updateProfile(data);
      console.log("🔍 CompleteProfile - Résultat mise à jour profil:", result);
      return result;
    } catch (error) {
      console.error("Erreur mise à jour profil:", error);
      return false;
    }
  };

  const progressSteps = [
    {
      name: "Profil",
      value: 1,
      completed: step > 1,
      current: step === 1,
    },
    {
      name: "Préférences",
      value: 2,
      completed: step > 2,
      current: step === 2,
    },
  ];

  const renderStep = () => {
    switch (step) {
      case 1:
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
                disabled={loading || submitting}
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
                disabled={loading || submitting}
                required
              />
              {validationErrors.lastName && (
                <span className="text-red-500 text-sm">{validationErrors.lastName}</span>
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
                disabled={loading || submitting}
                required
              />
              {validationErrors.pseudo && (
                <span className="text-red-500 text-sm">{validationErrors.pseudo}</span>
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
                disabled={loading || submitting}
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
                disabled={loading || submitting}
              />
            </div>
          </>
        );

      case 2:
        return (
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Sélectionnez vos centres d'intérêts* :
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Ces informations nous permettent de vous proposer des événements qui correspondent à vos goûts
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

  // État pour vérifier si JavaScript est activé
  const [jsEnabled, setJsEnabled] = useState(false);
  const [isDirectAccess, setIsDirectAccess] = useState(false);

  useEffect(() => {
    setJsEnabled(true);
    
    // Vérifier si c'est un accès direct (pas via redirection OAuth)
    const referrer = document.referrer;
    const isFromOAuth = referrer.includes('/auth/callback') || referrer.includes('/connexion');
    setIsDirectAccess(!isFromOAuth && referrer !== '');
    
    console.log("🔍 CompleteProfile - Accès direct:", !isFromOAuth, "Referrer:", referrer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // Afficher un message si JavaScript est désactivé
  if (!jsEnabled) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-red-700 mb-2">
              JavaScript requis
            </h2>
            <p className="text-red-600 text-sm">
              Cette page nécessite JavaScript pour fonctionner correctement. 
              Veuillez activer JavaScript dans votre navigateur pour compléter votre profil.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main>
      <section className="wrapper flex items-center">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">
            Complétez votre profil sur{" "}
            <span className="text-[var(--primary-600)]">veevent</span>
          </h1>
          <p className="text-gray-600 mb-4">
            Pour une expérience personnalisée, nous avons besoin de quelques informations supplémentaires
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 max-w-md mx-auto">
            <p className="text-sm text-blue-700">
              <strong>Important :</strong> Vous devez compléter votre profil avant de pouvoir accéder aux fonctionnalités de votre compte.
            </p>
          </div>
          
          {isDirectAccess && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 max-w-md mx-auto mt-4">
              <p className="text-sm text-yellow-700">
                <strong>Attention :</strong> Cette page est normalement accessible uniquement après une connexion OAuth. 
                Si vous êtes arrivé ici par erreur, veuillez vous connecter via OAuth.
              </p>
            </div>
          )}
        </div>
        
        <ProgressSteps steps={progressSteps} className="mb-6" />
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm w-full">
            {error}
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
                disabled={loading || submitting}
              >
                Précédent
              </button>
            )}
            
            <button
              className="primary-btn flex-1"
              type="submit"
              disabled={
                loading || 
                submitting || 
                (step === 1 && (!formData.firstName || !formData.lastName || !formData.pseudo || !formData.phone)) ||
                (step === 2 && formData.categoryKeys.length === 0)
              }
              onClick={() => {
                // Debug: vérifier l'état du bouton
                const isDisabled = loading || 
                  submitting || 
                  (step === 1 && (!formData.firstName || !formData.lastName || !formData.pseudo || !formData.phone)) ||
                  (step === 2 && formData.categoryKeys.length === 0);
              }}
            >
              <span>
                {submitting 
                  ? "Mise à jour en cours..." 
                  : step === 2 
                    ? "Compléter mon profil" 
                    : "Suivant"
                }
              </span>
            </button>
          </div>
        </form>
        
        <p className="text-center text-gray-600 mt-6">
          Ces informations nous aident à vous proposer une expérience personnalisée.
          Vous pourrez les modifier à tout moment dans les paramètres
        </p>
      </section>
    </main>
  );
}

export default function CompleteProfilePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CompleteProfileContent />
    </Suspense>
  );
} 