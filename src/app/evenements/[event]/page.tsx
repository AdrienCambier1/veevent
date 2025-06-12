"use client";
import BannerHead from "@/components/heads/banner-head/banner-head";
import EventHead from "@/components/heads/event-head/event-head";
import { useParams } from "next/navigation";
import CustomTitle from "@/components/common/custom-title/custom-title";
import FaqCard from "@/components/cards/faq-card/faq-card";
import OrganizerCard from "@/components/cards/organizer-card/organizer-card";
import NewsCard from "@/components/cards/news-card/news-card";

export default function EventPage() {
  const { event } = useParams() as { event: string };

  return (
    <main>
      <BannerHead />
      <EventHead
        title="Tasty - Chocolat Show: Selzou + Les Kolons + Mk Neal + Katsu"
        location="1 Place de la Pointe, 93500 Pantin, France"
        date="dimanche 11 mai à 15:00"
        price={10.0}
        interested={12}
      />
      <section className="wrapper">
        <h2>Billet</h2>
        <button className="primary-btn">
          <span>Réserver</span>
        </button>
      </section>
      <section className="wrapper">
        <h2>À propos de l’évènement</h2>
        <p>
          ¡AFTER FURI SAUVAGE : Tau Car • Dasson • Adou ?  Après une soirée qui
          s’annonce d’ores et déjà incroyable, Furigana continue la fête à
          littéralement 10m en face du Cabaret Sauvage.   Le nouveau repaire,
          Babour Sauvage, accueillera de 6h à midi un plateau d’artilleurs de
          l’after. Aux commandes de la péniche, l’infatigable Tau Car qui nous
          fera le plaisir de prendre les platines pour la deuxième fois - énorme
          kiff d’after en prévision - et les fers de lance Furigana aka Dasson &
          Adou.   🫂 PROGRAMMATION 🫂  • TAU CAR •   SC :
          https://soundcloud.com/tau-car  IG :
          https://www.instagram.com/tau_car/  • DASSON •   SC :
          https://soundcloud.com/dasssssson  IG :
          https://www.instagram.com/dasssssson/  • ADOU •   SC :
          https://soundcloud.com/adou-musica  IG :
          https://www.instagram.com/adou.adou_/ After de la ¡Furi Sauvage? au
          Cabaret sauvage, avec Identified Patient B2B ??? • Tau Car • Medium
          Douce (live) •
          Thaïs  https://www.facebook.com/events/1317111756238992  📍 INFOS
          PRATIQUES 📍  🗓 Jeudi 8 mai (jour férié)   🕗 06h00 - 12h00  ⛵ Babour
          Sauvage (péniche face au Cabaret Sauvage)   📍 59 Boulevard Macdonald
          - Parc de la Villette - 75019 Paris  🚇 Métro 7 (Porte de la Villette)
          / Métro 5 (Porte de Pantin) / Tram (Ella Fitzgerald)  🏝𝗦𝗨𝗜𝗩𝗘𝗭 𝗡𝗢𝗨𝗦
          🏝  https://shotgun.live/fr/venues/1-2-3-sauvage  https://www.instagram.com/1.2.3.sauvage/  https://www.facebook.com/openairsauvage   𝘌𝘵
          𝘱𝘰𝘶𝘳 𝘴𝘶𝘪𝘷𝘳𝘦 𝘭𝘦𝘴 𝘢𝘤𝘵𝘪𝘷𝘪𝘵é𝘴 𝘥𝘦 𝘍𝘜𝘙𝘐𝘎𝘈𝘕𝘈 𝘤'𝘦𝘴𝘵 𝘪𝘤𝘪 ⤵️  IG :
          https://www.instagram.com/furigana_events/  SC :
          https://soundcloud.com/furigana  Créa by Mélanie Guitton -
          https://www.instagram.com/melanieguitton/
        </p>
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
      <section className="wrapper">
        <CustomTitle
          description="Actualités"
          title="Ces artistes font la Une"
        />
        <NewsCard
          title="Les 5 artistes émergeants qui font le show sur la Côte d’Azur"
          description="Magis reges hoc pertinacior inquam nulla arcesilas nata hoc diodorus erit coercendi maximas quod. Et effectrix tanto est quid est modo voluptatem autem tanto familiares actione et credo si.
Cum quis callipho credo tuus nulla est dicis sequuntur aegyptum interrete cum pullum constructio atqui etiam istud iste... En lire plus"
          date="25/04/2025"
        />
        <NewsCard
          title="Les 5 artistes émergeants qui font le show sur la Côte d’Azur"
          description="description courte le bouton ne s'affiche pas à voir si ça redirige vers une page ou ça affiche tout le texte"
          date="25/04/2025"
        />
      </section>
      <section className="wrapper">
        <h2>Organisé par</h2>
        <OrganizerCard name="Jean-Baptiste" />
        <button className="secondary-btn">
          <span>Signaler l’évènement</span>
        </button>
      </section>
    </main>
  );
}
