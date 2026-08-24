import Link from "next/link";
import { ProfileCard } from "@/app/ProfileCard";
import { SiteHeader } from "@/app/SiteHeader";
import { posts } from "@/app/posts";
import siteData from "@/content/site.json";

const isExternal = (url: string) => /^https?:/.test(url);

const linkProps = (url: string) =>
  isExternal(url) ? { target: "_blank", rel: "noreferrer" } : {};

function Now() {
  return (
    <ul className="now-list">
      {siteData.now.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

/**
 * Oldest first, so the list reads as a progression. A date with a month
 * ("2026-06") takes its place on that timeline; one with only a year, or none
 * at all, keeps to the end in the order site.json lists it.
 */
const when = (date: string) => {
  const [year, month] = String(date ?? "").split("-");
  return month ? Number(year) * 12 + Number(month) : Number.POSITIVE_INFINITY;
};

const projects = [...siteData.projects].sort((a, b) => when(a.date) - when(b.date));

function Projects() {
  return (
    <div className="rows">
      {projects.map((project) => (
        <a className="row" key={project.number} href={project.url} {...linkProps(project.url)}>
          <div className="row__top">
            <h3>
              {project.title} <span className="row__arrow">↗</span>
            </h3>
            <span className="row__aside">{project.date}</span>
          </div>
          <p>{project.description}</p>
          <p className="row__foot">
            {[project.tag, project.stack].filter(Boolean).join(" · ")}
          </p>
        </a>
      ))}
    </div>
  );
}

function Education() {
  return (
    // rows--cv: heading, qualification and dates share one grid, so the same
    // kind of thing sits in the same column on every line.
    <div className="rows rows--cv">
      {siteData.education.map((item) => (
        <article className="row" key={`${item.period}-${item.title}`}>
          <h3>
            {item.url ? (
              <a className="row__site" href={item.url} {...linkProps(item.url)}>
                {item.title}
              </a>
            ) : (
              item.title
            )}
            {item.logo ? (
              <>
                {/* A non-breaking space keeps the crest on the name's last line. */}
                {"\u00a0"}
                {/* Decorative: the school's name is right next to it. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="row__logo" src={item.logo} alt="" />
              </>
            ) : null}
          </h3>
          <span className="row__qual">{item.place}</span>
          <span className="row__aside">
            {item.city ? <span className="row__city">{item.city}</span> : null}
            {item.period}
          </span>
          {item.detail ? <p className="row__detail">{item.detail}</p> : null}
        </article>
      ))}
    </div>
  );
}

function Activities() {
  return (
    <div className="rows rows--cv">
      {siteData.activities.map((item) => (
        <article className="row" key={`${item.period}-${item.title}`}>
          <h3>{item.title}</h3>
          <span className="row__qual">{item.role}</span>
          <span className="row__aside">{item.period}</span>
          {item.detail ? <p className="row__detail">{item.detail}</p> : null}
        </article>
      ))}
    </div>
  );
}

const homeLimit = Math.max(1, Number(siteData.pagination?.homeLimit) || 4);

function Writing() {
  return (
    <>
      <div className="rows">
        {posts.slice(0, homeLimit).map((post) => (
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

      {posts.length > homeLimit ? (
        <Link className="see-all" href="/writing">
          All {posts.length} articles →
        </Link>
      ) : null}
    </>
  );
}

// Which sections exist, and in what order, is decided by site.json.
const SECTIONS: Record<string, () => React.ReactElement> = {
  now: Now,
  projects: Projects,
  education: Education,
  activities: Activities,
  writing: Writing,
};

export function ExamArchive() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <SiteHeader />

      <main className="page page--aside" id="main-content">
        <ProfileCard />

        <div className="page__body">
          <section className="hero" id="top">
            <h1>{siteData.profile.name}</h1>
            <p className="hero__tagline">{siteData.profile.motto}</p>
            {/* A blank line in site.json starts a new paragraph. */}
          {siteData.site.introduction.split(/\n{2,}/).map((para) => (
            <p className="hero__lead" key={para.slice(0, 40)}>
              {para.trim()}
            </p>
          ))}
          </section>

          {siteData.sections
            .filter((section) => section.visible && section.key in SECTIONS)
            .map((section) => {
              const Body = SECTIONS[section.key];
              return (
                <section className="section" id={section.key} key={section.key}>
                  <p className="section-label">{section.label}</p>
                  <Body />
                </section>
              );
            })}

          <section className="contact" id="contact">
            <p className="section-label">{siteData.contact.title}</p>
            <p>{siteData.contact.text}</p>
            {[siteData.contact.email, siteData.contact.emailAlt]
              .filter(Boolean)
              .map((address) => (
                <a className="contact__link" key={address} href={`mailto:${address}`}>
                  {address}
                </a>
              ))}
          </section>

          <footer className="site-footer">
            <span>{siteData.site.footer}</span>
            <span>Updated {siteData.site.updated}</span>
            <a className="to-top" href="#top">↑ Top</a>
          </footer>
        </div>
      </main>
    </>
  );
}
