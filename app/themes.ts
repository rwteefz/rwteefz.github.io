/**
 * Theme presets. Each one is a complete palette for light and dark plus a
 * heading typeface, so switching preset changes the character of the site
 * rather than just recolouring a link.
 *
 * The definitions live in content/themes.json so the local studio's theme
 * picker and the site itself read exactly the same values.
 */

import presets from "@/content/themes.json";

export type Palette = {
  bg: string;
  ink: string;
  muted: string;
  faint: string;
  line: string;
  hover: string;
  accent: string;
};

export type Preset = {
  name: string;
  description: string;
  headingFont: "serif" | "sans" | "mono";
  light: Palette;
  dark: Palette;
};

export const PRESETS = presets as unknown as Record<string, Preset>;

export const DEFAULT_PRESET = "ink";

export const getPreset = (key: string): Preset => PRESETS[key] ?? PRESETS[DEFAULT_PRESET];
