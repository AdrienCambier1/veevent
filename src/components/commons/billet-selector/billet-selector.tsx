import React, { useState } from "react";
import { SingleEvent } from "@/types";
import "./billet-selector.scss";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import { useAuth } from "@/contexts/auth-context";
import { authService } from "@/services/auth-service";

interface BilletSelectorProps {
  event: SingleEvent;
  disabled?: boolean;
}

const BilletSelector: React.FC<BilletSelectorProps> = ({ event, disabled }) => {
  const [quantity, setQuantity] = useState(0);
  const placesRestantes = event.maxCustomers - event.currentParticipants;
  const max = Math.min(10, placesRestantes);
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const handleMinus = () => {
    if (disabled) return;
    setQuantity((q) => Math.max(0, q - 1));
  };
  const handlePlus = () => {
    if (disabled) return;
    setQuantity((q) => Math.min(max, q + 1));
  };

  const handleReserve = () => {
    if (disabled) return;
    if (quantity > 0) {
      // Vérifier si l'utilisateur est connecté et a un profil complet
      if (isAuthenticated) {
        const isProfileComplete = authService.isProfileMarkedAsComplete();
        if (!isProfileComplete) {
          // Rediriger vers la complétion de profil avec retour vers l'inscription
          router.push(`/auth/complete-profile?redirect=/evenements/${event.id}/order?qty=${quantity}`);
          return;
        }
      }
      router.push(`/evenements/${event.id}/order?qty=${quantity}`);
    }
  };

  return (
    <div className={`billet-selector-container${disabled ? " billet-selector-disabled" : ""}`}>
      <div className="billet-selector-card">
        <div className="billet-info">
          <div className="billet-title">{event.name || "Billet"}</div>
          <div className="billet-price">{event.price.toFixed(2)}€</div>
        </div>
        <div className="billet-qty-selector">
          <button
            className="billet-btn"
            onClick={handleMinus}
            disabled={quantity === 0 || disabled}
            aria-label="Diminuer"
          >
            -
          </button>
          <span className="billet-qty">{quantity}</span>
          <button
            className="billet-btn"
            onClick={handlePlus}
            disabled={quantity === max || max === 0 || disabled}
            aria-label="Augmenter"
          >
            +
          </button>
        </div>
      </div>
        <div className="text-xs text-slate-500 mt-2">
          {max === 0
            ? "Aucune place disponible"
            : `Maximum ${max} billet${max > 1 ? "s" : ""} par commande`}
        </div>
      <button
        className="primary-btn"
        disabled={quantity === 0 || disabled}
        style={{ marginTop: 24, width: "100%" }}
        onClick={handleReserve}
      >
        <span>Réserver</span>
      </button>
    </div>
  );
};

export default BilletSelector; 