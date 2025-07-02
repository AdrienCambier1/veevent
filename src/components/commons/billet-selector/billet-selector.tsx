import React, { useState } from "react";
import { SingleEvent } from "@/types";
import "./billet-selector.scss";
import { useRouter } from "next/navigation";

interface BilletSelectorProps {
  event: SingleEvent;
}

const BilletSelector: React.FC<BilletSelectorProps> = ({ event }) => {
  const [quantity, setQuantity] = useState(0);
  const max = event.maxCustomers - event.currentParticipants;
  const router = useRouter();

  const handleMinus = () => {
    setQuantity((q) => Math.max(0, q - 1));
  };
  const handlePlus = () => {
    setQuantity((q) => Math.min(max, q + 1));
  };

  const handleReserve = () => {
    if (quantity > 0) {
      router.push(`/evenements/${event.id}/order?qty=${quantity}`);
    }
  };

  return (
    <div className="billet-selector-container">
      <div className="billet-selector-card">
        <div className="billet-info">
          <div className="billet-title">{event.name || "Billet"}</div>
          <div className="billet-price">{event.price.toFixed(2)}€</div>
        </div>
        <div className="billet-qty-selector">
          <button
            className="billet-btn"
            onClick={handleMinus}
            disabled={quantity === 0}
            aria-label="Diminuer"
          >
            -
          </button>
          <span className="billet-qty">{quantity}</span>
          <button
            className="billet-btn"
            onClick={handlePlus}
            disabled={quantity === max}
            aria-label="Augmenter"
          >
            +
          </button>
        </div>
      </div>
      <button
        className="primary-btn"
        disabled={quantity === 0}
        style={{ marginTop: 24, width: "100%" }}
        onClick={handleReserve}
      >
       <span>Réserver</span>
      </button>
    </div>
  );
};

export default BilletSelector; 