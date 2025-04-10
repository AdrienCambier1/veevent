import { Xmark, User } from "iconoir-react";
import Link from "next/link";
import ModalBg from "./modal-bg";
import ReactFocusLock from "react-focus-lock";
import { useAuth } from "@/contexts/auth-context";
import ProfilBtn from "../buttons/profil-btn";
import CityBtn from "../buttons/city-btn";

export default function MenuModal({ isOpen, setIsOpen }) {
  const { isAuthenticated } = useAuth();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <ReactFocusLock
        className={`${
          isOpen ? "visible -translate-x-0" : "invisible -translate-x-full"
        } menu-modal lg:hidden`}
      >
        <div className="flex flex-col gap-8">
          <div className="w-full flex gap-8 justify-between items-center h-16">
            <Link
              href="/"
              className="logo"
              onClick={(e) => {
                if (window.location.pathname === "/") {
                  e.preventDefault();
                  scrollToTop();
                  setIsOpen();
                }
              }}
            >
              v<span>ee</span>vent
            </Link>
            <button className="blue-rounded-btn" onClick={setIsOpen}>
              <span>Menu</span>
              <Xmark className="hamburger-menu" />
            </button>
          </div>
          <nav className="flex flex-col gap-4">
            <h4>Pages</h4>
            <Link href="/activities/events" onClick={setIsOpen}>
              Rechercher un événement
            </Link>
            <Link href="/activities/organisers" onClick={setIsOpen}>
              Rechercher un organisateur
            </Link>
            <Link href="/cities" onClick={setIsOpen}>
              Les villes événementielles
            </Link>
            <Link href="/saved/inscriptions" onClick={setIsOpen}>
              Consulter mes inscriptions
            </Link>
            <Link href="/saved/marked" onClick={setIsOpen}>
              Consulter mes favoris
            </Link>
            <Link href="/subscriptions/events" onClick={setIsOpen}>
              Evennements des abonnements
            </Link>
            <Link href="/subscriptions/profils" onClick={setIsOpen}>
              Profils des abonnements
            </Link>
          </nav>
        </div>
        {!isAuthenticated ? (
          <Link href="/login" className="primary-form-btn" onClick={setIsOpen}>
            <span>Se connecter</span>
            <User />
          </Link>
        ) : (
          <div className="flex items-center justify-end gap-4">
            <CityBtn reverse={true} onClick={setIsOpen} />
            <ProfilBtn reverse={true} onClick={setIsOpen} />
          </div>
        )}
      </ReactFocusLock>
      <ModalBg isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
}
