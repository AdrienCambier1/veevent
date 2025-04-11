"use client";
import Link from "next/link";
import { NavArrowRight, MenuScale, LogOut } from "iconoir-react";
import MenuModal from "./modals/menu-modal";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import ProfilBtn from "./buttons/profil-btn";
import CityBtn from "./buttons/city-btn";

export default function Header() {
  const { isAuthenticated } = useAuth();
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
        <div className="container flex gap-8 justify-between items-center h-16">
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
            <span>Menu</span>
            <MenuScale className="hamburger-menu" />
          </button>
          <nav>
            <Link href="/activities/events">Activités</Link>
            <Link href="/cities">Villes</Link>
            <Link href="/saved/inscriptions">Enregistrés</Link>
            <Link href="/subscriptions/events">Abonnements</Link>
          </nav>
          <div className="hidden lg:flex items-center gap-4">
            {!isAuthenticated ? (
              <>
                <Link href="/register" className="secondary-btn">
                  <span>S'inscrire</span>
                  <NavArrowRight />
                </Link>
                <Link href="/login" className="primary-btn">
                  <span>Se connecter</span>
                  <NavArrowRight />
                </Link>
              </>
            ) : (
              <>
                <CityBtn />
                <ProfilBtn />
              </>
            )}
          </div>
        </div>
      </header>
      <MenuModal isOpen={isOpen} setIsOpen={() => setIsOpen()} />
    </>
  );
}
