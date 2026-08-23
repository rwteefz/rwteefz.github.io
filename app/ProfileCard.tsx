import siteData from "@/content/site.json";

const { profile } = siteData;

const isExternal = (url: string) => /^https?:/.test(url);

/** Icons are 16px line drawings in currentColor so they inherit the meta colour. */
const ICONS: Record<string, React.ReactElement> = {
  pin: (
    <>
      <path d="M8 1.6a4.6 4.6 0 0 0-4.6 4.6c0 3.4 4.6 8.2 4.6 8.2s4.6-4.8 4.6-8.2A4.6 4.6 0 0 0 8 1.6Z" />
      <circle cx="8" cy="6.2" r="1.7" />
    </>
  ),
  mail: (
    <>
      <rect x="1.6" y="3.4" width="12.8" height="9.2" rx="1.4" />
      <path d="m2.2 4.6 5.8 4 5.8-4" />
    </>
  ),
  github: (
    <path d="M8 1.3a6.7 6.7 0 0 0-2.1 13.1c.33.06.46-.15.46-.33v-1.15c-1.87.4-2.26-.9-2.26-.9-.3-.78-.75-.99-.75-.99-.61-.42.05-.41.05-.41.67.05 1.03.7 1.03.7.6 1.03 1.57.73 1.96.56.06-.44.24-.74.43-.91-1.49-.17-3.06-.75-3.06-3.34 0-.74.26-1.34.7-1.81-.07-.17-.3-.86.07-1.79 0 0 .57-.18 1.86.69a6.4 6.4 0 0 1 3.38 0c1.29-.87 1.86-.69 1.86-.69.37.93.14 1.62.07 1.79.44.47.7 1.07.7 1.81 0 2.6-1.58 3.17-3.08 3.33.24.21.46.62.46 1.26v1.87c0 .18.12.39.46.32A6.7 6.7 0 0 0 8 1.3Z" />
  ),
  link: (
    <>
      <path d="M6.6 9.4a2.6 2.6 0 0 0 3.9.3l2-2a2.6 2.6 0 0 0-3.7-3.7l-1.1 1.1" />
      <path d="M9.4 6.6a2.6 2.6 0 0 0-3.9-.3l-2 2a2.6 2.6 0 0 0 3.7 3.7l1.1-1.1" />
    </>
  ),
};

function Icon({ name }: { name: keyof typeof ICONS }) {
  return (
    <svg
      className="pcard__icon"
      viewBox="0 0 16 16"
      fill={name === "github" ? "currentColor" : "none"}
      stroke={name === "github" ? "none" : "currentColor"}
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICONS[name]}
    </svg>
  );
}

/** Guessed from the address, so a new link in site.json gets a sensible icon. */
const iconFor = (url: string): keyof typeof ICONS => {
  if (url.startsWith("mailto:")) return "mail";
  if (/(^|\/\/|\.)github\.com/.test(url)) return "github";
  return "link";
};

/** The left column can carry a handle while the page heading keeps the real name. */
const handle = (profile as { handle?: string }).handle?.trim() || profile.name;

/** Fallback when no photo is set: the first letters of the handle, in a circle. */
const initials = handle
  .split(/[\s._-]+/)
  .filter(Boolean)
  .slice(0, 2)
  .map((part) => part[0]?.toUpperCase() ?? "")
  .join("");

export function ProfileCard() {
  const photo = (profile as { photo?: string }).photo;
  const photoAlt = (profile as { photoAlt?: string }).photoAlt;

  return (
    <aside className="pcard" aria-label="About the author">
      <div className="pcard__inner">
        {photo ? (
          // A plain <img>: next/image has no optimiser behind a static export.
          // eslint-disable-next-line @next/next/no-img-element
          <img className="pcard__avatar" src={photo} alt={photoAlt || handle} />
        ) : (
          <span className="pcard__avatar pcard__avatar--initials" aria-hidden="true">
            {initials}
          </span>
        )}

        <p className="pcard__name">{handle}</p>
        {profile.role ? <p className="pcard__role">{profile.role}</p> : null}

        <ul className="pcard__meta">
          {profile.location ? (
            <li>
              <Icon name="pin" />
              <span>{profile.location}</span>
            </li>
          ) : null}

          {profile.links.map((link) => (
            <li key={link.label}>
              <Icon name={iconFor(link.url)} />
              <a
                href={link.url}
                {...(isExternal(link.url) ? { target: "_blank", rel: "noreferrer" } : {})}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
