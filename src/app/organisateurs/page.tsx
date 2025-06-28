"use client";
import SearchInput from "@/components/inputs/search-input/search-input";
import OrganizerCard from "@/components/cards/organizer-card/organizer-card";
import { useState, useEffect, Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import CustomTitle from "@/components/commons/custom-title/custom-title";
import { useOrganizers } from "@/hooks/organizers/use-organizers";
import { SingleUser } from "@/types";

function OrganisateursPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  // const [searchTerm, setSearchTerm] = useState("");

  // Hook pour récupérer tous les organisateurs
  const { organizers, loading, error } = useOrganizers();

  // useEffect(() => {
  //   const urlSearch = searchParams?.get("search");
  //   if (urlSearch) {
  //     setSearchTerm(urlSearch);
  //   }
  // }, [searchParams]);

  // const handleSearch = () => {
  //   if (searchTerm.trim()) {
  //     router.push(`/organisateurs?search=${encodeURIComponent(searchTerm)}`);
  //   } else {
  //     router.push("/organisateurs");
  //   }
  // };

  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setSearchTerm(e.target.value);
  // };

  // Filtrer les organisateurs selon la recherche
  // const filteredOrganizers = useMemo(() => {
  //   if (!searchTerm.trim()) return organizers;

  //   return organizers.filter((organizer: SingleUser) => {
  //     const fullName = `${organizer.firstName || ""} ${
  //       organizer.lastName || ""
  //     }`.trim();
  //     const searchLower = searchTerm.toLowerCase();

  //     return (
  //       organizer.pseudo?.toLowerCase().includes(searchLower) ||
  //       fullName.toLowerCase().includes(searchLower) ||
  //       organizer.email?.toLowerCase().includes(searchLower) ||
  //       organizer.description?.toLowerCase().includes(searchLower)
  //     );
  //   });
  // }, [organizers, searchTerm]);

  // Séparer les organisateurs actifs et populaires
  // const { activeOrganizers, popularOrganizers } = useMemo(() => {
  //   const active = filteredOrganizers.filter((org) => org.eventsCount > 0);
  //   // Organisateurs populaires = ceux avec le plus d'événements
  //   const popular = [...active]
  //     .sort(
  //       (a, b) =>
  //         b.eventsCount + b.eventPastCount - (a.eventsCount + a.eventPastCount)
  //     )
  //     .slice(0, 6);

  //   return { activeOrganizers: active, popularOrganizers: popular };
  // }, [filteredOrganizers]);

  if (loading) {
    return (
      <main>
        <section className="wrapper">
          <p>Chargement des organisateurs...</p>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <section className="wrapper">
          <h1>Erreur de chargement</h1>
          <p>Impossible de charger les organisateurs.</p>
          <p>Erreur: {error.message}</p>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="wrapper">
        <h1>Explorez les organisateurs veevent</h1>
        <h3>Rechercher un organisateur</h3>
        <SearchInput
          // value={searchTerm}
          // onChange={handleInputChange}
          placeholder="Florent, Jean, Marie..."
        />
        <button className="primary-btn" >
          <span>Rechercher</span>
        </button>
      </section>

      {/* Organisateurs populaires */}
      {/* {popularOrganizers.length > 0 && (
        <section className="wrapper">
          <CustomTitle
            description="Organisateurs populaires"
            title="Découvrez les organisateurs populaires"
          />
          {popularOrganizers.map((organizer: SingleUser) => (
            <OrganizerCard key={organizer.pseudo} organizer={organizer} />
          ))}
        </section>
      )} */}

      {/* Tous les organisateurs */}
      {/* <section className="wrapper">
        <h2>
          {searchTerm ? "Résultats de recherche" : "Tous les organisateurs"}
        </h2>

        {filteredOrganizers.length > 0 ? (
          filteredOrganizers.map((organizer: SingleUser) => (
            <OrganizerCard key={organizer.pseudo} organizer={organizer} />
          ))
        ) : (
          <div className="no-results">
            <p>Aucun organisateur trouvé</p>
            {searchTerm && (
              <p>
                Essayez avec d'autres mots-clés ou{" "}
                <button onClick={() => setSearchTerm("")}>
                  voir tous les organisateurs
                </button>
              </p>
            )}
          </div>
        )}
      </section> */}
    </main>
  );
}

export default function OrganisateursPage() {
  return (
    <Suspense
      fallback={
        <div className="wrapper">
          <p>Chargement...</p>
        </div>
      }
    >
      <OrganisateursPageContent />
    </Suspense>
  );
}
