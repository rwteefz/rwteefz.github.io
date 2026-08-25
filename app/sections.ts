import siteData from "@/content/site.json";

const lists = siteData as unknown as Record<string, unknown>;

/**
 * The sections the page and the menu agree to show: visible in site.json, and
 * not standing over an empty list. A section whose list is still empty — a new
 * Honours and Awards with nothing written in it yet — stays out of both until
 * its first entry, rather than leaving a heading with a blank space under it.
 * Writing is unaffected: its articles are markdown files, not a list here.
 */
export const visibleSections = siteData.sections.filter((section) => {
  if (!section.visible) return false;
  const list = lists[section.key];
  return !Array.isArray(list) || list.length > 0;
});
