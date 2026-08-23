import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = process.env.GITHUB_PAGES_SITE_URL ?? "http://localhost:3000/";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "rwteefz — systems, math, and small useful things",
    template: "%s · rwteefz",
  },
  description: "Personal site of rwteefz: systems, math, and small useful things.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fcfcfa" },
    { media: "(prefers-color-scheme: dark)", color: "#131413" },
  ],
};

// Applied before first paint so the saved theme never flashes the wrong colours.
const themeScript = `(function(){try{var s=localStorage.getItem("rwteefz-theme");document.documentElement.dataset.theme=s==="dark"||s==="light"?s:(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light")}catch(e){}})()`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
