import { Plus } from "iconoir-react";

export default function TicketCard({ title, description, price, onClick }) {
  return (
    <div className="ticket-card">
      <div className="bg-circle h-60 w-60 top-0 -translate-y-1/2 -translate-x-1/2 left-0" />
      <div className="bg-circle h-32 w-32 bottom-0 -translate-x-1/2 left-0" />
      <div className="dark-gradient p-6 flex flex-col gap-6 justify-between">
        <div className="flex flex-col gap-4">
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xl font-bold">{price}€</p>
          <button className="primary-btn" onClick={onClick}>
            <span>Réserver</span>
            <Plus />
          </button>
        </div>
      </div>
    </div>
  );
}
