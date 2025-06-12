"use client";
import SelectorThemeTags from "@/components/tags/selector-theme-tags/selector-theme-tags";
import StepIndicator from "@/components/common/step-indicator/step-indictator";
import Link from "next/link";
import { FormEvent, useState, useEffect } from "react";
import { useHeader } from "@/contexts/header-context";

export default function InscriptionPage() {
  const [step, setStep] = useState(1);
  const { setHideCitySelector } = useHeader();

  useEffect(() => {
    setHideCitySelector(true);

    return () => setHideCitySelector(false);
  }, [setHideCitySelector]);

  const handleNextStep = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      window.location.href = "/";
    }
  };

  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);

  const availableThemes = [
    "musique",
    "sport",
    "learning",
    "sponsorisé",
    "Cheval",
    "Danse",
    "Art",
    "Cinéma",
    "Théâtre",
    "Jeux Vidéo",
    "Cuisine",
    "Voyage",
    "Photographie",
    "Mode",
    "Technologie",
    "Nature",
    "Bien-être",
  ];

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
                type="text"
                placeholder="exemple@mail.com"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label>Pseudo*</label>
              <input className="input" type="password" placeholder="@veevent" />
            </div>
            <div className="flex flex-col gap-2">
              <label>Mot de passe*</label>
              <input className="input" type="password" placeholder="******" />
            </div>
            <div className="flex flex-col gap-2">
              <label>Confirmer le mot de passe*</label>
              <input className="input" type="password" placeholder="******" />
            </div>
          </>
        );

      case 2:
        return (
          <>
            <div className="flex flex-col gap-2">
              <label>Prénom*</label>
              <input className="input" type="text" placeholder="John" />
            </div>
            <div className="flex flex-col gap-2">
              <label>Nom*</label>
              <input className="input" type="password" placeholder="Doe" />
            </div>
            <div className="flex flex-col gap-2">
              <label>Date de naissance*</label>
              <input
                className="input"
                type="password"
                placeholder="01/01/1901"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label>Description</label>
              <textarea placeholder="Quelques mots pour vous décrire..." />
            </div>
          </>
        );
      case 3:
        return (
          <>
            <p>Sélectionnez vos centres d’intérêts:</p>
            <SelectorThemeTags
              availableThemes={availableThemes}
              selectedThemes={selectedThemes}
              onSelectionChange={setSelectedThemes}
            />
          </>
        );
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
          <button className="primary-btn" type="submit">
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
