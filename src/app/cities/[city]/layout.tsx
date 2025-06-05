"use client";
import { useState, ReactNode } from "react";
import SearchInput from "@/components/inputs/search-input/search-input";
import BarMenu from "@/components/menu/bar-menu/bar-menu";
import BannerImg from "@/components/images/banner-img/banner-img";
import { useParams } from "next/navigation";

interface CitiesLayoutProps {
  children: ReactNode;
}

export default function CitiesLayout({ children }: CitiesLayoutProps) {
  const { city } = useParams() as { city: string };
  const [searchTerm, setSearchTerm] = useState("");

  const navigation = [
    { isHome: true, href: `/cities/${city}`, label: "Accueil" },
    { label: "Evenements", href: `/cities/${city}/events` },
    { label: "Lieux", href: `/cities/${city}/places` },
    { label: "Organisateurs", href: `/cities/${city}/organisers` },
  ];

  return (
    <main>
      <BannerImg city={city} />
      <section className="wrapper">
        <h2>Évènements et activités proche de la ville de {city}</h2>
        <h3>Rechercher un évènement à {city}</h3>
        <SearchInput
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="primary-btn">
          <span>Rechercher</span>
        </button>
        <BarMenu navigation={navigation} />
      </section>
      {children}
    </main>
  );
}
