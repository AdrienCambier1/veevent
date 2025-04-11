import InformationsCard from "@/components/cards/informations-card";
import { Calendar, Mail, PasswordCursor, User } from "iconoir-react";

export default function InformationsPage() {
  return (
    <div className="flex flex-col gap-6">
      <h3>Données du compte</h3>
      <div className="cards-grid">
        <InformationsCard
          icon={User}
          title="Nom et prénom"
          description="Jean Claude"
        />
        <InformationsCard
          icon={Calendar}
          title="Date de naissance"
          description="11/09/2001"
        />
        <InformationsCard
          icon={Mail}
          title="Email"
          description="jeanclaude@gmail.com"
        />
        <InformationsCard
          icon={PasswordCursor}
          title="Mot de passe"
          description="Dernière mise à jour : 01/01/2023"
        />
      </div>
    </div>
  );
}
