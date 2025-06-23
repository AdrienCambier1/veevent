"use client";
import SelectorThemeTags from "@/components/tags/selector-theme-tags/selector-theme-tags";
import StepIndicator from "@/components/commons/step-indicator/step-indictator";
import Link from "next/link";
import { FormEvent, useState, useEffect } from "react";
import { useHeader } from "@/contexts/header-context";
import { categoryService } from "@/services/category-service";
import { Category } from "@/types";

export default function InscriptionPage() {
  const [step, setStep] = useState(1);
  const { setHideCitySelector } = useHeader();
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  useEffect(() => {
    setHideCitySelector(true);

    return () => setHideCitySelector(false);
  }, [setHideCitySelector]);

  // Charger les catégories depuis l'API
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true);
        const categoriesData = await categoryService.getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Erreur lors du chargement des catégories:", error);
        // En cas d'erreur, utiliser les thèmes par défaut
        const fallbackCategories: Category[] = [
          {
            name: "Musique",
            key: "musique",
            description: "",
            trending: false,
            _links: { self: { href: "" } },
          },
          {
            name: "Sport",
            key: "sport",
            description: "",
            trending: false,
            _links: { self: { href: "" } },
          },
          {
            name: "Art",
            key: "art",
            description: "",
            trending: false,
            _links: { self: { href: "" } },
          },
          {
            name: "Cinéma",
            key: "cinema",
            description: "",
            trending: false,
            _links: { self: { href: "" } },
          },
          {
            name: "Théâtre",
            key: "theatre",
            description: "",
            trending: false,
            _links: { self: { href: "" } },
          },
          {
            name: "Jeux Vidéo",
            key: "jeux-video",
            description: "",
            trending: false,
            _links: { self: { href: "" } },
          },
          {
            name: "Cuisine",
            key: "cuisine",
            description: "",
            trending: false,
            _links: { self: { href: "" } },
          },
          {
            name: "Voyage",
            key: "voyage",
            description: "",
            trending: false,
            _links: { self: { href: "" } },
          },
          {
            name: "Photographie",
            key: "photographie",
            description: "",
            trending: false,
            _links: { self: { href: "" } },
          },
          {
            name: "Mode",
            key: "mode",
            description: "",
            trending: false,
            _links: { self: { href: "" } },
          },
          {
            name: "Technologie",
            key: "technologie",
            description: "",
            trending: true,
            _links: { self: { href: "" } },
          },
          {
            name: "Nature",
            key: "nature",
            description: "",
            trending: false,
            _links: { self: { href: "" } },
          },
          {
            name: "Bien-être",
            key: "bien-etre",
            description: "",
            trending: true,
            _links: { self: { href: "" } },
          },
        ];
        setCategories(fallbackCategories);
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  const handleNextStep = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Ici vous pouvez traiter les préférences sélectionnées
      console.log("Catégories sélectionnées:", selectedThemes);
      window.location.href = "/";
    }
  };

  const steps = [
    {
      name: "Login",
      value: 1,
      onClick: () => setStep(1),
      disabled: false,
    },
    {
      name: "Informations",
      value: 2,
      onClick: () => setStep(2),
      disabled: false,
    },
    {
      name: "Préférences",
      value: 3,
      onClick: () => setStep(3),
      disabled: false,
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
                className="input"
                type="email"
                placeholder="exemple@mail.com"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label>Pseudo*</label>
              <input
                className="input"
                type="text"
                placeholder="@veevent"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label>Mot de passe*</label>
              <input
                className="input"
                type="password"
                placeholder="******"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label>Confirmer le mot de passe*</label>
              <input
                className="input"
                type="password"
                placeholder="******"
                required
              />
            </div>
          </>
        );

      case 2:
        return (
          <>
            <div className="flex flex-col gap-2">
              <label>Prénom*</label>
              <input
                className="input"
                type="text"
                placeholder="John"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label>Nom*</label>
              <input className="input" type="text" placeholder="Doe" required />
            </div>
            <div className="flex flex-col gap-2">
              <label>Date de naissance*</label>
              <input className="input" type="date" required />
            </div>
            <div className="flex flex-col gap-2">
              <label>Description</label>
              <textarea
                className="input min-h-[100px] resize-vertical"
                placeholder="Quelques mots pour vous décrire..."
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
                Choisissez les catégories qui vous intéressent pour
                personnaliser votre expérience
              </p>
            </div>

            {loadingCategories ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Chargement des catégories...</p>
              </div>
            ) : (
              <SelectorThemeTags
                categories={categories}
                selectedThemes={selectedThemes}
                onSelectionChange={setSelectedThemes}
                itemsPerPage={8}
                showMoreLabel="Afficher plus de catégories"
              />
            )}

            {selectedThemes.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                <p className="text-sm text-blue-700">
                  <strong>{selectedThemes.length}</strong> catégorie
                  {selectedThemes.length > 1 ? "s" : ""} sélectionnée
                  {selectedThemes.length > 1 ? "s" : ""}
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
        <StepIndicator steps={steps} currentStep={step} />
        <form onSubmit={handleNextStep}>
          {renderStep()}
          <button
            className="primary-btn"
            type="submit"
            disabled={step === 3 && selectedThemes.length === 0}
          >
            <span>{step === 3 ? "Terminer" : "Suivant"}</span>
          </button>
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
