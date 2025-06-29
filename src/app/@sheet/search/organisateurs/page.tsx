"use client";
import BottomSheet from "@/components/commons/bottom-sheet/bottom-sheet";
import { useRouter } from "next/navigation";
import SearchInput from "@/components/inputs/search-input/search-input";
import { useSearch } from "@/hooks/commons/use-search";
import OrganizerPhotoCard from "@/components/cards/organizer-photo-card/organizer-photo-card";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function OrganisateursSheetContent() {
  const router = useRouter();
  const searchParams = useSearchParams()!;
  const initialQuery = searchParams.get("q") || "";
  const { query, setQuery, results, loading, error } = useSearch({
    initialQuery,
    initialTypes: ["organizer"],
  });
  return (
    <BottomSheet isOpen={true} onClose={() => router.back()} maxHeight="95vh">
      <div className="w-full max-w-lg p-4 flex flex-col gap-4">
        <h2>Recherchez un organisateur</h2>
        <SearchInput
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Recherchez un organisateur"
        />
        {loading && <div>Chargement...</div>}
        {error && <div style={{ color: "red" }}>{error}</div>}
        {!loading && !error && query && results.length === 0 && (
          <div>Aucun organisateur trouvé</div>
        )}
        {!loading && !error && results.length > 0 && (
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-6 p-0 list-none">
            {results.map((item: any, idx: number) => (
              <li key={idx}>
                <OrganizerPhotoCard
                  name={item.user.firstName + " " + item.user.lastName}
                  imageUrl={item.user.imageUrl || ""}
                  href={`/organisateurs/${item.user.pseudo}`}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </BottomSheet>
  );
}

export default function OrganisateursSheet() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <OrganisateursSheetContent />
    </Suspense>
  );
} 