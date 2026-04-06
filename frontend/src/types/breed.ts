/** Weight range in kilograms */
export interface WeightRange {
  min: number;
  max: number;
}

/** Height range in centimeters */
export interface HeightRange {
  min: number;
  max: number;
}

/** Complete breed data matching breeds.json schema */
export interface Breed {
  id: string;
  name: string;
  origin_country: string;
  origin_lat: number;
  origin_lng: number;
  group: BreedGroup;
  size: BreedSize;
  temperament: string[];
  life_expectancy: string;
  weight_kg: WeightRange;
  height_cm: HeightRange;
  image: string;
  description: string;
  popularity_rank: number | null;
}

/** AKC breed groups */
export type BreedGroup =
  | "Sporting"
  | "Hound"
  | "Working"
  | "Terrier"
  | "Toy"
  | "Non-Sporting"
  | "Herding"
  | "Foundation Stock Service"
  | "Miscellaneous";

/** Breed size categories */
export type BreedSize = "Small" | "Medium" | "Large" | "Giant";

/** Filter state for the UI */
export interface BreedFilters {
  group: BreedGroup | null;
  size: BreedSize | null;
  temperament: string | null;
}
