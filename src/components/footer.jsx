import Link from "next/link";
import { ArrowUpRight, Instagram, Facebook, X } from "iconoir-react";

export default function Footer() {
  return (
    <footer>
      <div className="flex flex-col xl:flex-row gap-8 justify-between xl:items-center">
        <Link href="/" className="logo">
          v<span>ee</span>vent
        </Link>
        <nav className="flex flex-col sm:flex-row sm:items-center gap-8">
          <Link href="">Activités</Link>
          <Link href="">Villes</Link>
          <Link href="">contact.support@veevent.com</Link>
        </nav>
        <div className="flex flex-col sm:flex-row gap-8">
          <nav className="flex items-center gap-4">
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
    </footer>
  );
}
