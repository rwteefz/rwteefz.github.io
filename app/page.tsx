import type { Metadata } from "next";
import siteData from "@/content/site.json";
import { ExamArchive } from "./ExamArchive";

export const metadata: Metadata = {
  // absolute: the site title already names rwteefz, so skip the layout's "%s · rwteefz" template.
  title: { absolute: siteData.site.title },
  description: siteData.site.description,
  openGraph: {
    title: siteData.site.title,
    description: siteData.site.description,
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: `${siteData.site.shortName} 分享封面`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteData.site.title,
    description: siteData.site.description,
    images: ["/og.png"],
  },
};

export default function Home() {
  return <ExamArchive />;
}
