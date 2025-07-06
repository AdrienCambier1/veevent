"use client";
import { useHeader } from "@/contexts/header-context";
import { useUser } from "@/hooks/commons/use-user";
import { NavArrowRight, Trash, User, ArrowLeft } from "iconoir-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import "./parametres.scss";

interface SettingsSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  items: SettingsItem[];
}

interface SettingsItem {
  id: string;
  title: string;
  subtitle?: string;
  href: string;
  type: "navigation" | "toggle" | "action";
  value?: string | boolean;
  danger?: boolean;
}

export default function ParametresPage() {
  const { setHideCitySelector } = useHeader();
  const { user } = useUser();
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    setHideCitySelector(true);
    return () => setHideCitySelector(false);
  }, [setHideCitySelector]);

  const isOrganizer = user?.role === "Organizer" || user?.role === "Admin";

  const settingsSections: SettingsSection[] = [
    {
      id: "account",
      title: "Compte",
      icon: <User />,
      items: [
        {
          id: "profile",
          title: "Profil",
          subtitle: "Modifier vos informations personnelles",
          href: "/compte/parametres/profil",
          type: "navigation"
        },
        {
          id: "password",
          title: "Mot de passe",
          subtitle: "Changer votre mot de passe",
          href: "/compte/parametres/mot-de-passe",
          type: "navigation"
        },
        {
          id: "organizer",
          title: "Devenir organisateur",
          subtitle: isOrganizer ? "Vous êtes déjà organisateur" : "Demander le statut d'organisateur",
          href: "/compte/parametres/organisateur",
          type: "navigation",
          value: isOrganizer ? "Actif" : undefined
        }
      ]
    },
    // {
    //   id: "preferences",
    //   title: "Préférences",
    //   icon: <Palette />,
    //   items: [
    //     {
    //       id: "notifications",
    //       title: "Notifications",
    //       subtitle: "Gérer vos notifications",
    //       href: "/compte/parametres/notifications",
    //       type: "navigation"
    //     },
    //     {
    //       id: "location",
    //       title: "Localisation",
    //       subtitle: "Paramètres de géolocalisation",
    //       href: "/compte/parametres/localisation",
    //       type: "navigation"
    //     },
    //     {
    //       id: "language",
    //       title: "Langue",
    //       subtitle: "Français",
    //       href: "/compte/parametres/langue",
    //       type: "navigation",
    //       value: "Français"
    //     }
    //   ]
    // },
    // {
    //   id: "security",
    //   title: "Sécurité",
    //   icon: <Shield />,
    //   items: [
    //     {
    //       id: "sessions",
    //       title: "Sessions actives",
    //       subtitle: "Gérer vos connexions",
    //       href: "/compte/parametres/sessions",
    //       type: "navigation"
    //     },
    //     {
    //       id: "privacy",
    //       title: "Confidentialité",
    //       subtitle: "Paramètres de confidentialité",
    //       href: "/compte/parametres/confidentialite",
    //       type: "navigation"
    //     }
    //   ]
    // },
    {
      id: "danger",
      title: "Clôture",
      icon: <Trash />,
      items: [
        {
          id: "delete",
          title: "Supprimer le compte",
          subtitle: "Supprimer définitivement votre compte",
          href: "/compte/parametres/supprimer",
          type: "navigation",
          danger: true
        }
      ]
    }
  ];

  return (
    <div className="wrapper py-8 parametres-page">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              href="/compte/tickets"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Retour au profil</span>
            </Link>
          </div>
          <h1 className="text-3xl font-bold mb-2">Paramètres</h1>
          <p className="text-gray-600">Gérez vos préférences et votre compte</p>
        </div>

        {/* Settings List */}
        <div className="settings-list">
          {settingsSections.map((section) => (
            <div key={section.id} className="settings-section">
              <div className="section-header">
                <div className="section-icon">
                  {section.icon}
                </div>
                <h2 className="section-title">{section.title}</h2>
              </div>
              
              <div className="section-items">
                {section.items.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`settings-item ${item.danger ? 'danger' : ''}`}
                  >
                    <div className="item-content">
                      <div className="item-info">
                        <h3 className="item-title">{item.title}</h3>
                        {item.subtitle && (
                          <p className="item-subtitle">{item.subtitle}</p>
                        )}
                      </div>
                      
                      <div className="item-action">
                        {item.value && (
                          <span className="item-value">{item.value}</span>
                        )}
                        <NavArrowRight className="chevron-icon" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Veevent v1.0.0</p>
          <p className="mt-1">© {new Date().getFullYear()} - Tous droits réservés</p>
        </div>
      </div>
    </div>
  );
} 