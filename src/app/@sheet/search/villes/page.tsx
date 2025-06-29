"use client";
import BottomSheet from "@/components/commons/bottom-sheet/bottom-sheet";
import { useRouter } from "next/navigation";
import SearchInput from "@/components/inputs/search-input/search-input";
import { useSearch } from "@/hooks/commons/use-search";
import TextImageCard from "@/components/cards/text-image-card/text-image-card";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function VillesSheetContent() {
  const router = useRouter();
  const searchParams = useSearchParams()!;
  const initialQuery = searchParams.get("q") || "";
  const {
    query,
    setQuery,
    results,
    loading,
    error
  } = useSearch({ initialQuery, initialTypes: ["city"] });

  return (
    <BottomSheet isOpen={true} onClose={() => router.back()} maxHeight="95vh">
      <div className="w-full max-w-lg p-4 flex flex-col gap-4">
        <h2>Recherchez une ville</h2>
      <SearchInput
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Recherchez une ville"
      />
      {loading && <div>Chargement...</div>}
      {error && <div style={{color: 'red'}}>{error}</div>}
      {!loading && !error && query && results.length === 0 && (
        <div>Aucune ville trouvée</div>
      )}
      {!loading && !error && results.length > 0 && (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6 p-0 list-none">
          {results.map((item: any, idx: number) => (
            <li key={idx}>
              <TextImageCard
                title={item.city.name}
                image={item.city.imageUrl}
                href={`/villes/${item.city.slug}`}
              />
            </li>
          ))}
        </ul>
      )}
      </div>
    </BottomSheet>
  );
}

export default function VillesSheet() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <VillesSheetContent />
    </Suspense>
  );
} 