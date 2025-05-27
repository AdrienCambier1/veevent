import { Bookmark, Pin, Calendar } from "iconoir-react";

export default function EventCard({
  title,
  description,
  location,
  date,
  price,
  imageUrl,
}) {
  return (
    <div className="event-card">
      <div className="flex flex-col gap-2 p-2">
        <div className="flex items-center justify-between gap-2">
          <p className="title">{title}</p>
          <Bookmark />
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="tag">
            <Pin />
            <span>{location}</span>
          </div>
          <div className="tag">
            <Calendar />
            <span>{date}</span>
          </div>
        </div>
        <p className="line-clamp-2 text-sm">{description}</p>
        <div className="flex items-center justify-between gap-2">
          <p>image</p>
          <p className="description">
            À partir de <span>{price} €</span>
          </p>
        </div>
      </div>
    </div>
  );
}
