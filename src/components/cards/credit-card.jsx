import { CreditCardSolid } from "iconoir-react";

export default function CreditCard() {
  return (
    <div className="credit-card">
      <div className="dark-gradient p-6 flex flex-col gap-8 justify-between">
        <div className="flex items-center gap-2">
          <CreditCardSolid />
          <p>Carte</p>
        </div>
        <div className="flex flex-col gap-2">
          <label>Numéro de carte</label>
          <input type="text" placeholder="XXXX XXXX XXXX XXXX" />
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            <label>Nom sur la carte</label>
            <input type="text" placeholder="Timothée Durand" />
          </div>
          <div className="flex flex-col gap-2">
            <label>Date d'expiration</label>
            <input type="text" placeholder="jj/mm/aa" />
          </div>
        </div>
      </div>
    </div>
  );
}
