import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = process.env.GITHUB_PAGES_SITE_URL ?? "http://localhost:3000/";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "数学课程资料站",
    template: "%s · 数学课程资料站",
  },
  description: "一个可自由编辑、持续共建的数学课程试卷与学习资料索引。",
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
    <html lang="zh-CN" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
