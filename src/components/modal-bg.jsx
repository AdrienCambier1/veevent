import { useEffect } from "react";

export default function ModalBg({ isOpen, setIsOpen }) {
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
        document.body.style.removeProperty("overflow-y");
      }
    }
  }, [isOpen]);

  return (
    <div
      className={`${
        isOpen ? "visible opacity-100" : "invisible opacity-0"
      } modal-bg`}
      onClick={setIsOpen}
    />
  );
}
