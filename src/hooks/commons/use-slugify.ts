import { useMemo } from "react";

export const useSlugify = (text: string): string => {
  return useMemo(() => {
    if (!text) return "";

    return (
      text
        // Convertir en minuscules
        .toLowerCase()
        // Remplacer les caractères accentués
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        // Remplacer les caractères spéciaux et la ponctuation par des espaces
        .replace(/[^a-z0-9\s-]/g, " ")
        // Remplacer les espaces multiples par un seul espace
        .replace(/\s+/g, " ")
        // Trim les espaces en début et fin
        .trim()
        // Remplacer les espaces par des tirets
        .replace(/\s/g, "-")
        // Remplacer les tirets multiples par un seul tiret
        .replace(/-+/g, "-")
    );
  }, [text]);
};
