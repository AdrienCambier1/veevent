"use client";
import { useState, ReactNode } from "react";
import SearchInput from "@/components/inputs/search-input/search-input";
import BarMenu from "@/components/menu/bar-menu/bar-menu";
import BannerHead from "@/components/heads/banner-head/banner-head";
import CustomTitle from "@/components/commons/custom-title/custom-title";
import FaqCard from "@/components/cards/faq-card/faq-card";
import ReviewCard from "@/components/cards/review-card/review-card";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCityData } from "@/hooks/cities/use-city-data";

interface CitiesLayoutProps {
  children: ReactNode;
}

export default function CityLayout({ children }: CitiesLayoutProps) {
  const { city } = useParams() as { city: string };
  const { city: cityData } = useCityData(city);
  const [searchTerm, setSearchTerm] = useState("");

  const navigation = [
    { isHome: true, href: `/villes/${city}`, label: "Accueil" },
    { label: "Evenements", href: `/villes/${city}/evenements` },
    { label: "Lieux", href: `/villes/${city}/lieux` },
    { label: "Organisateurs", href: `/villes/${city}/organisateurs` },
  ];

  return (
    <main>
      <BannerHead city={cityData?.name || ""} />
      <section className="wrapper">
        <h1>Évènements et activités proche de la ville de {city}</h1>
        <h3>Rechercher un évènement à {city}</h3>
        <SearchInput
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="primary-btn">
          <span>Rechercher</span>
        </button>
      </section>
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
