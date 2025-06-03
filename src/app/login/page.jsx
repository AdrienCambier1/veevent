import Link from "next/link";

export default function LoginPage() {
  return (
    <main>
      <section className="wrapper flex items-center">
        <p className="font-semibold text-base">Connexion</p>
        <form>
          <div className="flex flex-col gap-2">
            <label>Connexion mail</label>
            <input
              className="input"
              type="text"
              placeholder="exemple@mail.com"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>Mot de passe</label>
            <input className="input" type="password" placeholder="******" />
            <Link href="/register" className="">
              Mot de passe oublié ?
            </Link>
          </div>
          <button className="primary-btn">
            <span>Se connecter</span>
          </button>
          <button className="w-full border p-3 rounded-full border-black font-bold">
            Sign in with apple
          </button>
        </form>
        <p className="font-bold">
          Pas encore de compte ?{" "}
          <Link className="text-[var(--primary-600)]" href="/register">
            Inscrivez-vous
          </Link>
        </p>
      </section>
    </main>
  );
}
