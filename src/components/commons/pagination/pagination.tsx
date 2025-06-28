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
        
        <div className="flex items-center gap-2">
          {Array.from({ length: pagination.totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => onPageChange(i)}
              className={`px-3 py-1 rounded transition-colors ${
                i === pagination.number
                  ? "bg-primary-600 text-white"
                  : "border border-primary-600 text-primary-600 hover:bg-primary-50"
              }`}
            >
              {i + 1}
            </button>
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
        Page {pagination.number + 1} sur {pagination.totalPages} 
        ({pagination.totalElements} événements au total)
      </div>
    </div>
  );
} 