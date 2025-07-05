import Link from "next/link";
import "./order-card.scss";

export type OrderCardProps = {
  orderId: number | string;
  eventName: string;
  eventUrl: string;
  eventDate: string;
  totalPrice: number;
};

export default function OrderCard({ orderId, eventName, eventUrl, eventDate, totalPrice }: OrderCardProps) {
  return (
    <div className="order-card">
      <div className="order-card-header">
        <span className="order-id">Commande #{orderId}</span>
        <span className="order-price">{totalPrice}€</span>
      </div>
      <Link href={eventUrl} className="order-event-link">
        <span className="order-event-name">{eventName}</span>
      </Link>
      <div className="order-date">{eventDate}</div>
      <Link href={`/compte/commandes/${orderId}`} className="order-btn">
        Voir la commande
      </Link>
    </div>
  );
} 