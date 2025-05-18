"use client";
import ReactFocusLock from "react-focus-lock";
import ModalBg from "./modal-bg";
import ReactDOM from "react-dom";
import { useState, useEffect, useRef } from "react";
import { Group } from "iconoir-react";
import UserElement from "../user-element";

export default function UsersModal({
  isOpen,
  setIsOpen,
  type = "participants",
  canEdit = false,
}) {
  const [mounted, setMounted] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const scrollContainerRef = useRef(null);

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
    { name: "Jean Claude", id: "@jeanclaudedu06" },
    { name: "Jean Claude", id: "@jeanclaudedu06" },
    { name: "Jean Claude", id: "@jeanclaudedu06" },
    { name: "Jean Claude", id: "@jeanclaudedu06" },
    { name: "Jean Claude", id: "@jeanclaudedu06" },
    { name: "Jean Claude", id: "@jeanclaudedu06" },
    { name: "Jean Claude", id: "@jeanclaudedu06" },
    { name: "Jean Claude", id: "@jeanclaudedu06" },
    { name: "Jean Claude", id: "@jeanclaudedu06" },
    { name: "Jean Claude", id: "@jeanclaudedu06" },
    { name: "Jean Claude", id: "@jeanclaudedu06" },
    { name: "Jean Claude", id: "@jeanclaudedu06" },
    { name: "Jean Claude", id: "@jeanclaudedu06" },
    { name: "Jean Claude", id: "@jeanclaudedu06" },
    { name: "Jean Claude", id: "@jeanclaudedu06" },
    { name: "Jean Claude", id: "@jeanclaudedu06" },
    { name: "Jean Claude", id: "@jeanclaudedu06" },
    { name: "Jean Claude", id: "@jeanclaudedu06" },
    { name: "Jean Claude", id: "@jeanclaudedu06" },
    { name: "Jean Claude", id: "@jeanclaudedu06" },
  ];

  const config = modalConfig[type] || modalConfig.participants;

  const checkScrollPosition = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setIsAtTop(container.scrollTop <= 0);

    const isBottom =
      Math.ceil(container.scrollTop + container.clientHeight) >=
      container.scrollHeight;
    setIsAtBottom(isBottom);
  };

  useEffect(() => {
    setMounted(true);

    if (isOpen) {
      checkScrollPosition();
    }
  }, [isOpen, checkScrollPosition]);

  if (!mounted) return null;

  return ReactDOM.createPortal(
    <>
      <ReactFocusLock
        className={`${isOpen ? "visible" : "invisible"} modal-container`}
      >
        <div
          className={`${isOpen ? "opacity-100" : "opacity-0"} modal-content`}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="img-gradient-blue">
              <Group />
            </div>
            <h3 className="text-center">{config.title}</h3>
          </div>
          {users.length > 0 ? (
            <div
              ref={scrollContainerRef}
              onScroll={checkScrollPosition}
              className={`overflow-card flex flex-col gap-2 ${
                !isAtTop && !isAtBottom
                  ? "mask-both"
                  : !isAtTop
                  ? "mask-top"
                  : !isAtBottom
                  ? "mask-bottom"
                  : ""
              }`}
            >
              {users.map((user, index) => (
                <UserElement name={user.name} key={index} id={user.id} />
              ))}
            </div>
          ) : (
            <p>{config.emptyText}</p>
          )}
          {canEdit ? (
            <div className="flex flex-col-reverse md:flex-row gap-4 w-full">
              <button className="secondary-form-btn" onClick={setIsOpen}>
                <span>Annuler</span>
              </button>
              <button className="primary-form-btn">Sauvegarder</button>
            </div>
          ) : (
            <button className="primary-form-btn" onClick={setIsOpen}>
              <span>Fermer</span>
            </button>
          )}
        </div>
      </ReactFocusLock>
      <ModalBg className="!z-40" isOpen={isOpen} setIsOpen={setIsOpen} />
    </>,
    document.querySelector("body")
  );
}
