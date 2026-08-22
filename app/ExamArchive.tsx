"use client";

import { useEffect, useState } from "react";
import siteData from "@/content/site.json";

const external = (url: string) => /^(https?:|mailto:)/.test(url);

export function ExamArchive() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("rwteefz-theme") === "dark";
    setDark(saved);
    document.documentElement.dataset.theme = saved ? "dark" : "light";
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    window.localStorage.setItem("rwteefz-theme", next ? "dark" : "light");
  };

  return (
    <div className="site-frame">
      <a className="skip-link" href="#main-content">skip to content</a>
      <header className="masthead">
        <div className="masthead__inner">
          <a className="brand" href="#top"><span className="brand__mark">›_</span> {siteData.profile.name}</a>
          <nav className="primary-nav" aria-label="Primary navigation">
            <a href="#work">work</a><a href="#education">education</a><a href="#writing">writing</a><a href="#contact">contact</a>
          </nav>
          <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label="Toggle theme" aria-pressed={dark}>{dark ? "☼" : "◐"}</button>
        </div>
      </header>

      <main className="page-shell" id="main-content">
        <aside className="sidebar">
          <div className="status-dot" aria-label="online" />
          <p className="eyebrow">{siteData.site.kicker}</p>
          <h2>{siteData.profile.name}</h2>
          <p className="profile-role">{siteData.profile.role}</p>
          <p className="profile-motto">“{siteData.profile.motto}”</p>
          <div className="side-rule" />
          <p className="side-label">elsewhere</p>
          <ul className="profile-links">
            <li><span>⌖</span>{siteData.profile.location}</li>
            {siteData.profile.links.map((link) => <li key={link.label}><span>{link.icon}</span><a href={link.url} target={external(link.url) && !link.url.startsWith("mailto:") ? "_blank" : undefined} rel={external(link.url) && !link.url.startsWith("mailto:") ? "noreferrer" : undefined}>{link.label}</a></li>)}
          </ul>
          <div className="side-rule" />
          <p className="side-label">system</p>
          <p className="side-meta">last sync<br /><strong>{siteData.site.updated}</strong></p>
          <p className="side-meta">status<br /><strong className="green">● online</strong></p>
        </aside>

        <div className="content">
          <section className="hero" id="top">
            <p className="eyebrow">hello, world</p>
            <h1>{siteData.site.title}</h1>
            <p className="hero__lead">{siteData.site.introduction}</p>
            <p className="terminal-line"><span className="green">$</span> cat /now.txt <span className="cursor">▋</span></p>
            <ul className="now-list">{siteData.now.map((item) => <li key={item}>{item}</li>)}</ul>
          </section>

          <section className="section" id="work">
            <div className="section-head"><span className="section-index">01</span><div><p className="eyebrow">selected output</p><h2>things i have made</h2></div></div>
            <div className="project-grid">{siteData.projects.map((project) => <article className="project-card" key={project.number}><div className="project-top"><span className="project-number">{project.number}</span><span className="project-tag">{project.tag}</span></div><h3>{project.title}</h3><p>{project.description}</p><div className="project-foot"><span>{project.stack}</span><a href={project.url} target={external(project.url) ? "_blank" : undefined} rel={external(project.url) ? "noreferrer" : undefined}>inspect ↗</a></div></article>)}</div>
          </section>

          <section className="section" id="education">
            <div className="section-head"><span className="section-index">02</span><div><p className="eyebrow">background process</p><h2>education &amp; experience</h2></div></div>
            <div className="timeline">{siteData.education.map((item) => <article className="timeline-row" key={`${item.period}-${item.title}`}><div className="timeline-period">{item.period}</div><div><h3>{item.title}</h3><p className="timeline-place">{item.place}</p><p>{item.detail}</p></div></article>)}</div>
          </section>

          <section className="section" id="writing">
            <div className="section-head"><span className="section-index">03</span><div><p className="eyebrow">plain text dispatches</p><h2>notes from the buffer</h2></div></div>
            <div className="writing-list">{siteData.writing.map((item) => <a className="writing-row" href={item.url} key={item.title}><span>{item.date}</span><span><strong>{item.title}</strong><small>{item.detail}</small></span><b>↗</b></a>)}</div>
          </section>

          <section className="contact-panel" id="contact"><p className="eyebrow">{siteData.contact.title}</p><h2>{siteData.contact.text}</h2><a className="button-link" href={`mailto:${siteData.contact.email}`}>{siteData.contact.email} <span>↗</span></a></section>
          <footer className="site-footer"><span>{siteData.site.footer}</span><span>{siteData.site.status}</span></footer>
        </div>
      </main>
    </div>
  );
}
