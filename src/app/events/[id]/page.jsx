"use client";
import { useParams } from "next/navigation";
import Image from "next/image";
import niceImage from "@/assets/images/nice.jpg";
import {
  Bookmark,
  Calendar,
  Check,
  Group,
  HomeAltSlim,
  MapPin,
} from "iconoir-react";
import ThemeTags from "@/components/theme-tags";
import ProfilCard from "@/components/cards/profil-card";
import ItemList from "@/components/lists/item-list";
import TicketCard from "@/components/cards/ticket-card";
import DialogModal from "@/components/modals/dialog-modal";
import Link from "next/link";
import { useState } from "react";
import PaymentModal from "@/components/modals/payment-modal";

export default function EventPage() {
  const { id } = useParams();
  const [paymentModal, setPaymentModal] = useState(false);
  const [paymentDialogModal, setPaymentDialogModal] = useState(false);

  const eventInfos = [
    { icon: Calendar, value: "samedi 24 juin 2025 • 15h30 " },
    { icon: HomeAltSlim, value: "Los pollos hermanos" },
    { icon: Group, value: "8 personnes", type: "users" },
  ];

  const placeInfos = [
    { icon: MapPin, value: "Antibes, Juan los Pinos, 06160" },
    { icon: HomeAltSlim, value: "Los pollos hermanos" },
  ];

  return (
    <>
      <main>
        <section className="event-grid">
          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-2">
              <h1>Atelier fresque végétal</h1>
              <p>
                Organisé par <span className="dark-text">Jean Claude</span>
              </p>
            </div>
            <ItemList items={eventInfos} />
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <button className="primary-btn">
                <span>S'inscrire à l'événement</span>
              </button>
              <button className="blue-rounded-btn">
                <span>Enregistrer l'événement</span>
                <Bookmark />
              </button>
            </div>
          </div>
          <Image src={niceImage} alt="Event image" className="banner" />
        </section>
        <section className="page-grid">
          <div className="flex flex-col gap-12 lg:col-span-2">
            <div className="flex flex-col gap-6">
              <h2>Description de l'événement</h2>
              <p>
                Le Festival de la Fresque Végétale revient cette année pour une
                édition encore plus spectaculaire ! Pendant quatre jours,
                artistes botaniques, paysagistes et passionnés de nature uniront
                leur créativité pour donner vie à des fresques monumentales
                réalisées exclusivement à partir de plantes, mousses et fleurs
                locales. 🖌️ Création en direct : Assistez à la conception d’une
                fresque végétale de 20 mètres de long, illustrant l’harmonie
                entre l’homme et la nature, façonnée à partir de lichen, de
                fougères et de pétales soigneusement sélectionnés. 🌺 Ateliers
                participatifs : Initiez-vous à l’art de la fresque verte en
                apprenant à composer de petites œuvres murales avec du végétal
                stabilisé et des substrats naturels. 🌿 Conférences & rencontres
                : Experts en permaculture et en art écologique partageront leur
                savoir lors de conférences sur l’impact positif des fresques
                végétales en milieu urbain. 🎶 Ambiance immersive : Chaque soir,
                des concerts acoustiques et des performances de danse
                contemporaine viendront sublimer les créations végétales dans
                une atmosphère féerique. 🥗 Espace gourmand : Découvrez des
                saveurs locales et responsables avec nos stands de restauration
                bio et zéro déchet. Que vous soyez artiste en herbe, amoureux de
                la nature ou simple curieux, laissez-vous émerveiller par cette
                célébration unique du vivant ! 🌱✨
              </p>
            </div>
            <div className="flex flex-col gap-6">
              <h2>Tags</h2>
              <ThemeTags
                theme={["Musique", "Sponsorisé", "Sport", "Learning"]}
              />
            </div>
            <div className="flex flex-col gap-6">
              <h2>Lieu</h2>
              <ItemList items={placeInfos} />
            </div>
            <ProfilCard
              className="relative translate-y-0"
              name="Jean Claude"
              id="@jeanclaudedu06"
              note={4}
              isOrganiser={true}
            />
          </div>
          <div className="flex flex-col gap-6">
            <h2>Billets</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
              <TicketCard
                title="Billet Eco+"
                description="Billet pour les rats+, tu vas finir debout"
                price={43}
                onClick={() => setPaymentModal(true)}
              />
              <TicketCard
                title="Billet bourgeoisie"
                description="Les riches ont le droit à une chaise en bois"
                price={44}
                onClick={() => setPaymentModal(true)}
              />
            </div>
          </div>
        </section>
      </main>
      <PaymentModal
        isOpen={paymentModal}
        setIsOpen={() => setPaymentModal(false)}
        onClick={() => setPaymentDialogModal(true)}
        ticket="Billet Eco+"
        price={43}
      />
      <DialogModal
        title="Achat effectué"
        isOpen={paymentDialogModal}
        setIsOpen={() => setPaymentDialogModal(false)}
        icon={Check}
        description={
          <>
            L'achat de votre billet pour l'événement{" "}
            <span className="dark-text">Atelier fresque végétal</span> a bien
            été effectué. <br /> Retrouver votre billet dans la rubrique{" "}
            <Link
              href="/account/profil/participations"
              className="blue-text underline"
            >
              Mes inscriptions
            </Link>
            .
          </>
        }
      />
    </>
  );
}
