import MainTitle from "@/components/main-title";
import Link from "next/link";
import OrSplitter from "@/components/or-splitter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faApple,
  faFacebookF,
  faGoogle,
} from "@fortawesome/free-brands-svg-icons";

export default function LoginPage() {
  return (
    <main>
      <section className="items-center">
        <MainTitle title="Se connecter" />
        <p className="text-center">
          Bonjour! Veuillez entrez vos informations afin de vous identifier
        </p>
      </section>
      <section className="container flex items-center">
        <form>
          <div className="flex flex-col gap-2">
            <label>Email</label>
            <input type="email" placeholder="gerard@example.com" required />
          </div>
          <div className="flex flex-col gap-2">
            <label>Mot de passe</label>
            <input type="password" placeholder="****" required />
            <button className="blue-text w-fit">Mot de passe oublié ?</button>
          </div>
          <div className="flex flex-col gap-2">
            <button type="submit" className="primary-form-btn">
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
