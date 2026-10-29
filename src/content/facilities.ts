import type { Bilingual, Picture } from "./types";

export interface Facility {
  id: string;
  name: Bilingual;
  description: Bilingual;
  photo: Picture;
}

/** Facilities confirmed by the school, each with a real photograph. Empty until supplied. */
export const facilities: Facility[] = [];
