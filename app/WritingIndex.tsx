import Link from "next/link";
import { ProfileCard } from "@/app/ProfileCard";
import { SiteHeader } from "@/app/SiteHeader";
import { posts } from "@/app/posts";
import siteData from "@/content/site.json";

export const perPage = Math.max(1, Number(siteData.pagination?.perPage) || 8);

export const totalPages = Math.max(1, Math.ceil(posts.length / perPage));

/** Page 1 lives at /writing, the rest at /writing/page/2, /writing/page/3 … */
export const pageHref = (n: number) => (n <= 1 ? "/writing" : `/writing/page/${n}`);

export function WritingIndex({ pageNumber }: { pageNumber: number }) {
  const current = Math.min(Math.max(1, pageNumber), totalPages);
  const slice = posts.slice((current - 1) * perPage, current * perPage);

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <SiteHeader />

      <main className="page page--aside" id="main-content">
        <ProfileCard />

        <div className="page__body">
          <section className="hero">
            <h1>Writing</h1>
            <p className="hero__lead">
              {posts.length} {posts.length === 1 ? "article" : "articles"}
              {totalPages > 1 ? ` · page ${current} of ${totalPages}` : ""}
            </p>
          </section>

          <section className="section">
            <div className="rows">
              {slice.map((post) => (
                <Link className="row" key={post.slug} href={`/writing/${post.slug}`}>
                  <div className="row__top">
                    <h3>
                      {post.title} <span className="row__arrow">→</span>
                    </h3>
                    <span className="row__aside">{post.date}</span>
                  </div>
                  <p>{post.summary}</p>
                </Link>
              ))}
            </div>

            {totalPages > 1 ? (
              <nav className="pager" aria-label="Article pages">
                {current > 1 ? (
                  <Link className="pager__step" href={pageHref(current - 1)} rel="prev">
                    ← Newer
                  </Link>
                ) : (
                  <span className="pager__step pager__step--off">← Newer</span>
                )}

                <span className="pager__pages">
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((n) =>
                    n === current ? (
                      <span className="pager__page pager__page--on" key={n} aria-current="page">
                        {n}
                      </span>
                    ) : (
                      <Link className="pager__page" key={n} href={pageHref(n)}>
                        {n}
                      </Link>
                    ),
                  )}
                </span>

                {current < totalPages ? (
                  <Link className="pager__step" href={pageHref(current + 1)} rel="next">
                    Older →
                  </Link>
                ) : (
                  <span className="pager__step pager__step--off">Older →</span>
                )}
              </nav>
            ) : null}
          </section>

          <footer className="site-footer">
            <span>{siteData.site.footer}</span>
            <Link href="/">Home</Link>
          </footer>
        </div>
      </main>
    </>
  );
}
