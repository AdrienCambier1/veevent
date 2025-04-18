"use client";
import ReactFocusLock from "react-focus-lock";
import ModalBg from "./modal-bg";
import ReactDOM from "react-dom";
import { useState, useEffect } from "react";

export default function DialogModal({
  isOpen,
  setIsOpen,
  action,
  isDangerous,
  title,
  description,
  icon: Icon,
  onClick,
}) {
  const [mounted, setMounted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsOpen();

    if (onClick) onClick();
  };

  useEffect(() => {
    setMounted(true);
  }, []);

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
            <div
              className={`${
                isDangerous ? "img-gradient-red" : "img-gradient-blue"
              }`}
            >
              {Icon && <Icon />}
            </div>
            <h3 className="text-center">{title}</h3>
          </div>
          <p className="text-center">{description}</p>
          {action ? (
            <div className="flex flex-col-reverse md:flex-row gap-4 w-full">
              <button
                className={`${
                  isDangerous &&
                  "!border-[var(--primary-red)] !text-[var(--primary-red)]"
                } secondary-form-btn`}
                onClick={setIsOpen}
              >
                <span>Annuler</span>
              </button>
              <button
                className={`${
                  isDangerous && "!bg-[var(--primary-red)]"
                } primary-form-btn`}
                onClick={handleSubmit}
              >
                <span>{action}</span>
              </button>
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
