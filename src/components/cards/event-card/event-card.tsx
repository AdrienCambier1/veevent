import niceImage from "@/assets/images/nice.jpg";
import ProfileImg from "@/components/images/profile-img/profile-img";
import ProfilesImg from "@/components/images/profiles-img/profiles-img";
import ThemeTag from "@/components/tags/theme-tag/theme-tag";
import { BaseCategory, Event } from "@/types";
import { ArrowUpRight, Bookmark, Calendar, MapPin } from "iconoir-react";
import Image from "next/image";
import Link from "next/link";
import "./event-card.scss";
import { useSlugify } from "@/hooks/commons/use-slugify";

interface EventCardProps {
  id: string;
  event: Event;
  minify?: boolean;
  grid?: boolean;
}

export default function EventCard({ id, event, minify, grid }: EventCardProps) {
  const nameSlug = useSlugify(event.name);
  return (
    <Link
      href={`/evenements/${id}/${nameSlug}`}
      className={`event-card ${minify ? "minify" : ""} ${grid ? "grid" : ""}`}
    >
      <div className="image-container">
        <div className="theme-tags">
          {event.categories.map((category: BaseCategory, index: number) => {
            return (
              <ThemeTag
                key={`${category.key}-${index}`}
                category={category.key}
                name={category.name}
                onEventCard={true}
              />
            );
          })}
        </div>
        <Image src={niceImage} className="banner" alt="Event image" />
      </div>
      <div className={`flex flex-col justify-between flex-1 p-2 ${minify ? "gap-1" : "gap-1"}`}>
        <div className="flex items-center justify-between gap-2">
          <div className="title">{event.name}</div>
          <Bookmark className="icon" />
        </div>
        <ProfileImg
          name={
            `${event.organizer?.firstName} ${event.organizer?.lastName}` || ""
          }
          note={event.organizer?.note}
          imageUrl={event.organizer?.imageUrl}
        />
        <div className={`flex flex-wrap ${minify ? "gap-1" : "gap-2"}`}>
          <div className="info">
            <MapPin className="icon-small" />
            <span>{event.address}</span>
          </div>
          <div className="info">
            <Calendar className="icon-small" />
            <span>
              Le{" "}
              {new Date(event.date).toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }) +
                " à " +
                new Date(event.date).toLocaleTimeString("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
            </span>
          </div>
        </div>
        {!minify && event.description && (
          <p className="description">{event.description}</p>
        )}
        <div className="flex items-center justify-between gap-2">
          {!minify && <ProfilesImg totalCount={event.currentParticipants} />}
          <p className="price">
            {event.price === 0 ? (
              <span>Gratuit</span>
            ) : (
              <>
                À partir de <span>{event.price} €</span>
              </>
            )}
          </p>
          {minify && <ArrowUpRight className="text-lg" />}
        </div>
      </div>
    </Link>
  );
}
