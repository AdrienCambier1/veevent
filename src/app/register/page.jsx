"use client";
import { useState, useEffect } from "react";
import MainTitle from "@/components/main-title";
import Link from "next/link";
import OrSplitter from "@/components/or-splitter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faApple,
  faFacebookF,
  faGoogle,
} from "@fortawesome/free-brands-svg-icons";
import { ArrowLeft } from "iconoir-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    birthDate: "",
    interests: [],
  });

  const [step, setStep] = useState(1);
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecial: false,
  });

  const isPasswordValid =
    Object.values(passwordStrength).filter(Boolean).length >= 4;

  const isStepValid = () => {
    switch (step) {
      case 1:
        return (
          formData.email !== "" &&
          formData.username !== "" &&
          formData.password !== "" &&
          validateEmail(formData.email) &&
          isPasswordValid
        );
      case 2:
        return (
          formData.firstName !== "" &&
          formData.lastName !== "" &&
          formData.birthDate !== ""
        );
      case 3:
      default:
        return false;
    }
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  useEffect(() => {
    const { password } = formData;
    setPasswordStrength({
      length: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNextStep = () => {
    if (isStepValid()) {
      setStep(step + 1);
    }
  };

  const isSubmitStepOneDisabled =
    !formData.email ||
    !formData.username ||
    !formData.password ||
    !isPasswordValid;

  const handleStepOne = (e) => {
    e.preventDefault();

    if (!isSubmitStepOneDisabled) setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Inscription avec:", formData);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div className="flex flex-col gap-2">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="gerard@example.com"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label>Identifiant</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="gerard_du_06"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label>Mot de passe</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="****"
              />

              {formData.password && (
                <p
                  className={
                    isPasswordValid
                      ? "text-[var(--primary-green)]"
                      : "text-[var(--primary-red)]"
                  }
                >
                  {isPasswordValid
                    ? "Mot de passe valide"
                    : "Utilisez des majuscules, chiffres et caractères spéciaux."}
                </p>
              )}
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div className="flex gap-4">
              <div className="flex flex-col gap-2 w-full">
                <label>Nom</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Dupont"
                />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <label>Prénom</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Gérard"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label>Date de naissance</label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
              />
            </div>
          </>
        );
      case 3:
        return (
          <>
            <p className="text-center">
              Une fois validé, vous pourrrez modifier vos préférences dans votre
              profil
            </p>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <main>
      <section className="items-center">
        <MainTitle title="S'inscrire" />
        <p className="text-center">
          Créez votre compte en quelques étapes simples
        </p>
      </section>
      <section className="container flex items-center">
        <form onSubmit={(e) => e.preventDefault()}>
          {renderStep()}

          {step < 3 ? (
            step === 1 ? (
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={!isStepValid()}
                  className="primary-form-btn"
                >
                  Continuer
                </button>
                <p className="text-center w-fit">
                  Déjà un compte ?{" "}
                  <Link href="/login" className="blue-text underline">
                    Se connecter
                  </Link>
                </p>
              </div>
            ) : (
              <button
                type="submit"
                onClick={handleNextStep}
                disabled={!isStepValid()}
                className="primary-form-btn"
              >
                Continuer
              </button>
            )
          ) : (
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={!isStepValid()}
              className="primary-form-btn"
            >
              S'inscrire
            </button>
          )}

          {step > 1 && (
            <div className="w-full flex justify-center">
              <button
                type="button"
                onClick={handlePreviousStep}
                className="back-form-btn"
              >
                <ArrowLeft />
              </button>
            </div>
          )}

          {step === 1 && (
            <>
              <OrSplitter />
              <div className="flex items-center justify-center gap-6">
                <button type="button" className="rounded-form-btn">
                  <FontAwesomeIcon icon={faGoogle} />
                </button>
                <button type="button" className="rounded-form-btn">
                  <FontAwesomeIcon icon={faFacebookF} />
                </button>
                <button type="button" className="rounded-form-btn">
                  <FontAwesomeIcon icon={faApple} />
                </button>
              </div>
            </>
          )}
        </form>
      </section>
    </main>
  );
}
