"use client";

import siteData from "@/content/site.json";

const isExternal = (url: string) => /^https?:/.test(url);

const linkProps = (url: string) =>
  isExternal(url) ? { target: "_blank", rel: "noreferrer" } : {};

export function ExamArchive() {
  // The theme lives on <html data-theme>, set before paint by the inline script in
  // layout.tsx. Keeping it out of React state avoids a hydration mismatch on the
  // statically exported page; the icon swap is handled in CSS.
  const toggleTheme = () => {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      window.localStorage.setItem("rwteefz-theme", next);
    } catch {
      /* private mode: the choice just does not persist */
    }
  };

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <header className="masthead">
        <div className="masthead__inner">
          <a className="brand" href="#top">
            {siteData.profile.name}
          </a>
          <nav className="primary-nav" aria-label="Primary">
            <a href="#projects">Projects</a>
            <a href="#activities">Activities</a>
            <a href="#writing">Writing</a>
            <a href="#contact">Contact</a>
          </nav>
          <button
            className="theme-toggle"
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle colour theme"
          >
            <span className="theme-icon theme-icon--to-dark" aria-hidden="true">☾</span>
            <span className="theme-icon theme-icon--to-light" aria-hidden="true">☀</span>
          </button>
        </div>
      </header>

      <main className="page" id="main-content">
        <section className="hero" id="top">
          <h1>{siteData.profile.name}</h1>
          <p className="hero__tagline">{siteData.profile.motto}</p>
          <p className="hero__lead">{siteData.site.introduction}</p>
          <ul className="hero__meta">
            <li>{siteData.profile.role}</li>
            <li>{siteData.profile.location}</li>
            {siteData.profile.links.map((link) => (
              <li key={link.label}>
                <a href={link.url} {...linkProps(link.url)}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="section">
          <p className="section-label">Now</p>
          <ul className="now-list">
            {siteData.now.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="section" id="projects">
          <p className="section-label">Projects</p>
          <div className="rows">
            {siteData.projects.map((project) => (
              <a
                className="row"
                key={project.number}
                href={project.url}
                {...linkProps(project.url)}
              >
                <div className="row__top">
                  <h3>
                    {project.title} <span className="row__arrow">↗</span>
                  </h3>
                  <span className="row__aside">{project.tag}</span>
                </div>
                <p>{project.description}</p>
                <p className="row__foot">{project.stack}</p>
              </a>
            ))}
          </div>
        </section>

        <section className="section" id="education">
          <p className="section-label">Education</p>
          <div className="rows">
            {siteData.education.map((item) => (
              <article className="row" key={`${item.period}-${item.title}`}>
                <div className="row__top">
                  <h3>{item.title}</h3>
                  <span className="row__aside">{item.period}</span>
                </div>
                <p className="row__place">{item.place}</p>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="activities">
          <p className="section-label">Activities</p>
          <div className="rows">
            {siteData.activities.map((item) => (
              <article className="row" key={`${item.period}-${item.title}`}>
                <div className="row__top">
                  <h3>{item.title}</h3>
                  <span className="row__aside">{item.period}</span>
                </div>
                <p className="row__place">{item.role}</p>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="writing">
          <p className="section-label">Writing</p>
          <div className="rows">
            {siteData.writing.map((item) => (
              <a className="row" key={item.title} href={item.url} {...linkProps(item.url)}>
                <div className="row__top">
                  <h3>
                    {item.title} <span className="row__arrow">↗</span>
                  </h3>
                  <span className="row__aside">{item.date}</span>
                </div>
                <p>{item.detail}</p>
              </a>
            ))}
          </div>
        </section>

        <section className="contact" id="contact">
          <p className="section-label">{siteData.contact.title}</p>
          <p>{siteData.contact.text}</p>
          <a className="contact__link" href={`mailto:${siteData.contact.email}`}>
            {siteData.contact.email}
          </a>
        </section>

        <footer className="site-footer">
          <span>{siteData.site.footer}</span>
          <span>Updated {siteData.site.updated}</span>
        </footer>
      </main>
    </>
  );
}
