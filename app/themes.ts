/**
 * Theme presets. Each one is a complete palette for light and dark plus a
 * heading typeface, so switching preset changes the character of the site
 * rather than just recolouring a link.
 *
 * site.json stores only the preset name (and optional accent overrides), which
 * keeps the local studio's theme picker to a single dropdown.
 */

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

export const PRESETS: Record<string, Preset> = {
  ink: {
    name: "Ink",
    description: "Warm paper, serif headings, deep green. Quiet and editorial.",
    headingFont: "serif",
    light: {
      bg: "#fcfcfa", ink: "#1b1b19", muted: "#6c6a64", faint: "#9a978f",
      line: "#e7e4dd", hover: "#f4f3ef", accent: "#2f6f52",
    },
    dark: {
      bg: "#131413", ink: "#e9e7e1", muted: "#9a978f", faint: "#706d66",
      line: "#2a2b29", hover: "#1b1c1a", accent: "#86c2a2",
    },
  },

  slate: {
    name: "Slate",
    description: "Cool neutrals, tight sans headings, electric blue. Crisp and modern.",
    headingFont: "sans",
    light: {
      bg: "#ffffff", ink: "#0f172a", muted: "#64748b", faint: "#94a3b8",
      line: "#e2e8f0", hover: "#f1f5f9", accent: "#2563eb",
    },
    dark: {
      bg: "#0b1120", ink: "#e2e8f0", muted: "#94a3b8", faint: "#64748b",
      line: "#1e293b", hover: "#131c2e", accent: "#60a5fa",
    },
  },

  archive: {
    name: "Archive",
    description: "Parchment and oxblood, high-contrast serif. Academic press.",
    headingFont: "serif",
    light: {
      bg: "#faf6ef", ink: "#23201c", muted: "#6b6255", faint: "#9c9284",
      line: "#e3dbcd", hover: "#f2ece1", accent: "#8c3a2b",
    },
    dark: {
      bg: "#17150f", ink: "#ece5d8", muted: "#a89e8c", faint: "#766d5e",
      line: "#2c281f", hover: "#1f1c15", accent: "#d98b6a",
    },
  },

  noir: {
    name: "Noir",
    description: "Dark-first graphite with monospace headings and a teal signal.",
    headingFont: "mono",
    light: {
      bg: "#f7f7f6", ink: "#16181a", muted: "#5f6367", faint: "#8d9296",
      line: "#e0e2e3", hover: "#eeefef", accent: "#0f766e",
    },
    dark: {
      bg: "#0c0e10", ink: "#dfe3e6", muted: "#8d9296", faint: "#5f6367",
      line: "#21262a", hover: "#14181b", accent: "#5eead4",
    },
  },
};

export const DEFAULT_PRESET = "ink";

export const getPreset = (key: string): Preset => PRESETS[key] ?? PRESETS[DEFAULT_PRESET];
