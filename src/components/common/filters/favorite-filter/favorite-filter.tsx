import { Bookmark, Map, StatUp, UserStar } from "iconoir-react";
import { useState } from "react";
import "./favorite-filter.scss";

export default function FavoriteFilter() {
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const filters = [
    { id: "few-places", icon: StatUp, label: "Peu de places disponibles" },
    { id: "popular", icon: UserStar, label: "Organisateurs populaires" },
    { id: "nearby", icon: Map, label: "Proche de chez vous" },
    { id: "saved", icon: Bookmark, label: "Enregistrés" },
  ];

  return (
    <div className="favorite-filter">
      {filters.map((filter) => {
        const IconComponent = filter.icon;
        return (
          <div
            key={filter.id}
            className={`favorite-filter-item ${
              selectedFilter === filter.id ? "selected" : ""
            }`}
            onClick={() =>
              setSelectedFilter(selectedFilter === filter.id ? null : filter.id)
            }
          >
            <div className="item-icon">
              <IconComponent />
            </div>
            <div>{filter.label}</div>
          </div>
        );
      })}
    </div>
  );
}
