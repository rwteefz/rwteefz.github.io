"use client";

import { useState } from "react";

export type Project = {
  number: string;
  title: string;
  date: string;
  tag: string;
  category?: string;
  description: string;
  stack: string;
  url: string;
};

const isExternal = (url: string) => /^https?:/.test(url);

const linkProps = (url: string) =>
  isExternal(url) ? { target: "_blank", rel: "noreferrer" } : {};

/**
 * A project's subject. `category` in site.json decides it; when that is missing
 * — an entry added in the studio, say — the tag stands in, since a tag reads
 * "<kind> / <subject>" and the subject is the half a reader browses by.
 */
export const subjectOf = (project: Project) =>
  (project.category || project.tag.split("/").pop() || "").trim();

const ALL = "All";

/**
 * In the order the projects run. They arrive sorted oldest first, so counting
 * them in that order puts each subject at its earliest project, and the buttons
 * read down the same timeline as the list under them — the courses in the order
 * they were taken. Only subjects some project carries become buttons, so no
 * filter can ever come up empty.
 */
function subjects(projects: Project[]) {
  // A Map keeps the order its keys were first set, which is the order wanted.
  const counts = new Map<string, number>();
  for (const project of projects) {
    const subject = subjectOf(project);
    if (subject) counts.set(subject, (counts.get(subject) ?? 0) + 1);
  }

  return [
    { name: ALL, count: projects.length },
    ...[...counts].map(([name, count]) => ({ name, count })),
  ];
}

export function ProjectFilter({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState(ALL);

  const buttons = subjects(projects);
  const shown =
    active === ALL ? projects : projects.filter((project) => subjectOf(project) === active);

  return (
    <>
      <div className="filters" role="group" aria-label="Filter projects by subject">
        {buttons.map(({ name, count }) => (
          <button
            className={`filter${name === active ? " filter--on" : ""}`}
            key={name}
            type="button"
            aria-pressed={name === active}
            onClick={() => setActive(name)}
          >
            {name} <span className="filter__count">{count}</span>
          </button>
        ))}
      </div>

      {/* Screen readers hear the list change; everyone else can see it. */}
      <p className="filters__status" role="status">
        {active === ALL
          ? `Showing all ${projects.length} projects`
          : `Showing ${shown.length} of ${projects.length} projects · ${active}`}
      </p>

      <div className="rows">
        {shown.map((project) => (
          <a className="row" key={project.number} href={project.url} {...linkProps(project.url)}>
            <div className="row__top">
              <h3>
                {project.title} <span className="row__arrow">↗</span>
              </h3>
              <span className="row__aside">{project.date}</span>
            </div>
            <p>{project.description}</p>
            <p className="row__foot">{[project.tag, project.stack].filter(Boolean).join(" · ")}</p>
          </a>
        ))}
      </div>
    </>
  );
}
