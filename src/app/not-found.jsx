import MainTitle from "@/components/titles/main-title";
import Link from "next/link";
import { ArrowLeft } from "iconoir-react";
import Image from "next/image";
import notFound from "@/assets/images/not-found.png";

export default function NotFound() {
  return (
    <main>
      <section className="container items-center">
        <MainTitle title="Page 404" />
        <p className="text-center">Oops! Cette page n'existe pas.</p>
        <Link href="/" className="primary-btn">
          <ArrowLeft />
          <span>Retour à l'accueil</span>
        </Link>
        <Image src={notFound} alt="404 Not Found" />
      </section>
    </main>
  );
}
