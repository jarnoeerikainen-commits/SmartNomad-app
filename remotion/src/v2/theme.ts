import { loadFont as loadDisplay } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadUi } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

const display = loadDisplay("normal", { weights: ["600", "700", "900"], subsets: ["latin"] });
const ui = loadUi("normal", { weights: ["400", "500", "600", "700", "800"], subsets: ["latin"] });
const mono = loadMono("normal", { weights: ["400", "600", "700"], subsets: ["latin"] });

export const C = {
  deep: "#05070B",
  ink: "#0B111C",
  panel: "#0F1622",
  gold: "#D4AF37",
  goldLight: "#F3D98B",
  goldDark: "#9A7A1F",
  teal: "#18B8A7",
  red: "#E5484D",
  amber: "#F5A524",
  green: "#16A34A",
  pearl: "#F6F1E5",
  muted: "rgba(246,241,229,0.66)",
  hairline: "rgba(212,175,55,0.22)",
};

export const FONT = {
  display: display.fontFamily,
  ui: ui.fontFamily,
  mono: mono.fontFamily,
};
