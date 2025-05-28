import ProfilImg from "../profil-img";

export default function ReviewCard({
  author,
  note,
  title,
  description,
  type,
  place,
  city,
}) {
  return (
    <div className="review-card">
      <ProfilImg name={author} note={note} />
      <p className="text-base font-medium">{title}</p>
      <p>{description}</p>
      <div className="participation">
        Concert {type} à{" "}
        <span>
          {place}, {city}
        </span>
      </div>
    </div>
  );
}
