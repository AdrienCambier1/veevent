import "./event-card-line.scss";
import Image from "next/image";
import img from "@/assets/images/nice.jpg";
import { ArrowUpRight } from "iconoir-react";
import { Event } from "@/types";
import Link from "next/link";
import { useSlugify } from "@/hooks/commons/use-slugify";

interface EventCardLineProps {
  event?: Event;
}

// Fonction utilitaire pour extraire l'ID depuis les liens HATEOAS
const extractIdFromSelfLink = (event: Event): string => {
  const href = event._links.self.href;
  const id = href.split("/").pop();
  return id || "";
};

export default function EventCardLine({ event }: EventCardLineProps) {
  // Si aucun événement n'est fourni, afficher des données par défaut
  if (!event) {
    return (
      <div className="event-card-line">
        <div className="card-image">
          <Image src={img} alt="Événement" />
        </div>
        <div className="card-content">
          <div className="card-title">Concert de rock à Nice</div>
          <ul className="card-specs">
            <li className="card-organizer">Organisateur</li>
            <li className="card-price">À partir de 79€</li>
          </ul>
        </div>
        <ArrowUpRight strokeWidth={2} />
      </div>
    );
  }

  const eventId = extractIdFromSelfLink(event);
  const nameSlug = useSlugify(event.name);
  const priceDisplay =
    event.price === 0 ? "Gratuit" : `À partir de ${event.price}€`;

  return (
    <Link href={`/evenements/${eventId}/${nameSlug}`}>
      <div className="event-card-line">
        <div className="card-image">
          <Image src={img} alt={event.name} />
        </div>
        <div className="card-content">
          <div className="card-title">{event.name}</div>
          <ul className="card-specs">
            <li className="card-organizer">{event.organizer?.pseudo}</li>
            <li className="card-price">{priceDisplay}</li>
          </ul>
        </div>
        <ArrowUpRight strokeWidth={2} />
      </div>
    </Link>
  );
}
