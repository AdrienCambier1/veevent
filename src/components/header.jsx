"use client";
import Link from "next/link";
import { NavArrowRight } from "iconoir-react";
import { MenuScale } from "iconoir-react";
import MenuModal from "./menu-modal";
import { useState, useEffect } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isOpen) {
        setIsOpen(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <header>
        <div className="container flex justify-between items-center h-16">
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
          <button
            className="lg:hidden blue-rounded-btn"
            onClick={() => setIsOpen(!isOpen)}
          >
            Menu <MenuScale className="hamburger-menu" />
          </button>
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/activities/events">Activités</Link>
            <Link href="/cities">Villes</Link>
            <Link href="/saved/inscriptions">Enregistrés</Link>
            <Link href="/subscriptions">Abonnements</Link>
          </nav>
          <div className="hidden lg:flex items-center gap-4">
            <button className="secondary-btn">
              S'inscrire
              <NavArrowRight />
            </button>
            <button className="primary-btn">
              Se connecter <NavArrowRight />
            </button>
          </div>
        </div>
      </header>
      <MenuModal isOpen={isOpen} setIsOpen={() => setIsOpen()} />
    </>
  );
}
