import ProfilImg from "@/components/images/profil-img/profil-img";
import "./review-card.scss";

interface ReviewCardProps {
  author: string;
  note: number;
  title: string;
  description: string;
  type: string;
  place: string;
  city: string;
}

export default function ReviewCard({
  author,
  note,
  title,
  description,
  type,
  place,
  city,
}: ReviewCardProps) {
  return (
    <div className="review-card">
      <ProfilImg name={author} note={note} />
      <p className="title">{title}</p>
      <p className="description">{description}</p>
      <div className="participation">
        Concert {type} à{" "}
        <span>
          {place}, {city}
        </span>
      </div>
    </div>
  );
}
