"use client";
import { useState } from "react";
import SearchInput from "@/components/inputs/search-input/search-input";
import TabList from "@/components/common/tab-list/tab-list";
import CustomTitle from "@/components/common/custom-title/custom-title";
import TextImageCard from "@/components/cards/text-image-card/text-image-card";
import img from "@/assets/images/nice.jpg";

export default function VillesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <main>
      <section className="wrapper">
        <h1>Explorez les villes disponibles sur veevent</h1>
        <h3>Rechercher une ville</h3>
        <SearchInput
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="primary-btn">
          <span>Rechercher</span>
        </button>
      </section>
      <section className="wrapper">
        <h3>Parcourir les villes populaires</h3>
        <TextImageCard
          title="Nice"
          subtitle={"24 évenèments"}
          image={img}
          href={`./villes/${"Nice".toLocaleLowerCase()}`}
          isCard={true}
        />
        <TextImageCard
          title="Cannes"
          subtitle={"12 évenèments"}
          image={img}
          href={`./villes/${"Cannes".toLocaleLowerCase()}`}
          isCard={true}
        />
        <TextImageCard
          title="Antibes"
          subtitle={"8 évenèments"}
          image={img}
          href={`./villes/${"Antibes".toLocaleLowerCase()}`}
          isCard={true}
        />
        <TextImageCard
          title="Grasse"
          subtitle={"5 évenèments"}
          image={img}
          href={`/villes/${"Grasse".toLocaleLowerCase()}`}
          isCard={true}
        />
      </section>
      <section className="wrapper">
        <h3>Parcourir les villes populaires</h3>
        <TabList
          title="Alpes-Maritimes"
          items={[]}
          generateHref={(city) => `/villes/${city.toLowerCase()}`}
        />
        <TabList
          title="Var"
          items={[]}
          generateHref={(city) => `/villes/${city.toLowerCase()}`}
        />
      </section>
      <section className="wrapper">
        <CustomTitle
          title="Les lieux populaires proche de chez vous"
          description="Lieux"
        />
      </section>
    </main>
  );
}
