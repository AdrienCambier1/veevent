import SelectorThemeTags from "@/components/tags/selector-theme-tags/selector-theme-tags";
import DateFilter from "./date-filter/date-filter";
import FavoriteFilter from "./favorite-filter/favorite-filter";
import "./filters.scss";
import PriceFilter from "./price-filter/price-filter";
import SearchFilter from "./search-filter/search-filter";
import SortBy from "./sort-by/sort-by";
import { SearchFilterOption } from "@/types";
import RateFilter from "./rate-filter/rate-filter";

export default function Filters() {
  const cities: SearchFilterOption[] = [
    { name: "Nice", eventCount: 38 },
    { name: "Antibes", eventCount: 14 },
    { name: "Cannes", eventCount: 23 },
    { name: "Paris", eventCount: 85 },
    { name: "Lyon", eventCount: 42 },
    { name: "Marseille", eventCount: 29 },
  ];

  const places: SearchFilterOption[] = [
    { name: "Théâtre de Nice", eventCount: 12 },
    { name: "Salle Miroir", eventCount: 8 },
    { name: "Palais des Festivals", eventCount: 15 },
    { name: "Opéra de Nice", eventCount: 6 },
    { name: "Centre Culturel", eventCount: 9 },
  ];

  const themes = [
    "Art",
    "Nature",
    "Technology",
    "Science",
    "History",
    "Music",
    "Literature",
    "Sports",
    "Travel",
    "Food",
    "Fashion",
    "Health",
    "Education",
  ];
  return (
    <div className="filters">
      <div className="filters-item  w-full max-w-lg p-4 flex flex-col gap-3">
        <div className="title">Trier par</div>
        <SortBy />
      </div>
      <div className="filters-item  w-full max-w-lg p-4 flex flex-col gap-3">
        <div className="title">Nos recommandations</div>
        <FavoriteFilter />
      </div>
      <div className="filters-item">
        <DateFilter />
      </div>
      <div className="filters-item">
        <PriceFilter />
      </div>
      <div className="filters-item w-full max-w-lg p-4 flex flex-col gap-3">
        <div className="flex flex-col">
          <div className="title">Catégories</div>
        </div>
        <SelectorThemeTags availableThemes={themes} />
      </div>
      <div className="filters-item w-full max-w-lg p-4 flex flex-col gap-3">
        <div className="title">Villes</div>
        <SearchFilter
          options={cities}
          placeholder="Rechercher une ville"
          countLabel="événements"
          onSelectionChange={(city) => console.log("Ville sélectionnée:", city)}
        />
      </div>
      <div className="filters-item w-full max-w-lg p-4 flex flex-col gap-3">
        <div className="title">Lieux</div>
        <SearchFilter
          options={places}
          placeholder="Rechercher un lieu"
          countLabel="événements"
          onSelectionChange={(place) => console.log("Lieu sélectionné:", place)}
        />
      </div>

      <div className="filters-item w-full max-w-lg p-4 flex flex-col gap-3">
        <div className="title">Note de l'organisateur</div>
        <RateFilter />
      </div>
    </div>
  );
}
