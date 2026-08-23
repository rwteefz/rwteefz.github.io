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
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fcfcfa" },
    { media: "(prefers-color-scheme: dark)", color: "#131413" },
  ],
};

// site.json is edited through the local studio, so treat its theme values as
// untrusted input rather than dropping them straight into a <style> tag.
const hex = (value: string | undefined, fallback: string) =>
  value && /^#[0-9a-fA-F]{3,8}$/.test(value) ? value : fallback;

const { theme } = siteData;
const preset = getPreset(theme.preset);
const mode = ["light", "dark", "system"].includes(theme.mode) ? theme.mode : "system";

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

const themeCss = [
  block(":root:root", preset.light, theme.accent),
  `:root:root{`,
  `--font-heading:${font(theme.headingFont, preset.headingFont)};`,
  `--font-body:${font(theme.bodyFont, "sans")};`,
  `color-scheme:light;}`,
  block(':root:root[data-theme="dark"]', preset.dark, theme.accentDark),
  `:root:root[data-theme="dark"]{color-scheme:dark;}`,
].join("");

// Applied before first paint so the theme never flashes the wrong colours.
const themeScript =
  `(function(){try{var s=localStorage.getItem("rwteefz-theme");` +
  `var d=${JSON.stringify(mode)};` +
  `document.documentElement.dataset.theme=s==="dark"||s==="light"?s:` +
  `(d==="system"?(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"):d)` +
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
