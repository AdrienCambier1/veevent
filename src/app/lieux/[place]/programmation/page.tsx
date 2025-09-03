"use client";
import NewsCard from "@/components/cards/news-card/news-card";
import TextImageCard from "@/components/cards/text-image-card/text-image-card";
import CustomTitle from "@/components/commons/custom-title/custom-title";
import EventsAgenda from "@/components/commons/events-agenda/events-agenda";
import { useFilters } from "@/contexts/filter-context";
import { usePlaceData } from "@/hooks/places/use-place-data";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRef, useState } from "react";



function ProgrammationContent() {
  // Récupérer la ville depuis l'API
  const { place: placeParam } = useParams() as { place: string };

  const { place, loading, error, refetch } = usePlaceData(placeParam);

  const {events, loading: eventsLoading, error: eventsError} = usePlaceData(placeParam, "events");

  const {organizers, loading: organizersLoading, error: organizersError} = usePlaceData(placeParam, "organizers");

  
  if (eventsLoading) {
    return <div className="p-8 text-center">Chargement de la programmation du lieu...</div>;
  }

  return (
    <>
    <section className="wrapper">
      <h2>La programmation de {place?.name}</h2>
      <EventsAgenda events={Array.isArray(events) ? events : (events as any)?._embedded?.eventSummaryResponses || []} />
    </section>

     <section className="wrapper">
        <h2>Les prochains guests à {place?.name}</h2>

        {organizers.length > 0 ? (
          organizers
            .slice(0, 5)
            .map((organizer, index) => (
              <TextImageCard
                key={organizer.slug || index}
                title={
                  (`${organizer.firstName || ""} ${
                    organizer.lastName || ""
                  }`.trim() || organizer.pseudo || "Organisateur")
                }
                href={`/organisateurs/${organizer.slug || "unknown"}`}
                image={organizer.imageUrl || organizer.bannerUrl || ""}
              />
            ))
        ) : (
          <p>Aucun organisateur trouvé pour le moment.</p>
        )}

        <Link href={`/lieux/${placeParam}/evenements`} className="primary-btn">
          <span>Voir les prochains événements</span>
        </Link>
      </section>


       {/* Section actualités */}
      <section className="wrapper">
        <CustomTitle
          title={`Les évènements à ne pas manquer à ${place?.name}`}
          description="Actualités"
        />
        <NewsCard
          title={`Les événements incontournables à ${place?.name}`}
          description={`Découvrez les meilleurs événements qui se déroulent à ${place?.name}. 
          Avec ${place?.eventsCount} événements disponibles, notre ville offre une programmation riche et variée 
          pour tous les goûts et tous les âges. Ne manquez pas les événements qui font vibrer notre région !`}
          date={new Date().toLocaleDateString("fr-FR")}
        />

        <Link href={`/lieux/${placeParam}/actualites`} className="secondary-btn">
          <span>Voir les actualités de la ville</span>
        </Link>
      </section>
     </>
  )
}

export default function ProgrammationPage() {
  return (
      <ProgrammationContent />
  );
}
