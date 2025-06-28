import { Place } from "@/types";
import "./place-head.scss";
import nice4k from "@/assets/images/nice4k.jpg";
import Image from "next/image";
import { MapPin, Shop } from "iconoir-react";


interface PlaceHeadProps {
    place: Place;
    bannerImage?: string;
}
export default function PlaceHead({
  place,
  bannerImage = nice4k,
}: PlaceHeadProps) {
  return (
    <>
     <div className="banner-img">
      <div className="gradient" />
      <Image src={bannerImage} alt="Banner image" className="banner" />
    </div>
    <section className="wrapper">
        <h1>{place?.name}</h1>
        <div className="flex gap-4 text-primary-600">
          <div className="flex gap-1">
            <MapPin />
            {place?.cityName}
          </div>
          <div className="flex gap-1">
            <Shop />
            {place?.type}
          </div>
        </div>
        <p>{place?.description}</p>
         <div className="place-stats">
          <div>
            <span>{place.eventsCount - place.eventsPastCount} </span>
            {place.eventsCount > 1 ? "événements " : "événement "}
            en cours
          </div>
          <div>
            <span>{place.eventsPastCount}</span>
            {place.eventsPastCount > 1 ? " passés" : " passé"}
          </div>
        </div>
      </section>
    </>
  );
}