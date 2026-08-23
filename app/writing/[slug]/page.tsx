import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProfileCard } from "@/app/ProfileCard";
import { SiteHeader } from "@/app/SiteHeader";
import { getPost, posts } from "@/app/posts";
import siteData from "@/content/site.json";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      images: [post.cover || "/og.png"],
    },
  };
}

/* eslint-disable @next/next/no-html-link-for-pages */
export default async function ArticlePage({ params }: Params) {
  const post = getPost((await params).slug);
  if (!post) notFound();

  return (
    <>
      <SiteHeader />
      <main className="page page--aside" id="main-content">
        <ProfileCard />

        <div className="page__body">
          <article className="article">
            <a className="back-link" href="/#writing">
              ← All writing
            </a>

            <h1>{post.title}</h1>
            {post.date ? <p className="article__date">{post.date}</p> : null}
            {post.summary ? <p className="article__summary">{post.summary}</p> : null}

            {post.cover ? (
              // A plain <img>: next/image has no optimiser behind a static export,
              // and the file is already served straight from public/images.
              // eslint-disable-next-line @next/next/no-img-element
              <img className="article__cover" src={post.cover} alt={post.coverAlt} />
            ) : null}

            {/* The Markdown comes from this repository, written by the site owner. */}
            <div className="prose" dangerouslySetInnerHTML={{ __html: post.html }} />
          </article>

          <footer className="site-footer">
            <span>{siteData.site.footer}</span>
            <a href="/#writing">More writing</a>
          </footer>
        </div>
      </main>
    </>
  );
}
