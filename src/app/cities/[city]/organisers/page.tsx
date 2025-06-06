"use client";
import CustomTitle from "@/components/common/custom-title/custom-title";
import { useParams } from "next/navigation";
import EventCard from "@/components/cards/event-card/event-card";
import Link from "next/link";
import CityCard from "@/components/cards/city-card/city-card";
// import OrganizerCard from "@/components/cards/organizer-card/organizer-card";

export default function OrganisersPage() {
  const { city } = useParams() as { city: string };

  return (
    <>
      <section className="wrapper">
        <CustomTitle
          title={`Découvrez leurs derniers évènements sur ${city}`}
          description="Organisateurs populaires"
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
      </section>
      <section className="wrapper">
        <h2>Ils organisent bientôt leurs évènements</h2>
        {/* <OrganizerCard name="JB" date="24.05.2025" /> */}
        <Link href="#" className="primary-btn">
          <span>Voir les prochains évènements</span>
        </Link>
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
          minify={true}
          price={59}
        />
      </section>
    </>
  );
}
