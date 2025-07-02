interface PaginatedListSkeletonProps {
  itemCount?: number;
  columns?: {
    base?: number;
    sm?: number;
    md?: number;
    lg?: number;
  };
  itemHeight?: string;
}

export default function PaginatedListSkeleton({
  itemCount = 8,
  columns = {
    base: 1,
    sm: 2,
    md: 3,
    lg: 4,
  },
  itemHeight = "h-80",
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

  return (
    <div className={`${getGridClass()} gap-4`}>
      {Array.from({ length: itemCount }, (_, i) => (
        <div key={i} className={`skeleton-bg ${itemHeight}`}></div>
      ))}
    </div>
  );
}
