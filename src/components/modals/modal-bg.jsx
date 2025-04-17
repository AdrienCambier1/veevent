import { useEffect } from "react";

export default function ModalBg({ isOpen, setIsOpen, className }) {
  useEffect(() => {
    const hasVisibleModals = () => {
      return Array.from(document.querySelectorAll(".modal-bg")).some(
        (modal) => !modal.classList.contains("invisible")
      );
    };

    if (isOpen) {
      document.body.style.overflowY = "hidden";
    } else if (!hasVisibleModals()) {
      document.body.style.overflowY = "";
    }

    return () => {
      if (!hasVisibleModals()) {
        document.body.style.overflowY = "";
      }
    };
  }, [isOpen]);

  return (
    <div
      className={`${
        isOpen ? "visible opacity-100" : "invisible opacity-0"
      } modal-bg ${className}`}
      onClick={setIsOpen}
    />
  );
}
