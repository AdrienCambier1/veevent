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
          <div className="w-full flex gap-12 justify-between items-center h-16">
            <Link
              href="/"
              className="logo"
              onClick={(e) => {
                if (window.location.pathname === "/") {
                  e.preventDefault();
                  scrollToTop();
                  setIsOpen(false);
                } else {
                  setIsOpen(false);
                }
              }}
            >
              v<span>ee</span>vent
            </Link>
            <button className="blue-rounded-btn" onClick={setIsOpen}>
              <span>Fermer</span>
              <Xmark className="hamburger-menu" />
            </button>
          </div>
          <nav>
            <h4>Pages</h4>
            <Link href="/activities" onClick={setIsOpen}>
              Activités
            </Link>
            <div>
              <Link href="/activities/events" onClick={setIsOpen}>
                Evenements
              </Link>
              <Link href="/activities/organisers" onClick={setIsOpen}>
                Organisateurs
              </Link>
            </div>
            <Link href="/cities" onClick={setIsOpen}>
              Les villes
            </Link>
            <Link href="/saved" onClick={setIsOpen}>
              Enregistrés
            </Link>
            <div>
              <Link href="/saved/inscriptions" onClick={setIsOpen}>
                Inscriptions
              </Link>
              <Link href="/saved/marked" onClick={setIsOpen}>
                Mes favoris
              </Link>
            </div>
            <Link href="/subscriptions" onClick={setIsOpen}>
              Abonnements
            </Link>
            <div>
              <Link href="/subscriptions/events" onClick={setIsOpen}>
                Evennements des abonnements
              </Link>
              <Link href="/subscriptions/profils" onClick={setIsOpen}>
                Profils des abonnements
              </Link>
            </div>
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
