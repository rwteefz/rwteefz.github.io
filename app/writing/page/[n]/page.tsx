import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WritingIndex, totalPages } from "@/app/WritingIndex";

type Params = { params: Promise<{ n: string }> };

// Page 1 is /writing, so only 2 and up need their own exported page.
export function generateStaticParams() {
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) => ({
    n: String(index + 2),
  }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { n } = await params;
  return { title: `Writing · page ${n}` };
}

export default async function WritingPageN({ params }: Params) {
  const pageNumber = Number((await params).n);
  if (!Number.isInteger(pageNumber) || pageNumber < 2 || pageNumber > totalPages) notFound();

  return <WritingIndex pageNumber={pageNumber} />;
}
