"use client";
import FaqCard from "@/components/cards/faq-card/faq-card";
import ReviewCard from "@/components/cards/review-card/review-card";
import CustomTitle from "@/components/commons/custom-title/custom-title";
import PlaceHead from "@/components/heads/place-head/place-head";
import BarMenu from "@/components/menu/bar-menu/bar-menu";
import { usePlaceData } from "@/hooks/places/use-place-data";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ReactNode, useState } from "react";

interface PlacesLayoutProps {
  children: ReactNode;
}

export default function PlaceLayout({ children }: PlacesLayoutProps) {
  const { place } = useParams() as { place: string };
  const { place: placeData } = usePlaceData(place);
  const [searchTerm, setSearchTerm] = useState("");

  const navigation = [
    { isHome: true, href: `/lieux/${place}`, label: "Accueil" },
    { label: "Programmation", href: `/lieux/${place}/programmation` },
    { label: "Événements", href: `/lieux/${place}/evenements` },
    // { label: "Actualités", href: `/lieux/${place}/actualites` },
  ];

  return (
    <main>
      {placeData && <PlaceHead place={placeData} bannerImage={placeData.bannerUrl || undefined} />}
      <section className="wrapper">
        <BarMenu navigation={navigation} />
      </section>
      {children}
      <section className="wrapper">
        <CustomTitle
          title="Nos utilisateurs parlent de leur expérience à Nice"
          description="Avis"
        />
        <ReviewCard
          author="Jean Dupont"
          note={3}
          title="Je recommande cette platefomre pour trouver des artistes locaux"
          description="Sed non triarius nata consectetur est homines esse dolor voluptatem in iam ipsum viros est est est instrumento itaque iste epicuro. Isto triarius iste habent abducas atque et igitur se."
          type="pop rock"
          place="Maison 13"
          city="Cannes"
        />
        <ReviewCard
          author="Jean Dupont"
          note={3}
          title="Je recommande cette platefomre pour trouver des artistes locaux"
          description="Sed non triarius nata consectetur est homines esse dolor voluptatem in iam ipsum viros est est est instrumento itaque iste epicuro. Isto triarius iste habent abducas atque et igitur se."
          type="pop rock"
          place="Maison 13"
          city="Cannes"
        />
        <Link href="#" className="secondary-btn">
          <span>Voir plus d'avis</span>
        </Link>
      </section>
      <section className="wrapper">
        <CustomTitle
          title="Questions fréquentes de nos utilisateurs"
          description="FAQ"
        />
        <FaqCard label="Comment acheter un billet de concert ?" />
        <FaqCard label="Comment acheter un billet de concert ?" />
        <FaqCard label="Comment acheter un billet de concert ?" />
      </section>
    </main>
  );
}
