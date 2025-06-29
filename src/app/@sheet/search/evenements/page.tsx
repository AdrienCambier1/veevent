"use client";
import BottomSheet from "@/components/commons/bottom-sheet/bottom-sheet";
import { useRouter } from "next/navigation";
import SearchInput from "@/components/inputs/search-input/search-input";
import { useSearch } from "@/hooks/commons/use-search";
import EventCard from "@/components/cards/event-card/event-card";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function EvenementsSheetContent() {
  const router = useRouter();
   const searchParams = useSearchParams()!;
  const initialQuery = searchParams.get("q") || "";
  const {
    query,
    setQuery,
    results,
    loading,
    error
  } = useSearch({ initialQuery, initialTypes: ["event"] });

  return (
    <BottomSheet isOpen={true} onClose={() => router.back()} maxHeight="95vh">
      <div className="w-full max-w-lg p-4 flex flex-col gap-4">
      <h2>Recherchez un événement</h2>
      <SearchInput
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Recherchez un événement"
      />
      {loading && <div>Chargement...</div>}
      {error && <div style={{color: 'red'}}>{error}</div>}
      {!loading && !error && query && results.length === 0 && (
        <div>Aucun événement trouvé</div>
      )}
      {!loading && !error && results.length > 0 && (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6 p-0 list-none">
          {results.map((item: any, idx: number) => (
            <li key={idx}>
              <EventCard id={item.event.id.toString()} event={item.event} minify />
            </li>
          ))}
        </ul>
      )}
      </div>
    </BottomSheet>
  );
}

export default function EvenementsSheet() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <EvenementsSheetContent />
    </Suspense>
  );
} 