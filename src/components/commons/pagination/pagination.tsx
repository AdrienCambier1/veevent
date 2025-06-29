import { PaginationInfo } from "@/types";

interface PaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export default function Pagination({
  pagination,
  onPageChange,
  onPreviousPage,
  onNextPage,
  hasPreviousPage,
  hasNextPage,
}: PaginationProps) {
  if (pagination.totalPages <= 1) {
    return null;
  }

  // Fonction pour générer les numéros de page à afficher (max 5 bulles)
  const getPageNumbers = () => {
    const { totalPages, number } = pagination;
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      // Si 5 pages ou moins, afficher toutes
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Logique pour plus de 5 pages
      if (number <= 2) {
        // Près du début : afficher les 3 premières + ... + dernière
        pages.push(0, 1, 2, "...", totalPages - 1);
      } else if (number >= totalPages - 3) {
        // Près de la fin : afficher première + ... + 3 dernières
        pages.push(0, "...", totalPages - 3, totalPages - 2, totalPages - 1);
      } else {
        // Au milieu : afficher première + ... + page courante + ... + dernière
        pages.push(0, "...", number, "...", totalPages - 1);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col items-center gap-4 mt-8">
      {/* Contrôles de pagination */}
      <div className="flex justify-center items-center gap-4">
        <button
          onClick={onPreviousPage}
          disabled={!hasPreviousPage}
          className={`px-4 py-2 rounded-lg border transition-colors ${
            hasPreviousPage
              ? "border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white"
              : "border-gray-300 text-gray-400 cursor-not-allowed"
          }`}
        >
          Précédent
        </button>
        
        {/* Numéros de page - masqués sur smartphone */}
        <div className="hidden md:flex items-center gap-2">
          {pageNumbers.map((page, index) => (
            <div key={index}>
              {page === "..." ? (
                <span className="px-3 py-1 text-gray-500">...</span>
              ) : (
                <button
                  onClick={() => onPageChange(page as number)}
                  className={`px-3 py-1 rounded transition-colors ${
                    page === pagination.number
                      ? "bg-primary-600 text-white"
                      : "border border-primary-600 text-primary-600 hover:bg-primary-50"
                  }`}
                >
                  {(page as number) + 1}
                </button>
              )}
            </div>
          ))}
        </div>
        
        <button
          onClick={onNextPage}
          disabled={!hasNextPage}
          className={`px-4 py-2 rounded-lg border transition-colors ${
            hasNextPage
              ? "border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white"
              : "border-gray-300 text-gray-400 cursor-not-allowed"
          }`}
        >
          Suivant
        </button>
      </div>
      
      {/* Informations de pagination */}
      <div className="text-center text-sm text-gray-600">
        Page {pagination.number + 1} sur {pagination.totalPages} {""}
        ({pagination.totalElements} événements au total)
      </div>
    </div>
  );
} 