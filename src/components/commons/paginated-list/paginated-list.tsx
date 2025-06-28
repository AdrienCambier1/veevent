import { ReactNode, useRef } from "react";
import { PaginationInfo } from "@/types";
import Pagination from "@/components/commons/pagination/pagination";
import { Filter, Xmark } from "iconoir-react";
import { useFilters } from "@/contexts/filter-context";

interface PaginatedListProps<T> {
  // Données et état
  items: T[];
  loading: boolean;
  error: Error | null;
  pagination?: PaginationInfo;
  
  // Actions de pagination
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onPageChange: (page: number) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
  
  // Filtres
  hasActiveFilters?: boolean;
  onOpenFilters: () => void;
  
  // Rendu
  renderItem: (item: T, index: number) => ReactNode;
  renderEmpty?: () => ReactNode;
  renderLoading?: () => ReactNode;
  renderError?: (error: Error) => ReactNode;
  
  // Layout
  gridClassName?: string;
  showPagination?: boolean;
  showFilters?: boolean;
  title?: string;
  scrollTargetRef?: React.RefObject<HTMLElement | null>;
}

export default function PaginatedList<T>({
  items,
  loading,
  error,
  pagination,
  hasNextPage,
  hasPreviousPage,
  onPageChange,
  onPreviousPage,
  onNextPage,
  hasActiveFilters = false,
  onOpenFilters,
  renderItem,
  renderEmpty,
  renderLoading,
  renderError,
  gridClassName = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4",
  showPagination = true,
  showFilters = true,
  title,
  scrollTargetRef,
}: PaginatedListProps<T>) {
  const defaultScrollRef = useRef<HTMLElement>(null);
  const targetRef = scrollTargetRef || defaultScrollRef;

  // Ajout : gestion des tags de filtres actifs
  const { appliedFilters, removeFilterAndApply } = useFilters();

  // Mapping clé -> label lisible
  const filterLabels: Record<string, string> = {
    minPrice: "Prix min.",
    maxPrice: "Prix max.",
    startDate: "Date début",
    endDate: "Date fin",
    categories: "Type",
    cityName: "Ville",
    placeName: "Lieu",
    sortBy: "Tri",
    sortOrder: "Ordre",
  };

  // Générer la liste des tags à afficher
  const activeFilterTags = Object.entries(appliedFilters)
    .filter(([key, value]) => value !== undefined && value !== null && key !== "selectedCityObj" && key !== "selectedPlaceObj")
    .map(([key, value]) => {
      let label = filterLabels[key] || key;
      let displayValue = "";
      if (Array.isArray(value)) {
        displayValue = value.join(", ");
      } else if (typeof value === "string" || typeof value === "number") {
        displayValue = value.toString();
      }
      // Pour les dates, on peut améliorer le format si besoin
      if (key === "startDate" || key === "endDate") {
        label = key === "startDate" ? "Du" : "Au";
      }
      return {
        key,
        label,
        displayValue,
      };
    });

  // Handler pour retirer un filtre
  const handleRemoveFilter = (key: string) => {
    removeFilterAndApply(key);
  };

  // Rendu par défaut pour les états vides
  const defaultRenderEmpty = () => (
    <div className="text-center text-gray-500 py-8">
      <p>Aucun élément trouvé</p>
    </div>
  );

  const defaultRenderLoading = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="animate-pulse bg-gray-200 h-80 rounded-lg"></div>
      ))}
    </div>
  );

  const defaultRenderError = (error: Error) => (
    <div className="text-center text-red-500 py-8">
      <p>Erreur lors du chargement : {error.message}</p>
    </div>
  );

  return (
    <section className="wrapper" ref={targetRef}>
      {title && <h2>{title}</h2>}
      
      {showFilters && (
        <div className="flex flex-wrap gap-2 mb-2 items-center">
          <button
            onClick={onOpenFilters}
            className="rounded-full border font-semibold px-3 py-1 flex items-center gap-1 border-primary-600 text-primary-600"
          >
            <Filter className="text-xs" />
            filtres & tris
          </button>
          {/* Affichage des tags de filtres actifs */}
          {activeFilterTags.map((tag) => (
            <span
              key={tag.key}
              className="flex items-center gap-1 rounded-full bg-primary-600 text-white px-3 py-1 text-sm font-semibold cursor-pointer"
            >
              {tag.label}
              {tag.displayValue && `: ${tag.displayValue}`}
              <button
                className="ml-1 text-white hover:text-primary-200"
                onClick={() => handleRemoveFilter(tag.key)}
                aria-label={`Retirer le filtre ${tag.label}`}
                type="button"
              >
                <Xmark className="w-4 h-4" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Contenu principal */}
      {loading && (renderLoading?.() || defaultRenderLoading())}
      
      {error && (renderError?.(error) || defaultRenderError(error))}
      
      {!loading && !error && items.length > 0 && (
        <div className={gridClassName}>
          {items.map((item, index) => renderItem(item, index))}
        </div>
      )}
      
      {!loading && !error && items.length === 0 && hasActiveFilters && (
        <p>Aucun élément ne correspond à vos critères de filtrage.</p>
      )}
      
      {!loading && !error && items.length === 0 && !hasActiveFilters && 
        (renderEmpty?.() || defaultRenderEmpty())
      }

      {/* Pagination */}
      {showPagination && pagination && (
        <Pagination
          pagination={pagination}
          onPageChange={onPageChange}
          onPreviousPage={onPreviousPage}
          onNextPage={onNextPage}
          hasPreviousPage={hasPreviousPage}
          hasNextPage={hasNextPage}
        />
      )}
    </section>
  );
} 