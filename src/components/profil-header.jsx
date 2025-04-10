import Link from "next/link";
import { NavArrowRight } from "iconoir-react";

export default function ProfilHeader({ redirect }) {
  return (
    <section className="profil-header">
      <div>
        <div>
          <p>Abonnements</p>
          <p className="heavy">28</p>
        </div>
        <div>
          <p>Abonnés</p>
          <p className="heavy">12</p>
        </div>
        <div>
          <p>Veevent organisés</p>
          <p className="heavy">3</p>
        </div>
        <div>
          <p className="truncate">Veevent participés</p>
          <p className="heavy">3</p>
        </div>
      </div>
      {redirect === "settings" && (
        <Link href="/account/settings" className="primary-btn">
          <span>Mes informations</span>
          <NavArrowRight />
        </Link>
      )}
      {redirect === "profil" && (
        <Link href="/account/profil/events" className="primary-btn">
          <span>Mon activité</span>
          <NavArrowRight />
        </Link>
      )}
    </section>
  );
}
