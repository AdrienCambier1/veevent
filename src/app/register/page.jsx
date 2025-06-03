"use client";
import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const [step, setStep] = useState(1);

  const handleNextStep = (e) => {
    e.preventDefault();
    setStep(step + 1);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={handleNextStep}>
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
            <button className="primary-btn" type="submit">
              <span>Suivant</span>
            </button>
          </form>
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
    }
  };

  return (
    <main>
      <section className="wrapper flex items-center">
        <p className="font-semibold text-base">
          Bienvenue sur{" "}
          <span className="text-[var(--primary-600)]">veevent</span>
        </p>
        <form onSubmit={handleNextStep}>
          {renderStep()}
          <button className="primary-btn" type="submit">
            <span>Suivant</span>
          </button>
        </form>
        <p className="font-bold">
          Vous avez déjà un compte ?{" "}
          <Link className="text-[var(--primary-600)]" href="/register">
            Connectez-vous
          </Link>
        </p>
      </section>
    </main>
  );
}
