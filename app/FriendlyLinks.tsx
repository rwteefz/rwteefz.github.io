"use client";

import { useState } from "react";

type LinkItem = { title: string; url: string };

const isExternal = (url: string) => /^https?:/.test(url);

const linkProps = (url: string) =>
  isExternal(url) ? { target: "_blank", rel: "noreferrer" } : {};

/**
 * Collapsed by default, sitting under the footer's own last line: a right
 * arrow that unfolds the list of peer universities to its own right, in the
 * same line, rather than opening a section beneath it.
 */
export function FriendlyLinks({
  items,
  label,
  id,
}: {
  items: LinkItem[];
  label: string;
  id?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="links-accordion" id={id}>
      <button
        type="button"
        className="links-accordion__trigger"
        aria-expanded={open}
        aria-controls="links-panel"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="links-accordion__triangle" aria-hidden="true" />
        {label}
      </button>

      {open ? (
        <div className="links-inline" id="links-panel">
          {items.map((item) => (
            <a
              className="links-inline__item"
              key={item.url}
              href={item.url}
              {...linkProps(item.url)}
            >
              {item.title}
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}
