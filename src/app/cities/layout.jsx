"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import SearchInput from "@/components/inputs/search-input/search-input";
import BarMenu from "@/components/menu/bar-menu/bar-menu";
import BannerImg from "@/components/images/banner-img/banner-img";

export default function CitiesLayout({ children }) {
  const [searchTerm, setSearchTerm] = useState("");
  const pathname = usePathname();

  const navigation = [
    { isHome: true, href: "/cities" },
    { label: "Evenements", href: "/cities/events" },
    { label: "Lieux", href: "/cities/places" },
    { label: "Organisateurs", href: "/cities/organisers" },
  ];

  return (
    <main>
      <BannerImg city="Nice" />
      <section className="wrapper">
        <h2>Évènements et activités proche de la ville de Nice</h2>
        <div className="flex flex-col gap-2">
          <h3>Rechercher un évènement à Nice</h3>
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="primary-btn">
            <span>Rechercher</span>
          </button>
        </div>
        <BarMenu navigation={navigation} />
      </section>
      {children}
    </main>
  );
}
