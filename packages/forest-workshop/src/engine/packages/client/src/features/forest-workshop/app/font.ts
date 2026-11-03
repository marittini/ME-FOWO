import { hostApi } from "./host-api";
let loading: Promise<void> | undefined;
/** The licensed font travels with the package; no Google Fonts or third-party request at play time. */
export function loadGameFont(): Promise<void> {
  if (loading) return loading;
  loading = (async () => {
    if (typeof FontFace === "undefined" || !document.fonts) return;
    const font = await hostApi().get<{ family: string; data: string }>(
      "/capability-packages/forest-workshop/assets/assets/fonts/jua.json",
    );
    if (font.family !== "Jua" || !font.data.startsWith("data:font/ttf;base64,")) throw new Error("Invalid game font");
    const face = await new FontFace("Jua", `url(${font.data})`, { weight: "400" }).load();
    document.fonts.add(face);
  })().catch(() => {
    loading = undefined;
  });
  return loading;
}
