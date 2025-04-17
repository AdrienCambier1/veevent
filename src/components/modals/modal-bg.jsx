import { useEffect } from "react";

export default function ModalBg({ isOpen, setIsOpen, className }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflowY = "hidden";
    } else {
      const anyModalOpen =
        document.querySelectorAll(".modal-bg").length > 0 &&
        Array.from(document.querySelectorAll(".modal-bg")).some(
          (modal) => !modal.classList.contains("invisible")
        );

      if (!anyModalOpen) {
        document.body.style.overflowY = "";
      }
    }

    return () => {
      const stillHasOpenModals =
        document.querySelectorAll(".modal-bg").length > 1 &&
        Array.from(document.querySelectorAll(".modal-bg")).some(
          (modal) => !modal.classList.contains("invisible")
        );

      if (!stillHasOpenModals) {
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
