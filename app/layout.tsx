import type { Metadata, Viewport } from "next";
import { getPreset, type Palette } from "@/app/themes";
import siteData from "@/content/site.json";
import "./globals.css";

const siteUrl = process.env.GITHUB_PAGES_SITE_URL ?? "http://localhost:3000/";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteData.site.title,
    template: `%s · ${siteData.site.shortName}`,
  },
  description: siteData.site.description,
  // Built from the profile photo by `node tools/make-favicon.mjs`.
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180" },
  },
};

// site.json is edited through the local studio, so treat its theme values as
// untrusted input rather than dropping them straight into a <style> tag.
const hex = (value: string | undefined, fallback: string) =>
  value && /^#[0-9a-fA-F]{3,8}$/.test(value) ? value : fallback;

const { theme } = siteData;
const preset = getPreset(theme.preset);
const mode = ["light", "dark", "system"].includes(theme.mode) ? theme.mode : "system";

// One colour, not one per prefers-color-scheme: which theme a visitor gets no
// longer follows their device, so keying the browser chrome to the device
// would tint it against the page. It starts on whichever mode the site opens
// in, and syncThemeColor keeps it there through a toggle.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: hex(preset[mode === "dark" ? "dark" : "light"].bg, "#fcfcfa"),
};

const block = (selector: string, palette: Palette, accentOverride?: string) =>
  `${selector}{` +
  (Object.entries(palette) as [keyof Palette, string][])
    .map(([token, value]) =>
      `--${token}:${hex(token === "accent" ? accentOverride ?? value : value, value)};`)
    .join("") +
  `}`;

// :root:root outranks the plain :root defaults in globals.css regardless of
// which of the two the browser sees first.
const FONTS = ["serif", "sans", "mono"];
const font = (choice: string, fallback: string) =>
  `var(--font-${FONTS.includes(choice) ? choice : fallback})`;

// Bounded so a stray value in site.json cannot make the site unreadable.
const WEIGHTS = ["300", "400", "500", "600", "700", "800"];
const weight = (choice: string) => (WEIGHTS.includes(String(choice)) ? String(choice) : "400");

const scale = (choice: unknown) => {
  const value = Number(choice);
  return Number.isFinite(value) && value >= 0.8 && value <= 1.4 ? String(value) : "1";
};

const themeCss = [
  block(":root:root", preset.light, theme.accent),
  `:root:root{`,
  `--font-heading:${font(theme.headingFont, preset.headingFont)};`,
  `--font-body:${font(theme.bodyFont, "sans")};`,
  `--heading-weight:${weight(theme.headingWeight)};`,
  `--text-scale:${scale(theme.textScale)};`,
  `color-scheme:light;}`,
  block(':root:root[data-theme="dark"]', preset.dark, theme.accentDark),
  `:root:root[data-theme="dark"]{color-scheme:dark;}`,
].join("");

// Applied before first paint so the theme never flashes the wrong colours.
// The <meta> is written by Next from the viewport export above, and may not be
// in the document yet this early, so the sync runs again once it certainly is.
const themeScript =
  `(function(){try{var s=localStorage.getItem("rwteefz-theme");` +
  `var d=${JSON.stringify(mode)};` +
  `document.documentElement.dataset.theme=s==="dark"||s==="light"?s:` +
  `(d==="system"?(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"):d);` +
  `window.syncThemeColor=function(){var m=document.querySelector('meta[name="theme-color"]');` +
  `if(m)m.setAttribute("content",getComputedStyle(document.documentElement)` +
  `.getPropertyValue("--bg").trim())};` +
  `window.syncThemeColor();` +
  `document.addEventListener("DOMContentLoaded",window.syncThemeColor)` +
  `}catch(e){}})()`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeCss }} />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
