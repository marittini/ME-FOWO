import type { AppState } from "./controller";
import type { Season } from "./assets";
import { seasonForDate } from "./season";

type EnvironmentState = Pick<AppState, "liveWeather"> & Partial<Pick<AppState, "weatherCity" | "content">>;
/** Selected city's wall clock, independent of device timezone and weather observation age. */
export function localEnvironment(state: EnvironmentState, now = new Date()) {
  const city = state.content?.weatherCities?.find((city) => city.id === (state.weatherCity ?? "seoul"));
  const live =
    state.liveWeather?.state === "ready" && (!state.weatherCity || state.liveWeather.value.cityId === state.weatherCity)
      ? state.liveWeather.value
      : null;
  const timeZone = city?.timeZone ?? live?.timeZone ?? "Asia/Seoul";
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const part = (key: string) => parts.find((p) => p.type === key)!.value;
  const date = `${part("year")}-${part("month")}-${part("day")}`;
  const time = `${date}T${part("hour")}:${part("minute")}`;
  const north = seasonForDate(new Date(2000, Number(part("month")) - 1, 15));
  const latitude = city?.latitude ?? live?.latitude ?? 37.57;
  const season: Season =
    latitude < 0 ? ({ spring: "autumn", summer: "winter", autumn: "spring", winter: "summer" } as const)[north] : north;
  const solar = live?.sunrise?.startsWith(date) && live?.sunset?.startsWith(date);
  const isDay = solar
    ? time >= live!.sunrise! && time < live!.sunset!
    : Number(part("hour")) >= 6 && Number(part("hour")) < 18;
  return { season, phase: isDay ? ("day" as const) : ("night" as const) };
}
