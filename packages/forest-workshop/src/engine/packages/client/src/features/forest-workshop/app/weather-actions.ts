import { gameApi } from "./api";
import type { ControllerCore } from "./controller";
import { errorMessage } from "./host-api";
import { normalizeWeatherEffects, writeWeatherCity } from "./preferences";
export function createWeatherActions(core: ControllerCore) {
  let requestedAt = 0;
  let version = 0;
  let pending = false;
  async function refreshWeather(force = false) {
    if (
      !force &&
      (pending || Date.now() - requestedAt < 15 * 60_000 || (typeof document !== "undefined" && document.hidden))
    )
      return;
    const request = ++version;
    const city = core.store.get().weatherCity ?? "seoul";
    pending = true;
    requestedAt = Date.now();
    if (core.store.get().liveWeather?.state !== "ready") core.store.set({ liveWeather: { state: "loading" } });
    try {
      const weather = await gameApi.getWeather(city);
      if (request !== version || city !== (core.store.get().weatherCity ?? "seoul")) return;
      const preference = normalizeWeatherEffects(core.store.get().weatherEffects);
      core.store.set({
        liveWeather: { state: "ready", value: weather },
        weatherError: null,
        weatherEffects: { ...preference, kind: weather.kind },
      });
    } catch (error) {
      if (request !== version) return;
      const message = errorMessage(error, "현재 날씨를 불러오지 못했어요.");
      core.store.set({
        weatherError: message,
        ...(core.store.get().liveWeather?.state === "ready"
          ? {}
          : { liveWeather: { state: "error" as const, message } }),
      });
    } finally {
      if (request === version) pending = false;
    }
  }
  return {
    refreshWeather,
    setWeatherCity(city: string) {
      if (!core.store.get().content?.weatherCities?.some((item) => item.id === city)) return;
      writeWeatherCity(city);
      core.store.set({ weatherCity: city, liveWeather: { state: "loading" }, weatherError: null });
      void refreshWeather(true);
    },
  };
}
