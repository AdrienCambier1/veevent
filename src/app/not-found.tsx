"use client";
import Link from "next/link";
import * as Iconoir from "iconoir-react";
import { usePageTitle } from "@/hooks/commons/use-page-title";
import { PAGE_TITLES } from "@/utils/page-titles";

export default function NotFound() {
  // Gestion dynamique du titre de la page
  usePageTitle(PAGE_TITLES.error.notFound);
  
  return (
    <main>
      <div className="wrapper">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          {/* Icône 404 stylisée */}
          <div className="relative mb-8">
            <div className="w-32 h-32 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mb-4">
              <Iconoir.Search
                className="w-16 h-16 text-primary-600"
                strokeWidth={1.5}
              />
            </div>
          </div>

          {/* Titre principal */}
          <h1 className="text-4xl md:text-6xl font-bold text-primary-600 mb-4">
            404
          </h1>

          {/* Sous-titre */}
          <h2 className="text-xl md:text-2xl font-semibold text-primary-900 mb-4">
            Page introuvable
          </h2>

          {/* Description */}
          <p className="text-gray-600 max-w-md mb-8 leading-relaxed">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
            Elle a peut-être été supprimée ou l'URL est incorrecte.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
            <Link href="/" className="primary-btn">
              <Iconoir.Home className="icon" />
              <span>Accueil</span>
            </Link>

            <Link href="/evenements" className="secondary-btn">
              <Iconoir.Calendar className="icon" />
              <span>Événements</span>
            </Link>
          </div>

          {/* Liens utiles */}
          <div className="mt-12 pt-8 border-t border-gray-200 w-full max-w-md">
            <p className="text-sm text-gray-500 mb-4">
              Vous pouvez aussi essayer :
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link
                href="/lieux"
                className="text-primary-600 hover:text-primary-700 transition-colors"
              >
                Découvrir les lieux
              </Link>
              <Link
                href="/organisateurs"
                className="text-primary-600 hover:text-primary-700 transition-colors"
              >
                Voir les organisateurs
              </Link>
              <Link
                href="/villes"
                className="text-primary-600 hover:text-primary-700 transition-colors"
              >
                Explorer les villes
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
