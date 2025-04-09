import Link from "next/link";
import { Menu, NavArrowRight } from "iconoir-react";
import { MenuScale } from "iconoir-react";

export default function Header() {
  return (
    <header>
      <Link href="/" className="logo">
        v<span>ee</span>vent
      </Link>
      <button className="md:hidden blue-rounded-btn">
        Menu <MenuScale className="md:hidden hamburger-menu" />
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
  );
}
