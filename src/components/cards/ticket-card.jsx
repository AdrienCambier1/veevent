import { Plus } from "iconoir-react";

export default function TicketCard({ title, description, price }) {
  return (
    <div className="ticket-card">
      <div className="corner left-0 top-0 -translate-x-1/2 -translate-y-1/2" />
      <div className="corner right-0 top-0 translate-x-1/2 -translate-y-1/2" />
      <div className="corner right-0 bottom-0 translate-x-1/2 translate-y-1/2" />
      <div className="corner left-0 bottom-0 -translate-x-1/2 translate-y-1/2" />
      <div className="dark-gradient p-6 flex flex-col gap-4 justify-between">
        <div className="flex flex-col gap-4">
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xl font-bold">{price}€</p>
          <button className="primary-btn ">
            <span>Réserver</span>
            <Plus />
          </button>
        </div>
      </div>
    </div>
  );
}
