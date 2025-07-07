"use client";
import Link from "next/link";
import { useState, Suspense, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useSearchParams } from "next/navigation";
import { useHeader } from "@/contexts/header-context";

function ConnexionPageContent() {
  const { login, loading, error, clearError } = useAuth();
  const { setHideCitySelector } = useHeader();
  const searchParams = useSearchParams();
  const redirectUri = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/auth/callback`;
  const backendGoogleLoginUrl = `${
    process.env.NEXT_PUBLIC_BACK_URL
  }/oauth2/authorize/google?redirect_uri=${encodeURIComponent(redirectUri)}`;

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  // Récupérer le message d'erreur depuis les paramètres d'URL
  const urlError = searchParams?.get("error");
  const errorMessage = urlError === "banned" ? "Votre compte a été suspendu. Contactez l'administrateur pour plus d'informations." : null;
  const showSuccess = searchParams?.get("success") === "1";

  useEffect(() => {
    setHideCitySelector(true);
    return () => setHideCitySelector(false);
  }, [setHideCitySelector]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (credentials.email && credentials.password) {
      const redirectUrl = searchParams?.get("redirect") || "/compte";
      await login(credentials, redirectUrl);
    }
  };

  const handleInputChange =
    (field: "email" | "password") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setCredentials((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
      if (error) clearError();
    };

  return (
    <main>
      <section className="wrapper flex items-center">
        {showSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm w-full mb-4">
            Votre compte a bien été créé ! Vous pouvez maintenant vous connecter.
          </div>
        )}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">
            Connexion à votre compte{" "}
            <span className="text-[var(--primary-600)]">veevent</span>
          </h1>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="flex flex-col gap-2">
            <label>Adresse mail</label>
            <input
              className="input"
              type="email"
              placeholder="exemple@mail.com"
              value={credentials.email}
              onChange={handleInputChange("email")}
              disabled={loading}
              required
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
              required
            />
            <Link href="/mot-de-passe-oublie" className="text-primary-600">
              Mot de passe oublié ?
            </Link>
          </div>

          {(error || errorMessage) && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {errorMessage || error}
            </div>
          )}

          <button
            type="submit"
            className="primary-btn w-full"
            disabled={loading || !credentials.email || !credentials.password}
          >
            <span>{loading ? "Connexion en cours..." : "Se connecter"}</span>
          </button>

          <a href={backendGoogleLoginUrl}>
            <div className="secondary-btn w-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-4 h-4 mr-2"
              >
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
              Connexion avec Google
            </div>
          </a>
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
