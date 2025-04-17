"use client";
import Link from "next/link";
import { ArrowUpRight, Instagram, Facebook, X } from "iconoir-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer>
      <div className="container flex flex-col gap-12">
        <div className="bg-[var(--primary-blue)] w-full h-[2px]" />
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row gap-8 justify-between">
            <Link
              href="/"
              className="logo"
              onClick={(e) => {
                if (window.location.pathname === "/") {
                  e.preventDefault();
                  scrollToTop();
                }
              }}
            >
              v<span>ee</span>vent
            </Link>
            <div className="flex items-center gap-8">
              <nav>
                <Link href="">
                  <Instagram />
                </Link>
                <Link href="">
                  <Facebook />
                </Link>
                <Link href="">
                  <X />
                </Link>
              </nav>
              <Link href="/events/create" className="primary-btn">
                <span>Publie ton événement</span>
                <ArrowUpRight />
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <h4>Ressources</h4>
              <nav className="flex-wrap">
                <Link href="/activities/events">Rechercher un événement</Link>
                <Link href="/activities/organisers">
                  Rechercher un organisateur
                </Link>
                <Link href="/cities">Les villes événementielles</Link>
                <Link href="/saved/inscriptions">
                  Consulter mes inscriptions
                </Link>
                <Link href="/saved/marked">Consulter mes favoris</Link>
                <Link href="/subscriptions/events">
                  Evennements des abonnements
                </Link>
                <Link href="/subscriptions/profils">
                  Profils des abonnements
                </Link>
              </nav>
            </div>
            <div className="flex flex-col gap-4">
              <h4>Gérer son compte</h4>
              <nav className="flex flex-wrap gap-4 ">
                <Link href="/account/settings">Paramètres du compte</Link>
                <Link href="/account/profil/events">Mes evenements</Link>
                <Link href="/account/profil/participations">
                  Evenements participés
                </Link>
                <Link href="/account/profil/reviews">Avis</Link>
              </nav>
            </div>
          </div>
        </div>
        <p className="border-t border-[var(--secondary-border-col)] pt-3">
          © 2025 Veevent
        </p>
      </div>
    </footer>
  );
}
