"use client";
import {
  Bookmark,
  Check,
  DoubleCheck,
  MoreHoriz,
  Trash,
  UserBadgeCheck,
  UserXmark,
} from "iconoir-react";
import profilPicture from "@/assets/images/profil-pic.jpg";
import RatingStar from "../rating-stars";
import ThemeTags from "../theme-tags";
import Image from "next/image";
import niceImage from "@/assets/images/nice.jpg";
import ProfilImages from "../profil-images";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import DialogModal from "../modals/dialog-modal";

export default function EventCard({ canEdit, isRegistered, isTrending }) {
  const [editDropdown, setEditDropdown] = useState(false);
  const [registeredDropdown, setRegisteredDropdown] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [unsubscribeModal, setUnsubscribeModal] = useState(false);
  const editDropdownRef = useRef(null);
  const registeredDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        editDropdownRef.current &&
        !editDropdownRef.current.contains(event.target) &&
        editDropdown
      ) {
        setEditDropdown(false);
      }

      if (
        registeredDropdownRef.current &&
        !registeredDropdownRef.current.contains(event.target) &&
        registeredDropdown
      ) {
        setRegisteredDropdown(false);
      }
    };

    if (editDropdown || registeredDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editDropdown, registeredDropdown]);

  const eventCardContent = () => {
    return (
      <>
        <div className="relative">
          <Image
            src={niceImage}
            alt="Event image"
            className="object-cover rounded-t-xl aspect-[16/9]"
          />
          {isTrending && <div className="trending-tag">Tendance</div>}
        </div>
        <div className="flex flex-col gap-4 p-4">
          <div className="flex justify-between items-center">
            <h3 className="text-[var(--secondary-blue)]">
              Atelier fresque végétal
            </h3>
            <Bookmark className="text-[var(--primary-blue)] h-6 w-6 flex-shrink-0" />
          </div>
          <div className="flex items-center gap-4">
            <Image
              src={profilPicture}
              alt="Profil picture"
              className="profil-pic-md"
            />
            <div className="flex flex-col">
              <p className="dark-text">Jean Claude</p>
              <RatingStar note={4} />
            </div>
          </div>
          <p className="blue-text">Antibes | samedi 24 juin 2025 • 15h30 </p>
          <ThemeTags theme={["Musique", "Sponsorisé", "Sport", "Learning"]} />
          <p className="line-clamp-3">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
            semper commodo velit ac facilisis. Nullam augue dui, bibendum vel
            congue vitae, lacinia vel nunc. Cras tristique ac ipsum nec
            consectetur. 
          </p>
          <div className="flex justify-between items-center">
            <ProfilImages totalCount={8} />
            {canEdit && (
              <div className="relative" ref={editDropdownRef}>
                <button
                  className="more-btn"
                  onClick={() => setEditDropdown(!editDropdown)}
                >
                  <MoreHoriz />
                </button>
                <div
                  className={`${
                    editDropdown ? "visible opacity-100" : "invisible opacity-0"
                  } dropdown-parent right-0`}
                >
                  <Link
                    href="/events/1"
                    className="dropdown-child"
                    onClick={() => setEditDropdown(false)}
                  >
                    Voir l'événement
                  </Link>
                  <button
                    className="dropdown-child"
                    onClick={() => setEditDropdown(false)}
                  >
                    Modifier
                  </button>
                  <button
                    className="dropdown-dangerous"
                    onClick={() => {
                      setEditDropdown(false);
                      setDeleteModal(true);
                    }}
                  >
                    <span>Supprimer</span>
                    <Trash />
                  </button>
                </div>
              </div>
            )}
            {isRegistered && (
              <div className="relative" ref={registeredDropdownRef}>
                <button
                  className="more-btn"
                  onClick={() => setRegisteredDropdown(!registeredDropdown)}
                >
                  <MoreHoriz />
                </button>
                <div
                  className={`${
                    registeredDropdown
                      ? "visible opacity-100"
                      : "invisible opacity-0"
                  } dropdown-parent right-0`}
                >
                  <Link
                    href="/events/1"
                    className="dropdown-child"
                    onClick={() => setRegisteredDropdown(false)}
                  >
                    Voir l'événement
                  </Link>
                  <button
                    className="dropdown-child"
                    onClick={() => setRegisteredDropdown(false)}
                  >
                    Consulter le billet
                  </button>
                  <button
                    className="dropdown-dangerous"
                    onClick={() => {
                      setRegisteredDropdown(false);
                      setUnsubscribeModal(true);
                    }}
                  >
                    <span>Se désincrire</span>
                    <UserXmark />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      {canEdit || isRegistered ? (
        <div className="white-card">{eventCardContent()}</div>
      ) : (
        <Link href="/events/1" className="white-card">
          {eventCardContent()}
        </Link>
      )}
      <DialogModal
        icon={Trash}
        isOpen={deleteModal}
        setIsOpen={() => setDeleteModal(false)}
        title="Supprimer l'événement"
        action="Supprimer"
        description={
          <>
            Cette action entraînera la suppression définitive de l’événement{" "}
            <span className="dark-text">Atelier fresque végétal</span>, les
            inscrits seront remboursés.
          </>
        }
        onClick={() => setDeleteModal(false)}
        isDangerous={true}
      />
      <DialogModal
        icon={UserXmark}
        isOpen={unsubscribeModal}
        setIsOpen={() => setUnsubscribeModal(false)}
        title="Se désinscrire de l'événement"
        action="Se désinscrire"
        description={
          <>
            Souhaitez vous vraiment annuler votre inscription à l'événement{" "}
            <span className="dark-text">Atelier fresque végétal</span>, votre
            inscription sera remboursée.
          </>
        }
        onClick={() => setUnsubscribeModal(false)}
        isDangerous={true}
      />
    </>
  );
}
