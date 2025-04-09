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
      if (window.innerWidth >= 768 && isOpen) {
        setIsOpen(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  return (
    <>
      <header>
        <Link href="/" className="logo">
          v<span>ee</span>vent
        </Link>
        <button
          className="md:hidden blue-rounded-btn"
          onClick={() => setIsOpen(!isOpen)}
        >
          Menu <MenuScale className="hamburger-menu" />
        </button>
        <nav className="hidden md:flex items-center gap-8">
          <Link href="">Activités</Link>
          <Link href="">Villes</Link>
        </nav>
        <div className="hidden md:flex items-center gap-4">
          <button className="secondary-btn">
            S'inscrire
            <NavArrowRight />
          </button>
          <button className="primary-btn">
            Se connecter <NavArrowRight />
          </button>
        </div>
      </header>
      <MenuModal isOpen={isOpen} setIsOpen={() => setIsOpen()} />
    </>
  );
}
