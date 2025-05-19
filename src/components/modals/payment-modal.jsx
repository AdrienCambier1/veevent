"use client";
import ReactFocusLock from "react-focus-lock";
import ModalBg from "./modal-bg";
import ReactDOM from "react-dom";
import { useState, useEffect, useRef } from "react";
import { Euro, Lock } from "iconoir-react";
import ItemList from "../lists/item-list";
import CreditCard from "../cards/credit-card";

export default function PaymentModal({
  isOpen,
  setIsOpen,
  onClick,
  ticket,
  price,
}) {
  const [mounted, setMounted] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const scrollContainerRef = useRef(null);

  const paymentInfos = [
    { icon: Lock, value: "Paiement sécurisé" },
    { icon: Lock, ticket: ticket, type: "payment", price: price },
  ];

  const handleSubmit = () => {
    setIsOpen();
    if (onClick) onClick();
  };

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
              <Euro />
            </div>
            <h3 className="text-center">Votre commande</h3>
          </div>
          <div
            ref={scrollContainerRef}
            onScroll={checkScrollPosition}
            className={`overflow-card flex flex-col gap-8 ${
              !isAtTop && !isAtBottom
                ? "mask-both"
                : !isAtTop
                ? "mask-top"
                : !isAtBottom
                ? "mask-bottom"
                : ""
            }`}
          >
            <div className="flex flex-col gap-4 ">
              <CreditCard />
              <p>
                Entrez les informations de votre carte bancaire pour procéder à
                l’achat du billet.
              </p>
            </div>
            <ItemList items={paymentInfos} />
          </div>
          <div className="flex flex-col-reverse md:flex-row gap-4 w-full">
            <button className="secondary-form-btn" onClick={setIsOpen}>
              <span>Annuler</span>
            </button>
            <button className="primary-form-btn" onClick={handleSubmit}>
              <span>Payer</span>
            </button>
          </div>
        </div>
      </ReactFocusLock>
      <ModalBg className="!z-40" isOpen={isOpen} setIsOpen={setIsOpen} />
    </>,
    document.querySelector("body")
  );
}
