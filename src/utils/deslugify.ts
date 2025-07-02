// Déslugifie un slug de ville en nom propre (ex: "nice" => "Nice", "aix-en-provence" => "Aix-en-Provence")
export function deslugify(slug: string): string {
  if (!slug) return "";
  return slug
    .split("-")
    .map((part) =>
      part.length > 0
        ? part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
        : ""
    )
    .join("-");
}
