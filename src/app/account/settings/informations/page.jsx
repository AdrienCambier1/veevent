"use client";
import InformationsCard from "@/components/cards/informations-card";
import { User, Calendar, Mail, Lock } from "iconoir-react";
import SettingsModal from "@/components/modals/settings-modal";
import { useState } from "react";

export default function InformationsPage() {
  const [nameModal, setNameModal] = useState(false);
  const [birthDateModal, setBirthDateModal] = useState(false);
  const [emailModal, setEmailModal] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-6">
        <h3>Données du compte</h3>
        <div className="cards-grid">
          <InformationsCard
            icon={User}
            title="Nom et prénom"
            description="Jean Claude"
            onClick={() => setNameModal(true)}
          />
          <InformationsCard
            icon={Calendar}
            title="Date de naissance"
            description="11/09/2001"
            onClick={() => setBirthDateModal(true)}
          />
          <InformationsCard
            icon={Mail}
            title="Email"
            description="jeanclaude@gmail.com"
            onClick={() => setEmailModal(true)}
          />
          <InformationsCard
            icon={Lock}
            title="Mot de passe"
            description="Dernière mise à jour : 01/01/2023"
            onClick={() => setPasswordModal(true)}
          />
        </div>
      </div>
      <SettingsModal
        isOpen={nameModal}
        setIsOpen={() => setNameModal(false)}
        type="name"
      />
      <SettingsModal
        isOpen={birthDateModal}
        setIsOpen={() => setBirthDateModal(false)}
        type="birthdate"
      />
      <SettingsModal
        isOpen={emailModal}
        setIsOpen={() => setEmailModal(false)}
        type="email"
      />
      <SettingsModal
        isOpen={passwordModal}
        setIsOpen={() => setPasswordModal(false)}
        type="password"
      />
    </>
  );
}
