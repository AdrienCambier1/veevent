export const FRENCH_REGIONS = {
  ARA: "Auvergne-Rhône-Alpes",
  BFC: "Bourgogne-Franche-Comté",
  BRE: "Bretagne",
  CVL: "Centre-Val de Loire",
  GES: "Grand Est",
  HDF: "Hauts-de-France",
  IDF: "Île-de-France",
  NOR: "Normandie",
  NAQ: "Nouvelle-Aquitaine",
  OCC: "Occitanie",
  PDL: "Pays de la Loire",
  PAC: "Provence-Alpes-Côte d'Azur",
} as const;

export type RegionCode = keyof typeof FRENCH_REGIONS;

export const getRegionName = (code: RegionCode): string => {
  return FRENCH_REGIONS[code];
};

export const getRegionCodes = (): RegionCode[] => {
  return Object.keys(FRENCH_REGIONS) as RegionCode[];
};
