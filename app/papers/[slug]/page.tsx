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
              The pages are images built by tools/paper-pages.mjs; the PDF is
              not published at all, so there is no file to save. Each page
              carries a transparent shield on top: a right-click lands on the
              shield, not the image, so the browser offers no "Save image as".
            */}
            <div className="reader">
              {Array.from({ length: paper.pages }, (_, index) => {
                const page = String(index + 1).padStart(3, "0");
                return (
                  <div className="reader__page" key={page}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/papers/${paper.slug}/p-${page}.jpg`}
                      alt={`Page ${index + 1} of ${paper.pages}`}
                      loading={index < 2 ? "eager" : "lazy"}
                      draggable={false}
                    />
                    <span className="reader__shield" aria-hidden="true" />
                  </div>
                );
              })}
            </div>

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
