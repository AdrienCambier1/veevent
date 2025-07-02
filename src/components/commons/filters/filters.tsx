import DateFilter from "./date-filter/date-filter";
import FavoriteFilter from "./favorite-filter/favorite-filter";
import "./filters.scss";
import PriceFilter from "./price-filter/price-filter";
import CityFilter from "./city-filter/city-filter";
import PlaceFilter from "./place-filter/place-filter";
import SortBy from "./sort-by/sort-by";
import RateFilter from "./rate-filter/rate-filter";
import CategoriesFilter from "./categories-filter/categories-filter";

interface FiltersProps {
  hideCityFilter?: boolean;
  hidePlaceFilter?: boolean;
  cityName?: string;
}

export default function Filters({
  hideCityFilter = false,
  hidePlaceFilter = false,
  cityName,
}: FiltersProps) {
  return (
    <div className="filters">
      <div className="filters-item w-full p-4 md:p-6 flex flex-col gap-3 md:gap-4">
        <div className="title text-lg md:text-xl font-semibold">Trier par</div>
        <SortBy />
      </div>
      {/* <div className="filters-item w-full p-4 md:p-6 flex flex-col gap-3 md:gap-4">
        <div className="title text-lg md:text-xl font-semibold">Nos recommandations</div>
        <FavoriteFilter />
      </div> */}
      <div className="filters-item">
        <DateFilter />
      </div>
      <div className="filters-item">
        <PriceFilter />
      </div>
      <div className="filters-item w-full p-4 md:p-6 flex flex-col gap-3 md:gap-4">
        <CategoriesFilter />
      </div>
      {!hideCityFilter && (
        <div className="filters-item w-full p-4 md:p-6 flex flex-col gap-3 md:gap-4">
          <div className="title text-lg md:text-xl font-semibold">Villes</div>
          <CityFilter />
        </div>
      )}
      {!hidePlaceFilter && (
        <div className="filters-item w-full p-4 md:p-6 flex flex-col gap-3 md:gap-4">
          <div className="title text-lg md:text-xl font-semibold">Lieux</div>
          <PlaceFilter cityName={cityName} />
        </div>
      )}
      {/* <div className="filters-item w-full p-4 md:p-6 flex flex-col gap-3 md:gap-4">
        <div className="title text-lg md:text-xl font-semibold">Note de l'organisateur</div>
        <RateFilter />
      </div> */}
    </div>
  );
}
