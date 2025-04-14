"use client";
import ReactFocusLock from "react-focus-lock";
import ModalBg from "./modal-bg";
import ReactDOM from "react-dom";
import { useState, useEffect } from "react";
import { Group } from "iconoir-react";
import UserElement from "../user-element";

export default function UsersModal({
  isOpen,
  setIsOpen,
  type = "participants",
  canEdit = false,
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const modalConfig = {
    participants: {
      title: "Participants",
      emptyText: "Aucun participant pour le moment",
    },
    subscriptions: {
      title: "Abonnements",
      emptyText: "Vous n'êtes abonné à personne",
    },
    subscribers: {
      title: "Abonnés",
      emptyText: "Vous n'avez pas encore d'abonnés",
    },
  };

  const users = [
    { name: "Jean Claude", id: "@jeanclaudedu06", type: "organiser" },
    { name: "Jean Claude", id: "@jeanclaudedu06" },
    { name: "Jean Claude", id: "@jeanclaudedu06" },
    { name: "Jean Claude", id: "@jeanclaudedu06" },
  ];

  const config = modalConfig[type] || modalConfig.participants;

  if (!mounted) return null;

  return ReactDOM.createPortal(
    <>
      <ReactFocusLock
        className={`${isOpen ? "visible" : "invisible"} modal-container`}
      >
        <div
          className={`${
            isOpen ? "opacity-100" : "opacity-0"
          } modal-content !p-0`}
        >
          <div className="flex flex-col items-center gap-2 pt-8">
            <div className="img-gradient-blue">
              <Group />
            </div>
            <h3 className="text-center">{config.title}</h3>
          </div>
          {users.length > 0 ? (
            <div className="relative flex flex-col gap-2 max-h-64 w-full mask-bottom overflow-y-auto p-8 pt-0">
              {users.map((user, index) => (
                <UserElement
                  name={user.name}
                  key={index}
                  id={user.id}
                  type={user.type}
                />
              ))}
            </div>
          ) : (
            <p>{config.emptyText}</p>
          )}
          <div className="flex flex-col-reverse md:flex-row gap-4 w-full p-8 pt-0">
            {canEdit ? (
              <>
                <button className="secondary-form-btn" onClick={setIsOpen}>
                  Annuler
                </button>
                <button className="primary-form-btn">Sauvegarder</button>
              </>
            ) : (
              <button className="primary-form-btn" onClick={setIsOpen}>
                Fermer
              </button>
            )}
          </div>
        </div>
      </ReactFocusLock>
      <ModalBg className="!z-40" isOpen={isOpen} setIsOpen={setIsOpen} />
    </>,
    document.querySelector("body")
  );
}
