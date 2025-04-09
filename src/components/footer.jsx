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
        <div className="flex flex-col lg:flex-row gap-8 justify-between">
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
          <div className="flex flex-row gap-12">
            <nav className="flex flex-col gap-4 ">
              <h4>Ressources</h4>
              <Link href="/activities/events">Evenements</Link>
              <Link href="/activities/organisers">Organisateurs</Link>
              <Link href="/cities">Villes</Link>
              <Link href="/saved/inscriptions">Mes inscriptions</Link>
              <Link href="/saved/marked">Marqués</Link>
              <Link href="/subscriptions">Abonnements</Link>
            </nav>
            <nav className="flex flex-col gap-4 ">
              <h4>Gérer son compte</h4>
              <Link href="">Informations du compte</Link>
              <Link href="">Mes evenements</Link>
              <Link href="">Evenements participés</Link>
              <Link href="">Avis</Link>
            </nav>
          </div>
          <div className="flex flex-col lg:flex-row gap-8">
            <nav className="flex gap-4">
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
            <Link href="" className="primary-btn">
              Publie ton événement
              <ArrowUpRight />
            </Link>
          </div>
        </div>
        <p className="border-t border-[var(--secondary-border-col)] pt-3">
          © 2025 Veevent
        </p>
      </div>
    </footer>
  );
}
