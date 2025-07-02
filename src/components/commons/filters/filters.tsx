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
      <div className="filters-item">
        <div className="title">Trier par</div>
        <SortBy />
      </div>
      {/* <div className="filters-item">
        <div className="title">Nos recommandations</div>
        <FavoriteFilter />
      </div> */}
      <div className="filters-item">
        <div className="title">Dates</div>
        <DateFilter />
      </div>
      <div className="filters-item">
        <div className="title">Prix</div>
        <PriceFilter />
      </div>
      <div className="filters-item">
        <CategoriesFilter />
      </div>
      {!hideCityFilter && (
        <div className="filters-item">
          <div className="title">Villes</div>
          <CityFilter />
        </div>
      )}
      {!hidePlaceFilter && (
        <div className="filters-item">
          <div className="title">Lieux</div>
          <PlaceFilter cityName={cityName} />
        </div>
      )}
      {/* <div className="filters-item">
        <div className="title">Note de l'organisateur</div>
        <RateFilter />
      </div> */}
    </div>
  );
}
