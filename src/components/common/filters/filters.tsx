import DateFilter from "./date-filter/date-filter";
import PriceFilter from "./price-filter/price-filter";
import "./filters.scss";
import SelectorThemeTags from "@/components/tags/selector-theme-tags/selector-theme-tags";

export default function Filters() {
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
    </div>
  );
}
