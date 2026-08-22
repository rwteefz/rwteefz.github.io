"use client";

import { useMemo, useState } from "react";
import siteData from "@/content/site.json";

export function Editor() {
  const [raw, setRaw] = useState(() => JSON.stringify(siteData, null, 2));
  const [message, setMessage] = useState("ready");
  const parsed = useMemo(() => { try { return JSON.parse(raw) as typeof siteData; } catch { return null; } }, [raw]);
  const updateField = (field: "title" | "introduction" | "status") => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!parsed) return;
    setRaw(JSON.stringify({ ...parsed, site: { ...parsed.site, [field]: event.target.value } }, null, 2));
    setMessage("unsaved changes");
  };
  const download = () => {
    if (!parsed) return;
    const url = URL.createObjectURL(new Blob([JSON.stringify(parsed, null, 2) + "\n"], { type: "application/json" }));
    const link = document.createElement("a"); link.href = url; link.download = "site.json"; link.click(); URL.revokeObjectURL(url);
    setMessage("downloaded — commit it to content/site.json");
  };
  return <div className="editor-box"><div className="editor-box__head"><span><span className="green">●</span> local editor</span><span>{message}</span></div><div className="quick-edit"><label>site title<input value={parsed?.site.title ?? ""} onChange={updateField("title")} /></label><label>intro<textarea rows={3} value={parsed?.site.introduction ?? ""} onChange={updateField("introduction")} /></label><label>status<input value={parsed?.site.status ?? ""} onChange={updateField("status")} /></label></div><label className="json-label">content/site.json<textarea className="json-editor" spellCheck={false} value={raw} onChange={(event) => { setRaw(event.target.value); setMessage("unsaved changes"); }} /></label><div className="editor-actions"><button className="button-link button-link--solid" type="button" disabled={!parsed} onClick={download}>download site.json ↓</button><a className="button-link" href="https://github.com/rwteefz/rwteefz.github.io" target="_blank" rel="noreferrer">open GitHub ↗</a><span className={parsed ? "valid" : "error"}>{parsed ? "valid JSON" : "JSON error — fix before downloading"}</span></div><p className="editor-help"><span className="eyebrow">workflow</span> edit here → download → replace <code>content/site.json</code> → commit. GitHub Actions publishes the update.</p></div>;
}
