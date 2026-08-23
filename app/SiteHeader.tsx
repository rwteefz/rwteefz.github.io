"use client";

import Link from "next/link";
import siteData from "@/content/site.json";

export function SiteHeader() {
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
    <header className="masthead">
      <div className="masthead__inner">
        <Link className="brand" href="/">
          {siteData.profile.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className="brand__logo"
              src={siteData.profile.logo}
              alt={siteData.profile.logoAlt || siteData.profile.name}
            />
          ) : (
            siteData.profile.name
          )}
        </Link>
        <nav className="primary-nav" aria-label="Primary">
          {siteData.sections
            .filter((section) => section.visible && section.key !== "now")
            .map((section) => (
              <Link key={section.key} href={`/#${section.key}`}>
                {section.label}
              </Link>
            ))}
          <Link href="/#contact">Contact</Link>
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
  );
}
