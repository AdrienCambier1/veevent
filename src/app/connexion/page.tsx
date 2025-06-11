"use client";
import Link from "next/link";
import { useState, Suspense } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useSearchParams } from "next/navigation";

function ConnexionPageContent() {
  const { login, loading, isAuthenticated } = useAuth();
  const searchParams = useSearchParams();

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (credentials.email && credentials.password) {
      const redirectPath = searchParams?.get("redirect") || "/";
      login(credentials, redirectPath);
    }
  };

  const handleInputChange =
    (field: "email" | "password") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setCredentials((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  if (isAuthenticated) {
    return null;
  }

  return (
    <main>
      <section className="wrapper flex items-center">
        <p className="font-semibold text-base">Connexion</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="flex flex-col gap-2">
            <label>Adresse mail ou pseudo</label>
            <input
              className="input"
              type="email"
              placeholder="exemple@mail.com"
              value={credentials.email}
              onChange={handleInputChange("email")}
              disabled={loading}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label>Mot de passe</label>
            <input
              className="input"
              type="password"
              placeholder="******"
              value={credentials.password}
              onChange={handleInputChange("password")}
              disabled={loading}
            />
            <Link href="/mot-de-passe-oublie" className="text-primary-600">
              Mot de passe oublié ?
            </Link>
          </div>

          <button
            type="submit"
            className="primary-btn w-full"
            disabled={loading || !credentials.email || !credentials.password}
          >
            <span>{loading ? "Connexion en cours..." : "Se connecter"}</span>
          </button>

          <button
            type="button"
            className="w-full border p-3 rounded-full border-black font-bold mt-4"
            disabled={loading}
          >
            Sign in with apple
          </button>
        </form>

        <p className="font-bold">
          Pas encore de compte ?{" "}
          <Link className="text-primary-600" href="/inscription">
            Inscrivez-vous
          </Link>
        </p>
      </section>
    </main>
  );
}

export default function ConnexionPage() {
  return (
    <Suspense fallback={<></>}>
      <ConnexionPageContent />
    </Suspense>
  );
}
