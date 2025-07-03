// Service pour la recherche globale et typée

const apiUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8090/api/v1";

export async function searchGlobal(
  query: string,
  page: number = 0,
  size: number = 20
) {
  const res = await fetch(
    `${apiUrl}/search?query=${encodeURIComponent(
      query
    )}&page=${page}&size=${size}`
  );
  if (!res.ok) throw new Error("Erreur lors de la recherche globale");
  return res.json();
}

export async function searchByType(
  query: string,
  types: string[],
  page: number = 0,
  size: number = 20
) {
  const typeParam = types.join(",");
  const res = await fetch(
    `${apiUrl}/search?types=${typeParam}&query=${encodeURIComponent(
      query
    )}&page=${page}&size=${size}`
  );
  if (!res.ok) throw new Error("Erreur lors de la recherche typée");
  return res.json();
}
