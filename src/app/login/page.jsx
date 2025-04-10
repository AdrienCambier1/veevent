"use client";
import MainTitle from "@/components/main-title";
import Link from "next/link";
import OrSplitter from "@/components/or-splitter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faApple,
  faFacebookF,
  faGoogle,
} from "@fortawesome/free-brands-svg-icons";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeClosed } from "iconoir-react";

export default function LoginPage() {
  const router = useRouter();
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
      router.push("/");
    }
  };

  const isFormValid = () => {
    return formData.email !== "" && formData.password !== "";
  };

  return (
    <main>
      <section className="items-center">
        <MainTitle title="Se connecter" />
        <p className="text-center">
          Bonjour! Veuillez entrez vos informations afin de vous identifier
        </p>
      </section>
      <section className="container flex items-center">
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
              Se connecter
            </button>
            <p>
              Pas encore de compte ?{" "}
              <Link href="/register" className="blue-text underline">
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
