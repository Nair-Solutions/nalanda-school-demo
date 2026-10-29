/**
 * Judo results transcribed from the school's "Achievers" poster
 * (public/images/achievements/judo-achievers-2026.webp). Student names and
 * classes are kept exactly as printed on the poster.
 */
export type MedalResult = "gold" | "silver" | "medal";

export interface JudoResult {
  student: string;
  className: string;
  ageGroup: number;
  weightKg: number;
  result: MedalResult;
}

export const judoPoster = {
  src: "/images/achievements/judo-achievers-2026.webp",
  width: 980,
  height: 1236,
} as const;

export const judoResults2026: JudoResult[] = [
  { student: "Rashi Sahu", className: "12 B", ageGroup: 19, weightKg: 36, result: "gold" },
  { student: "Mitanjali Singh", className: "12 C2", ageGroup: 19, weightKg: 48, result: "silver" },
  { student: "Ansh Choudhary", className: "9 E", ageGroup: 17, weightKg: 60, result: "silver" },
  { student: "Aditya Kumar Singh", className: "8 A", ageGroup: 14, weightKg: 40, result: "silver" },
  // The poster shows a medal icon without naming the colour; confirm with the school.
  { student: "Aaditya Sahu", className: "8 F", ageGroup: 14, weightKg: 45, result: "medal" },
];
