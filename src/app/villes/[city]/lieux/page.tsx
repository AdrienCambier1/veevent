"use client";
import CustomTitle from "@/components/common/custom-title/custom-title";
import { useParams } from "next/navigation";
import EventCard from "@/components/cards/event-card/event-card";
import TabList from "@/components/common/tab-list/tab-list";
import NewsCard from "@/components/cards/news-card/news-card";
import Link from "next/link";

export default function PlacesPage() {
  const { city } = useParams() as { city: string };

  return (
    <>
      <section className="wrapper">
        <CustomTitle
          title={`Les lieux populaires à ${city}`}
          description="Lieux"
        />
      </section>
      <section className="wrapper">
        <h2>Les évènements populaires à Nice</h2>
        <EventCard
          title="Atelier fresque végétal"
          location="Antibes"
          date="vendredi 14 mai 2025 • 19h00"
          description=" Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
                              semper commodo velit ac facilisis. Nullam augue dui, bibendum vel
                              congue vitae, lacinia vel nunc. Cras tristique ac ipsum nec
                              consectetur. "
          minify={false}
          price={59}
        />
        <h3>Tous les lieux sur Nice et alentours</h3>
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
          title="Les lieux qui font parler à Nice et ses alentours"
          description="Actualités"
        />
        <NewsCard
          title="Les 5 artistes émergeants qui font le show sur la Côte d’Azur"
          description="Magis reges hoc pertinacior inquam nulla arcesilas nata hoc diodorus erit coercendi maximas quod. Et effectrix tanto est quid est modo voluptatem autem tanto familiares actione et credo si.
        Cum quis callipho credo tuus nulla est dicis sequuntur aegyptum interrete cum pullum constructio atqui etiam istud iste... En lire plus"
          date="25/04/2025"
        />
        <NewsCard
          title="Les 5 artistes émergeants qui font le show sur la Côte d’Azur"
          description="Magis reges hoc pertinacior inquam nulla arcesilas nata hoc diodorus erit coercendi maximas quod. Et effectrix tanto est quid est modo voluptatem autem tanto familiares actione et credo si.
                Cum quis callipho credo tuus nulla est dicis sequuntur aegyptum interrete cum pullum constructio atqui etiam istud iste... En lire plus"
          date="25/04/2025"
        />
        <Link href="#" className="secondary-btn">
          <span>Voir les actualités de la ville</span>
        </Link>
      </section>
    </>
  );
}
