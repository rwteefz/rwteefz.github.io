"use client";

import { useMemo, useState } from "react";
import siteData from "@/content/site.json";

type Material = (typeof siteData.categories)[number]["courses"][number]["materials"][number];

const isExternal = (url: string) => /^(https?:|mailto:)/.test(url);

const materialHref = (url: string) => {
  if (isExternal(url) || url.startsWith("#")) return url;
  return `./${url.replace(/^\//, "")}`;
};

export function ExamArchive() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
  };

  const normalizedQuery = query.trim().toLocaleLowerCase("zh-CN");

  const visibleCategories = useMemo(() => {
    return siteData.categories
      .filter((category) => activeCategory === "all" || category.id === activeCategory)
      .map((category) => ({
        ...category,
        courses: category.courses.filter((course) => {
          if (!normalizedQuery) return true;
          const haystack = [
            category.title,
            category.description,
            course.name,
            course.code,
            course.description,
            ...course.materials.flatMap((item) => [
              item.year,
              item.term,
              item.type,
              item.teacher,
              item.note,
            ]),
          ]
            .join(" ")
            .toLocaleLowerCase("zh-CN");
          return haystack.includes(normalizedQuery);
        }),
      }))
      .filter((category) => category.courses.length > 0);
  }, [activeCategory, normalizedQuery]);

  const totalCourses = siteData.categories.reduce(
    (sum, category) => sum + category.courses.length,
    0,
  );
  const totalMaterials = siteData.categories.reduce(
    (sum, category) =>
      sum + category.courses.reduce((courseSum, course) => courseSum + course.materials.length, 0),
    0,
  );
  const resultCount = visibleCategories.reduce(
    (sum, category) => sum + category.courses.length,
    0,
  );

  return (
    <div className="site-frame">
      <a className="skip-link" href="#main-content">
        跳到主要内容
      </a>

      <header className="masthead">
        <div className="masthead__inner">
          <a className="brand" href="#top" aria-label={`${siteData.site.shortName} 首页`}>
            <span className="brand__mark" aria-hidden="true">
              ∫
            </span>
            <span>{siteData.site.shortName}</span>
          </a>

          <nav className="primary-nav" aria-label="课程分类导航">
            {siteData.categories.map((category) => (
              <a key={category.id} href={`#${category.id}`}>
                {category.navLabel}
              </a>
            ))}
          </nav>

          <button
            className="theme-toggle"
            type="button"
            onClick={toggleTheme}
            aria-label={darkMode ? "切换到浅色模式" : "切换到深色模式"}
            aria-pressed={darkMode}
          >
            <span aria-hidden="true">{darkMode ? "☀" : "◐"}</span>
          </button>
        </div>
      </header>

      <div className="page-shell" id="top">
        <aside className="sidebar" aria-label="站点信息">
          <div className="profile-card">
            <div className="profile-card__avatar" aria-hidden="true">
              <span>Σ</span>
            </div>
            <div className="profile-card__body">
              <p className="eyebrow">OPEN ARCHIVE</p>
              <h2>{siteData.profile.name}</h2>
              <p className="profile-card__motto">{siteData.profile.motto}</p>
              <ul className="profile-links">
                <li>
                  <span aria-hidden="true">⌖</span>
                  {siteData.profile.institution}
                </li>
                {siteData.profile.links.map((link) => (
                  <li key={link.label}>
                    <span aria-hidden="true">{link.icon}</span>
                    <a
                      href={link.url}
                      target={isExternal(link.url) && !link.url.startsWith("mailto:") ? "_blank" : undefined}
                      rel={isExternal(link.url) && !link.url.startsWith("mailto:") ? "noreferrer" : undefined}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="sidebar-index">
            <p>快速目录</p>
            <a href="#archive">试卷与资料</a>
            <a href="#submission">投稿须知</a>
            <a href="#thanks">致谢名单</a>
          </div>
        </aside>

        <main id="main-content" className="content">
          <section className="hero" aria-labelledby="page-title">
            <p className="eyebrow">{siteData.site.kicker}</p>
            <h1 id="page-title">{siteData.site.title}</h1>
            <p className="hero__lead">{siteData.site.introduction}</p>
            <div className="announcement" role="note">
              <span className="announcement__date">{siteData.announcement.date}</span>
              <p>{siteData.announcement.text}</p>
            </div>
          </section>

          <section className="archive-tools" id="archive" aria-label="资料筛选">
            <div className="search-box">
              <span aria-hidden="true">⌕</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="搜索课程、年份、教师或资料类型…"
                aria-label="搜索资料"
              />
              {query && (
                <button type="button" onClick={() => setQuery("")} aria-label="清空搜索">
                  清除
                </button>
              )}
            </div>

            <div className="filter-row" aria-label="按分类筛选">
              <button
                className={activeCategory === "all" ? "is-active" : ""}
                type="button"
                onClick={() => setActiveCategory("all")}
              >
                全部
              </button>
              {siteData.categories.map((category) => (
                <button
                  className={activeCategory === category.id ? "is-active" : ""}
                  key={category.id}
                  type="button"
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.navLabel}
                </button>
              ))}
            </div>

            <div className="archive-stats" aria-label="资料统计">
              <span>
                <strong>{totalCourses}</strong> 门课程
              </span>
              <span>
                <strong>{totalMaterials}</strong> 条资料
              </span>
              <span>
                更新于 <strong>{siteData.site.updated}</strong>
              </span>
            </div>
          </section>

          <div className="catalog" aria-live="polite">
            {visibleCategories.length > 0 ? (
              visibleCategories.map((category) => (
                <section className="category-section" id={category.id} key={category.id}>
                  <div className="section-heading">
                    <span className="section-heading__symbol" aria-hidden="true">
                      {category.symbol}
                    </span>
                    <div>
                      <p className="eyebrow">{category.courses.length} COURSES</p>
                      <h2>{category.title}</h2>
                      <p>{category.description}</p>
                    </div>
                  </div>

                  <div className="course-list">
                    {category.courses.map((course) => (
                      <section className="course-card" key={`${category.id}-${course.code}`}>
                        <div className="course-heading">
                          <span>
                            <small>{course.code}</small>
                            <strong>{course.name}</strong>
                            <em>{course.description}</em>
                          </span>
                          <span className="course-card__count">{course.materials.length} 份资料</span>
                        </div>

                        <div className="material-table-wrap">
                          <table className="material-table">
                            <thead>
                              <tr>
                                <th scope="col">学年</th>
                                <th scope="col">学期</th>
                                <th scope="col">资料</th>
                                <th scope="col">教师 / 备注</th>
                                <th scope="col">下载</th>
                              </tr>
                            </thead>
                            <tbody>
                              {course.materials.map((material: Material, index) => (
                                <tr key={`${course.code}-${material.year}-${material.type}-${index}`}>
                                  <td data-label="学年">{material.year}</td>
                                  <td data-label="学期">{material.term}</td>
                                  <td data-label="资料">
                                    <span className="material-type">{material.type}</span>
                                    <small>{material.format}</small>
                                  </td>
                                  <td data-label="教师 / 备注">
                                    <strong>{material.teacher}</strong>
                                    {material.note && <small>{material.note}</small>}
                                  </td>
                                  <td data-label="下载">
                                    {material.url ? (
                                      <a
                                        className="resource-link"
                                        href={materialHref(material.url)}
                                        target={isExternal(material.url) ? "_blank" : undefined}
                                        rel={isExternal(material.url) ? "noreferrer" : undefined}
                                      >
                                        查看 <span aria-hidden="true">↗</span>
                                      </a>
                                    ) : (
                                      <span className="resource-link is-missing">待补充</span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </section>
                    ))}
                  </div>
                </section>
              ))
            ) : (
              <div className="empty-state">
                <span aria-hidden="true">∅</span>
                <h2>没有找到匹配资料</h2>
                <p>试试其他关键词，或清除当前分类筛选。</p>
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setActiveCategory("all");
                  }}
                >
                  查看全部资料
                </button>
              </div>
            )}
          </div>

          <section className="editorial-section" id="submission">
            <p className="eyebrow">CONTRIBUTE</p>
            <h2>{siteData.submission.title}</h2>
            <p>{siteData.submission.introduction}</p>
            <ol>
              {siteData.submission.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <p className="callout">{siteData.submission.notice}</p>
          </section>

          <section className="editorial-section" id="thanks">
            <p className="eyebrow">CREDITS</p>
            <h2>{siteData.thanks.title}</h2>
            <p>{siteData.thanks.introduction}</p>
            <div className="thanks-list">
              {siteData.thanks.groups.map((group) => (
                <p key={group.year}>
                  <strong>{group.year}</strong>
                  <span>{group.names.join("、")}</span>
                </p>
              ))}
            </div>
          </section>

          <footer className="site-footer">
            <p>{siteData.site.footer}</p>
            <p>
              当前显示 <strong>{resultCount}</strong> 门课程 · 内容由社区共同维护
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
