import RatingStars from "@/components/rating-stars";
import Image from "next/image";
import Trustpilot from "@/assets/images/trustpilot.png";

export default function TrustpilotCard({ note, reviews_number, description }) {
  return (
    <div className="trustpilot-card">
      <div className="flex items-center gap-4">
        <RatingStars note={note} />
        <p className="truncate">
          <span className="font-bold">{reviews_number}</span> avis certifiés
        </p>
        <Image className="h-8 w-auto" src={Trustpilot} alt="Trustpilot logo" />
      </div>
      <p>{description}</p>
    </div>
  );
}
