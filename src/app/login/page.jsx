"use client";
import MainTitle from "@/components/titles/main-title";
import Link from "next/link";
import OrSplitter from "@/components/or-splitter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faApple,
  faFacebookF,
  faGoogle,
} from "@fortawesome/free-brands-svg-icons";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Eye, EyeClosed } from "iconoir-react";
import { useAuth } from "@/contexts/auth-context";

function LoginPageContent() {
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (formData.email && formData.password) {
      const redirectPath = searchParams.get("redirect") || "/";
      login(formData, redirectPath);
    }
  };

  const isFormValid = () => {
    return formData.email !== "" && formData.password !== "";
  };

  return (
    <main>
      <section className="container items-center">
        <MainTitle title="Se connecter" />
        <p className="text-center">
          Bonjour! Veuillez entrez vos informations afin de vous identifier
        </p>
      </section>
      <section className="container items-center">
        <form onSubmit={handleFormSubmit}>
          <div className="flex flex-col gap-2">
            <label>Email</label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="gerard@example.com"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>Mot de passe</label>
            <div className="relative">
              <input
                type={`${showPassword ? "text" : "password"}`}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="****"
              />
              <div className="input-icon">
                {showPassword ? (
                  <Eye onClick={() => setShowPassword(!showPassword)} />
                ) : (
                  <EyeClosed onClick={() => setShowPassword(!showPassword)} />
                )}
              </div>
            </div>
            <button className="blue-text w-fit">Mot de passe oublié ?</button>
          </div>
          <div className="flex flex-col gap-2">
            <button
              type="submit"
              disabled={!isFormValid()}
              className="primary-form-btn"
            >
              <span>Se connecter</span>
            </button>
            <p>
              Pas encore de compte ?{" "}
              <Link
                href={`/register${
                  searchParams.get("redirect")
                    ? `?redirect=${searchParams.get("redirect")}`
                    : ""
                }`}
                className="blue-text underline"
              >
                S'inscrire
              </Link>
            </p>
          </div>
          <OrSplitter />
          <div className="flex items-center justify-center gap-6">
            <button className="rounded-form-btn">
              <FontAwesomeIcon icon={faGoogle} />
            </button>
            <button className="rounded-form-btn">
              <FontAwesomeIcon icon={faFacebookF} />
            </button>
            <button className="rounded-form-btn">
              <FontAwesomeIcon icon={faApple} />
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<></>}>
      <LoginPageContent />
    </Suspense>
  );
}
