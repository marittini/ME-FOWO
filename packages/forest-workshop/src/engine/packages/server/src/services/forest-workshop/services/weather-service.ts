import { FwError } from "../domain/errors";
import { WEATHER_CITIES } from "../content/weather";
export interface LiveWeather {
  cityId: string;
  city: string;
  temperature: number;
  kind: "clear" | "cloudy" | "rain" | "snow";
  observedAt: string;
  fetchedAt: string;
  latitude: number;
}
export function weatherKind(code: number): LiveWeather["kind"] {
  if (code === 0) return "clear";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "snow";
  if (code >= 51) return "rain";
  return "cloudy";
}
/** Fixed upstream and allowlisted coordinates: no user URL, secret, or precise device location. */
export function createWeatherService(request: typeof fetch = fetch, now = Date.now) {
  const cache = new Map<string, { at: number; value: LiveWeather }>();
  const inFlight = new Map<string, Promise<LiveWeather>>();
  return {
    async current(cityId: unknown): Promise<LiveWeather> {
      const city = WEATHER_CITIES.find((item) => item.id === cityId);
      if (!city) throw new FwError("invalid_request", { message: "날씨를 확인할 도시를 선택해 주세요." });
      const cached = cache.get(city.id);
      if (cached && now() - cached.at < 15 * 60_000) return cached.value;
      const running = inFlight.get(city.id);
      if (running) return running;
      const task = (async () => {
        try {
          const url = new URL("https://api.open-meteo.com/v1/forecast");
          url.search = new URLSearchParams({
            latitude: String(city.latitude),
            longitude: String(city.longitude),
            current: "temperature_2m,weather_code",
            timezone: "auto",
            forecast_days: "1",
          }).toString();
          const response = await request(url, { signal: AbortSignal.timeout(8000), redirect: "error" });
          if (!response.ok) throw new Error("weather upstream failed");
          const data = (await response.json()) as {
            current?: { temperature_2m?: unknown; weather_code?: unknown; time?: unknown };
          };
          const current = data.current;
          if (
            !current ||
            typeof current.temperature_2m !== "number" ||
            !Number.isFinite(current.temperature_2m) ||
            current.temperature_2m < -100 ||
            current.temperature_2m > 70 ||
            typeof current.weather_code !== "number" ||
            !Number.isInteger(current.weather_code) ||
            current.weather_code < 0 ||
            current.weather_code > 99 ||
            typeof current.time !== "string" ||
            !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/u.test(current.time)
          )
            throw new Error("invalid weather");
          const value: LiveWeather = {
            cityId: city.id,
            city: city.name,
            latitude: city.latitude,
            temperature: Math.round(current.temperature_2m),
            kind: weatherKind(current.weather_code),
            observedAt: current.time,
            fetchedAt: new Date(now()).toISOString(),
          };
          cache.set(city.id, { at: now(), value });
          return value;
        } catch {
          throw new FwError("weather_unavailable");
        }
      })().finally(() => inFlight.delete(city.id));
      inFlight.set(city.id, task);
      return task;
    },
  };
}
export type WeatherService = ReturnType<typeof createWeatherService>;
