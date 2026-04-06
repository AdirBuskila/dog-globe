/** Globe sphere radius */
export const GLOBE_RADIUS = 1.0;

/** Breed pin distance from globe center (slightly above surface) */
export const PIN_RADIUS = 1.03;

/** Globe auto-rotation speed in radians per frame */
export const AUTO_ROTATE_SPEED = 0.4;

/** Breed pin base scale */
export const PIN_BASE_SCALE = 0.022;

/** Breed pin hover scale multiplier */
export const PIN_HOVER_SCALE = 1.4;

/** Grid line spacing in degrees */
export const GRID_SPACING_DEG = 30;

/** Design tokens */
export const COLORS = {
  background: "#050A0E",
  primaryAccent: "#00FFB3",
  secondaryAccent: "#F5A623",
  text: "#E8EDF0",
  gridLine: "rgba(0, 255, 179, 0.15)",
  gridEquator: "rgba(0, 255, 179, 0.35)",
  atmosphereGlow: "#00FFB3",
} as const;

/** Three.js color values (hex numbers) */
export const COLORS_HEX = {
  primaryAccent: 0x00ffb3,
  secondaryAccent: 0xf5a623,
  background: 0x050a0e,
  atmosphereGlow: 0x00ffb3,
  ambientLight: 0x112233,
  directionalLight: 0xf5a623,
} as const;

/** Data file path */
export const BREEDS_DATA_URL = "/data/breeds.json";

/** Starfield particle count */
export const STAR_COUNT = 2000;

/** Globe atmosphere radius multiplier */
export const ATMOSPHERE_RADIUS = 1.12;

/** Keyboard shortcut for search */
export const SEARCH_SHORTCUT = "k";

/** Breakpoints */
export const MOBILE_BREAKPOINT = 768;
