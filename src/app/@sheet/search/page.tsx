"use client";
import EventCard from "@/components/cards/event-card/event-card";
import OrganizerPhotoCard from "@/components/cards/organizer-photo-card/organizer-photo-card";
import TextImageCard from "@/components/cards/text-image-card/text-image-card";
import ThemeCard from "@/components/cards/theme-card/theme-card";
import { Drawer } from "vaul";
import SearchInput from "@/components/inputs/search-input/search-input";
import { useSearch } from "@/hooks/commons/use-search";
import { useEvents } from "@/hooks/events/use-events";
import { categoryService } from "@/services/category-service";
import { Category } from "@/types";
import { ArrowUpRight, GraphUp } from "iconoir-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import EventCardSkeleton from "@/components/cards/event-card/event-card-skeleton";
import ThemeCardSkeleton from "@/components/cards/theme-card/theme-card-skeleton";
import TrendingCardSkeleton from "@/components/cards/trending-card/trending-card-skeleton";

function SearchSheetContent() {
  const router = useRouter();

  const searchParams = useSearchParams()!;
  const initialQuery = searchParams.get("q") || "";
  const { query, setQuery, results, loading, error } = useSearch({
    initialQuery,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const {
    events: trendingEvents,
    loading: loadingTrending,
    error: errorTrending,
  } = useEvents("trending");

  useEffect(() => {
    if (!query) {
      categoryService.getCategories().then(setCategories);
    }
  }, [query]);
  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // Supprimer les caractères spéciaux
      .replace(/\s+/g, "-") // Remplacer les espaces par des tirets
      .replace(/-+/g, "-") // Remplacer les tirets multiples par un seul
      .trim(); // Supprimer les espaces au début et à la fin
  };

  // Regrouper les résultats par type
  const grouped = results.reduce((acc, item) => {
    const type = item.type;
    if (!acc[type]) acc[type] = [];
    acc[type].push(item);
    return acc;
  }, {} as Record<string, any[]>);

  const typeLabels: Record<string, string> = {
    event: "Événements",
    city: "Villes",
    place: "Lieux",
    user: "Organisateurs",
  };

  const typeOrder = ["event", "city", "place", "user"];

  // Handler pour les liens "Voir plus" et toutes les cards
  const handleSheetNavigation = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    router.back();
    setTimeout(() => {
      router.push(href);
    }, 100); // Délai minimal pour l'animation
  };

  return (
    <Drawer.Root open={true} onOpenChange={(open) => !open && router.back()}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Drawer.Content className="bg-white flex flex-col rounded-t-[20px] h-[80vh] mt-24 fixed bottom-0 left-0 right-0 w-full z-50">
          <div className="p-4 bg-white rounded-t-[20px] flex-1 overflow-y-auto">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-8" />
            <div className="w-full max-w-4xl mx-auto flex flex-col gap-4">
              <h2 className="text-xl md:text-2xl font-bold">
                Recherchez ce qui vous intéresse
              </h2>
              <SearchInput
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Recherchez des événements, des lieux, des villes..."
              />
        {(!query || query.trim() === "") && (
          <>
            {trendingEvents.length > 0 && (
              <div
                className="rounded-[var(--vv-border-radius)] overflow-hidden relative p-3 md:p-6 flex flex-col gap-2 md:gap-4"
                style={{
                  backgroundImage: `url('./trending.png')`,
                  backgroundSize: "cover",
                  backgroundPosition: "bottom",
                  minHeight: "200px",
                }}
              >
                <div className="flex items-center gap-2 font-bold text-white text-lg md:text-xl">
                  <GraphUp className="text-base md:text-lg" />
                  Tendances
                </div>

                <div className="flex flex-col gap-2 py-2">
                  {trendingEvents.slice(0, 3).map((event, idx) => (
                    <Link
                      key={event.id}
                      href={`/evenements/${event.id}/${slugify(event.name)}`}
                      onClick={handleSheetNavigation(
                        `/evenements/${event.id}/${slugify(event.name)}`
                      )}
                      className="flex items-center justify-between rounded-[var(--vv-border-radius)] bg-white/20 hover:bg-white/30 transition-colors text-sm md:text-base font-medium text-white backdrop-blur-sm px-3 md:px-4 py-2 md:py-3"
                    >
                      <span className="text-ellipsis overflow-hidden whitespace-nowrap">
                        {event.name}
                      </span>
                      <ArrowUpRight className="text-sm md:text-base flex-shrink-0 ml-2" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 mt-4">
              {categories.map((cat) => (
                <ThemeCard key={cat.key} category={cat} />
              ))}
            </div>
          </>
        )}
        {loading && (
          <>
            {/* Skeletons tendances */}
            <div className="flex flex-col gap-2 mb-4">
              {[...Array(3)].map((_, i) => (
                <TrendingCardSkeleton key={i} />
              ))}
            </div>
            {/* Skeletons catégories */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 mb-4">
              {[...Array(6)].map((_, i) => (
                <ThemeCardSkeleton key={i} />
              ))}
            </div>
            {/* Skeletons résultats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 p-0 list-none">
              {[...Array(6)].map((_, i) => (
                <EventCardSkeleton key={i} />
              ))}
            </div>
          </>
        )}
        {error && (
          <div className="text-red-500 p-4 bg-red-50 rounded-lg">{error}</div>
        )}
        {!loading && !error && query && results.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] w-full">
            <div className="text-lg md:text-xl font-semibold text-gray-500 text-center px-4">
              Aucun résultat trouvé pour "{query}"
            </div>
            <p className="text-sm md:text-base text-gray-400 mt-2 text-center px-4">
              Essayez avec d'autres mots-clés
            </p>
          </div>
        )}
        {!loading && !error && results.length > 0 && (
          <div className="mt-6">
            {typeOrder
              .filter((type) => grouped[type])
              .map((type) => {
                const items = grouped[type] as any[];
                const showVoirPlus =
                  items.length >
                  (type === "user" ? 8 : type === "event" ? 8 : 10);
                let voirPlusHref = "";
                if (type === "event") voirPlusHref += "/evenements";
                else if (type === "city") voirPlusHref += "/villes";
                else if (type === "place") voirPlusHref += "/lieux";
                else if (type === "user") voirPlusHref += "/organisateurs";
                if (query && query.trim() !== "") {
                  voirPlusHref += `?q=${encodeURIComponent(query)}`;
                }
                return (
                  <div key={type} className="mb-8">
                    <h2 className="capitalize mb-3 md:mb-4 text-lg md:text-xl font-semibold">
                      {typeLabels[type] || type}
                    </h2>
                    {type === "user" && (
                      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 md:gap-4 p-0 list-none">
                        {items.slice(0, 8).map((item: any, idx: number) => (
                          <li key={idx}>
                            <div
                              onClick={handleSheetNavigation(
                                `/organisateurs/${item.user.pseudo}`
                              )}
                              style={{ cursor: "pointer" }}
                            >
                              <OrganizerPhotoCard
                                name={
                                  item.user.firstName + " " + item.user.lastName
                                }
                                imageUrl={item.user.imageUrl || ""}
                                href={`/organisateurs/${item.user.pseudo}`}
                              />
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                    {type === "event" && (
                      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 p-0 list-none">
                        {items.slice(0, 8).map((item: any, idx: number) => (
                          <li key={idx}>
                            <div
                              onClick={handleSheetNavigation(
                                `/evenements/${item.event.id}/${slugify(
                                  item.event.name
                                )}`
                              )}
                              style={{ cursor: "pointer" }}
                            >
                              <EventCard
                                id={item.event.id.toString()}
                                event={item.event}
                                minify
                              />
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                    {(type === "city" || type === "place") && (
                      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 p-0 list-none">
                        {items.slice(0, 10).map((item: any, idx: number) => (
                          <li key={idx}>
                            <div
                              onClick={handleSheetNavigation(
                                `/${type === "city" ? "villes" : "lieux"}/${
                                  type === "city"
                                    ? item.city.slug
                                    : item.place.slug
                                }`
                              )}
                              style={{ cursor: "pointer" }}
                            >
                              <TextImageCard
                                title={
                                  type === "city"
                                    ? item.city.name
                                    : item.place.name
                                }
                                image={
                                  type === "city"
                                    ? item.city.imageUrl
                                    : item.place.imageUrl
                                }
                                href={`/${
                                  type === "city" ? "villes" : "lieux"
                                }/${
                                  type === "city"
                                    ? item.city.slug
                                    : item.place.slug
                                }`}
                              />
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                    {showVoirPlus && (
                      <div className="mt-4 flex justify-center md:justify-end">
                        <Link
                          href={voirPlusHref}
                          onClick={handleSheetNavigation(voirPlusHref)}
                          className="inline-block px-4 md:px-6 py-2 md:py-3 rounded-full bg-primary-100 text-primary-700 font-semibold text-sm md:text-base hover:bg-primary-200 transition-colors"
                        >
                          Voir plus (
                          {items.length -
                            (type === "user"
                              ? 8
                              : type === "event"
                              ? 8
                              : 10)}{" "}
                          de plus)
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        )}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

export default function SearchSheet() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <SearchSheetContent />
    </Suspense>
  );
}
