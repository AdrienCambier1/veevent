import { useState, useEffect, useRef } from "react";
import { LogOut } from "iconoir-react";
import Image from "next/image";
import Link from "next/link";
import profilPicture from "@/assets/images/profil-pic.jpg";
import { useAuth } from "@/contexts/auth-context";

export default function ProfilBtn({ reverse, onClick }) {
  const { user, logout } = useAuth();
  const [profilDropdown, setProfilDropdown] = useState(false);
  const profilDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profilDropdownRef.current &&
        !profilDropdownRef.current.contains(event.target)
      ) {
        setProfilDropdown(false);
      }
    };

    if (profilDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profilDropdown]);

  const handleClose = () => {
    setProfilDropdown(false);
    onClick && onClick();
  };

  return (
    <div className="relative flex items-center" ref={profilDropdownRef}>
      <button
        className="profil-btn relative"
        onClick={() => setProfilDropdown(!profilDropdown)}
      >
        <Image
          src={profilPicture}
          alt="Profil picture"
          className="profil-pic-md"
        />
      </button>
      <div
        className={`
          ${profilDropdown ? "visible opacity-100" : "invisible opacity-0"}
           !w-fit right-0
          ${reverse ? "dropdown-parent-reverse" : "dropdown-parent"}
        `}
      >
        <p className="dropdown-text">{user?.name || "Utilisateur"}</p>
        <Link
          href="/account/profil/events"
          className="dropdown-child"
          onClick={handleClose}
        >
          Mon compte
        </Link>
        <Link
          href="/"
          className="dropdown-dangerous"
          onClick={() => {
            logout();
            handleClose();
          }}
        >
          <span>Se déconnecter</span>
          <LogOut />
        </Link>
      </div>
    </div>
  );
}
