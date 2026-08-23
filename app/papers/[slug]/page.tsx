import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProfileCard } from "@/app/ProfileCard";
import { SiteHeader } from "@/app/SiteHeader";
import siteData from "@/content/site.json";

type Params = { params: Promise<{ slug: string }> };

const papers = siteData.papers ?? [];

const getPaper = (slug: string) => papers.find((paper) => paper.slug === slug);

export function generateStaticParams() {
  return papers.map((paper) => ({ slug: paper.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const paper = getPaper((await params).slug);
  if (!paper) return {};

  return {
    title: paper.title,
    description: paper.summary,
    openGraph: { title: paper.title, description: paper.summary, type: "article" },
  };
}

export default async function PaperPage({ params }: Params) {
  const paper = getPaper((await params).slug);
  if (!paper) notFound();

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <SiteHeader />

      <main className="page page--aside" id="main-content">
        <ProfileCard />

        <div className="page__body">
          <article className="article">
            <Link className="back-link" href="/#projects">
              ← All projects
            </Link>

            <h1>{paper.title}</h1>
            {paper.meta ? <p className="article__date">{paper.meta}</p> : null}
            {paper.summary ? <p className="article__summary">{paper.summary}</p> : null}

            {/*
              Reading view. The PDF viewer's own toolbar — and with it the
              download and print buttons — is switched off by the #toolbar=0
              fragment, and the file is not linked anywhere else on the site.
            */}
            <iframe
              className="reader"
              src={`${paper.file}#toolbar=0&navpanes=0&statusbar=0&view=FitH`}
              title={paper.title}
            />

            {paper.note ? <p className="reader__note">{paper.note}</p> : null}
          </article>

          <footer className="site-footer">
            <span>{siteData.site.footer}</span>
            <Link href="/#projects">More projects</Link>
          </footer>
        </div>
      </main>
    </>
  );
}
