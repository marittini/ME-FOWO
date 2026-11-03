import assert from "node:assert/strict";
import {
  normalizeWeatherEffects,
  readWeatherEffects,
  writeWeatherEffects,
} from "../packages/forest-workshop/src/engine/packages/client/src/features/forest-workshop/app/preferences";
assert.deepEqual(normalizeWeatherEffects(null), { enabled: true, kind: "clear" });
assert.deepEqual(normalizeWeatherEffects({ enabled: false, kind: "rain" }), { enabled: false, kind: "rain" });
assert.equal(normalizeWeatherEffects({ kind: "invalid" as never }).kind, "clear");
let stored: string | null = null;
Object.defineProperty(globalThis, "localStorage", {
  configurable: true,
  value: {
    getItem: () => stored,
    setItem: (_key: string, value: string) => {
      stored = value;
    },
  },
});
writeWeatherEffects({ enabled: false, kind: "snow" });
assert.deepEqual(readWeatherEffects(), { enabled: false, kind: "snow" });
stored = "broken-json";
assert.deepEqual(readWeatherEffects(), { enabled: true, kind: "clear" });
Object.defineProperty(globalThis, "localStorage", {
  configurable: true,
  get: () => {
    throw new Error("blocked");
  },
});
assert.doesNotThrow(() => writeWeatherEffects({ enabled: true, kind: "rain" }));
assert.deepEqual(readWeatherEffects(), { enabled: true, kind: "clear" });
console.log("Weather preference validation, persistence and blocked storage: OK");

async function verifyLocalEnvironment() {
  // City-local calendar and solar boundaries must not follow the viewer's timezone.
  const { localEnvironment } =
    await import("../packages/forest-workshop/src/engine/packages/client/src/features/forest-workshop/app/local-environment");
  const { createWeatherService } =
    await import("../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/services/weather-service");
  const { WEATHER_CITIES } =
    await import("../packages/forest-workshop/src/engine/packages/server/src/services/forest-workshop/content/weather");
  const cityState = (weatherCity: string) =>
    ({ weatherCity, content: { weatherCities: WEATHER_CITIES } }) as unknown as Parameters<typeof localEnvironment>[0];
  assert.deepEqual(localEnvironment(cityState("seoul"), new Date("2026-02-28T16:00:00Z")), {
    season: "spring",
    phase: "night",
  });
  assert.deepEqual(localEnvironment(cityState("new-york"), new Date("2026-02-28T16:00:00Z")), {
    season: "winter",
    phase: "day",
  });
  assert.deepEqual(localEnvironment(cityState("sydney"), new Date("2026-11-30T13:30:00Z")), {
    season: "summer",
    phase: "night",
  });
  let upstream = 0;
  const service = createWeatherService(
    (async (url) => {
      upstream++;
      const query = new URL(String(url)).searchParams;
      assert.equal(query.get("timezone"), "Asia/Seoul");
      assert.equal(query.get("daily"), "sunrise,sunset");
      return new Response(
        JSON.stringify({
          current: { temperature_2m: 7.6, weather_code: 0, time: "2026-11-03T06:00" },
          daily: { sunrise: ["2026-11-03T07:00"], sunset: ["2026-11-03T17:30"] },
        }),
      );
    }) as typeof fetch,
    () => Date.parse("2026-11-02T21:00:00Z"),
  );
  const weather = await service.current("seoul");
  assert.equal(weather.timeZone, "Asia/Seoul");
  assert.equal(weather.temperature, 8);
  const solarState = { ...cityState("seoul"), liveWeather: { state: "ready" as const, value: weather } };
  for (const [time, phase] of [
    ["2026-11-02T21:59:00Z", "night"],
    ["2026-11-02T22:00:00Z", "day"],
    ["2026-11-03T08:29:00Z", "day"],
    ["2026-11-03T08:30:00Z", "night"],
  ]) {
    assert.equal(localEnvironment(solarState, new Date(time!)).phase, phase);
  }
  // Yesterday's solar times cannot freeze the next day's lighting after an outage.
  assert.equal(localEnvironment(solarState, new Date("2026-11-04T03:00:00Z")).phase, "day");
  await service.current("seoul");
  assert.equal(upstream, 1);
  await assert.rejects(service.current("bad-city"), { code: "invalid_request" });
  console.log("Selected-city calendar, hemispheres, midnight, sunrise/sunset, stale-data fallback and cache: OK");
}
verifyLocalEnvironment().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
