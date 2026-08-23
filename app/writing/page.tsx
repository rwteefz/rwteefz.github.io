import type { Metadata } from "next";
import { WritingIndex } from "@/app/WritingIndex";

export const metadata: Metadata = {
  title: "Writing",
  description: "Articles and notes.",
};

export default function WritingPage() {
  return <WritingIndex pageNumber={1} />;
}
