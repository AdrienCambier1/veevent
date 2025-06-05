import "./event-card-line.scss";
import Image from "next/image";
import img from "@/assets/images/nice.jpg";
import { ArrowUpRight } from "iconoir-react";

export default function EventCardLine() {
  return (
    <div className="event-card-line">
      <div className="card-image">
        <Image src={img} alt="Nice" />
      </div>
      <div className="card-content">
        <div className="card-title">Concert de rock à Nice</div>
        <div className="card-specs">
          <div className="card-organizer">Mégane R.</div>
          <div className="card-price">À partir de 79€</div>
        </div>
      </div>
      <ArrowUpRight strokeWidth={2} />
    </div>
  );
}
