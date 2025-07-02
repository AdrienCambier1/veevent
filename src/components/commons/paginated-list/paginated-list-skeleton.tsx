import EventCardSkeleton from "@/components/cards/event-card/event-card-skeleton";

interface PaginatedListSkeletonProps {
  itemCount?: number;
  columns?: {
    base?: number;
    sm?: number;
    md?: number;
    lg?: number;
  };
  useEventCardSkeleton?: boolean;
  layout?: "grid" | "horizontal";
}

export default function PaginatedListSkeleton({
  itemCount = 8,
  columns = {
    base: 1,
    sm: 2,
    md: 3,
    lg: 4,
  },
  useEventCardSkeleton = true,
  layout = "grid",
}: PaginatedListSkeletonProps) {
  // Utilisation de classes Tailwind statiques pour éviter les problèmes de génération
  const getGridClass = () => {
    const { base = 1, sm = 2, md = 3, lg = 4 } = columns;

    if (base === 1 && sm === 2 && md === 3 && lg === 4) {
      return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
    }
    if (base === 2 && sm === 3 && md === 5 && lg === 5) {
      return "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5";
    }
    if (base === 1 && sm === 1 && md === 2 && lg === 3) {
      return "grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
    }
    // Par défaut
    return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
  };

  // Layout horizontal similaire aux sections HorizontalList
  if (layout === "horizontal") {
    return (
      <div
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {Array.from({ length: itemCount }, (_, i) => (
          <div key={i} className="flex-shrink-0" style={{ width: "280px" }}>
            {useEventCardSkeleton ? (
              <EventCardSkeleton />
            ) : (
              <div className="skeleton-bg h-80"></div>
            )}
          </div>
        ))}
      </div>
    );
  }

  // Layout grille par défaut
  return (
    <div className={`${getGridClass()} gap-4 md:gap-6`}>
      {Array.from({ length: itemCount }, (_, i) =>
        useEventCardSkeleton ? (
          <EventCardSkeleton key={i} />
        ) : (
          <div key={i} className="skeleton-bg h-80"></div>
        )
      )}
    </div>
  );
}
