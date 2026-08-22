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
    { media: "(prefers-color-scheme: light)", color: "#fbfbfb" },
    { media: "(prefers-color-scheme: dark)", color: "#171819" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
