// Visual seasons only; production and daily limits still follow server UTC.
import type { Season } from "./assets";

export type SeasonChoice = "auto" | Season;

/** Northern-hemisphere meteorological seasons by month (0 = January). */
export function seasonForDate(date: Date): Season {
  const month = date.getMonth();
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "autumn";
  return "winter";
}

export function resolveSeason(choice: SeasonChoice, now: Date = new Date()): Season {
  return choice === "auto" ? seasonForDate(now) : choice;
}

export const SEASON_LABELS: Record<Season, string> = { spring: "봄", summer: "여름", autumn: "가을", winter: "겨울" };
