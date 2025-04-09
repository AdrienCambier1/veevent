import { Xmark, NavArrowRight } from "iconoir-react";
import Link from "next/link";
import ModalBg from "./modal-bg";
import ReactFocusLock from "react-focus-lock";
export default function MenuModal({ isOpen, setIsOpen }) {
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
          <div className="h-16 w-full flex items-center gap-12">
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
              Menu <Xmark className="hamburger-menu" />
            </button>
          </div>
          <nav className="flex flex-col gap-4">
            <Link href="">Activités</Link>
            <Link href="">Villes</Link>
            <Link href="">Enregistrés</Link>
            <Link href="">Abonnements</Link>
          </nav>
        </div>
        <div className="flex items-center justify-center gap-4 h-16 w-full">
          <button className="secondary-btn">
            S'inscrire
            <NavArrowRight />
          </button>
          <button className="primary-btn">
            Se connecter <NavArrowRight />
          </button>
        </div>
      </ReactFocusLock>
      <ModalBg isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
}
