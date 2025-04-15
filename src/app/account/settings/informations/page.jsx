"use client";
import InformationsCard from "@/components/cards/informations-card";
import { User, Calendar, Mail, Lock } from "iconoir-react";
import SettingsModal from "@/components/modals/settings-modal";
import { useState } from "react";

export default function InformationsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("name");

  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <h3>Données du compte</h3>
        <div className="cards-grid">
          <InformationsCard
            icon={User}
            title="Nom et prénom"
            description="Jean Claude"
            onClick={() => openModal("name")}
          />
          <InformationsCard
            icon={Calendar}
            title="Date de naissance"
            description="11/09/2001"
            onClick={() => openModal("birthdate")}
          />
          <InformationsCard
            icon={Mail}
            title="Email"
            description="jeanclaude@gmail.com"
            onClick={() => openModal("email")}
          />
          <InformationsCard
            icon={Lock}
            title="Mot de passe"
            description="Dernière mise à jour : 01/01/2023"
            onClick={() => openModal("password")}
          />
        </div>
      </div>
      <SettingsModal
        isOpen={isModalOpen}
        setIsOpen={() => setIsModalOpen(false)}
        type={modalType}
      />
    </>
  );
}
