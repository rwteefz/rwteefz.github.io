"use client";

import { useEffect, useState } from "react";
import siteData from "@/content/site.json";

// Matches the phone breakpoint in globals.css, where the nav folds into a panel.
const PHONE = "(max-width: 600px)";

export function SiteHeader() {
  // Only ever true on a phone: wider screens keep the nav in the bar, and the
  // button that sets this is display:none there.
  const [menuOpen, setMenuOpen] = useState(false);

  // Anything that means "the reader is done with the menu" closes it: Escape, a
  // tap outside the header, or the viewport growing past the phone breakpoint.
  useEffect(() => {
    if (!menuOpen) return;

    const close = () => setMenuOpen(false);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    const onPointer = (event: PointerEvent) => {
      if (!(event.target as Element).closest(".masthead")) close();
    };
    const phone = window.matchMedia(PHONE);
    const onWidth = () => {
      if (!phone.matches) close();
    };

    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    phone.addEventListener("change", onWidth);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
      phone.removeEventListener("change", onWidth);
    };
  }, [menuOpen]);

  // A static export hydrates after the browser has already handled the hash, and
  // the router puts the page back at the top. Jump to the target once more when
  // the page is ready, so /#education lands on Education.
  useEffect(() => {
    const jump = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      document.getElementById(id)?.scrollIntoView({ block: "start" });
    };

    jump();
    window.addEventListener("hashchange", jump);
    return () => window.removeEventListener("hashchange", jump);
  }, []);

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

  // On the homepage the name scrolls back to the top instead of reloading;
  // anywhere else the browser follows the link home as usual.
  const goHome = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    if (!["/", "/index.html"].includes(window.location.pathname)) return;

    event.preventDefault();
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: still ? "auto" : "smooth" });
    // Drop any #section from the address, or a refresh would jump back down.
    window.history.replaceState(null, "", window.location.pathname);
  };

  return (
    <header className="masthead">
      <div className="masthead__inner">
        {/* Plain anchor, like the nav: a client-side hop to "/" can leave the
            reader at the scroll position of the page they came from. On the
            homepage itself there is nowhere to go, so it rides back up. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a className="brand" href="/" onClick={goHome}>
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
        </a>
        {/* Plain anchors on purpose: next/link swallows same-page hash jumps. */}
        {/* eslint-disable @next/next/no-html-link-for-pages */}
        <nav
          className="primary-nav"
          id="primary-nav"
          aria-label="Primary"
          // Read only by the phone stylesheet; the bar ignores it.
          data-open={menuOpen}
        >
          {siteData.sections
            .filter((section) => section.visible && section.key !== "now")
            .map((section) => (
              <a key={section.key} href={`/#${section.key}`} onClick={() => setMenuOpen(false)}>
                {section.label}
              </a>
            ))}
          <a href="/#contact" onClick={() => setMenuOpen(false)}>
            Contact
          </a>
        </nav>
        {/* eslint-enable @next/next/no-html-link-for-pages */}
        <button
          className="theme-toggle"
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle colour theme"
        >
          <span className="theme-icon theme-icon--to-dark" aria-hidden="true">☾</span>
          <span className="theme-icon theme-icon--to-light" aria-hidden="true">☀</span>
        </button>
        {/* Last in the bar, and display:none above the phone breakpoint. */}
        <button
          className="nav-toggle"
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="primary-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <span className="nav-toggle__bars" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
