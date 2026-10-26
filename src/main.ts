import "./style.css";
import {
  profile,
  aboutSummary,
  workExperience,
  education,
  certifications,
  volunteering,
  fallbackProjects,
  type ProjectEntry,
} from "./data";


// ============================================================
// SECTIONS — the four "files" that can be opened as tabs
// ============================================================

type SectionId = "about" | "experience" | "projects" | "contact";

const SECTIONS: { id: SectionId; file: string; color: string }[] = [
  { id: "about", file: "about.md", color: "var(--purple)" },
  { id: "experience", file: "experience.ts", color: "var(--cyan)" },
  { id: "projects", file: "projects/", color: "var(--green)" },
  { id: "contact", file: "contact.sh", color: "var(--orange)" },
];

const sectionInfo = (id: SectionId) => SECTIONS.find((s) => s.id === id)!;


// ============================================================
// COLOR HELPERS
// ============================================================

const PALETTE = [
  "var(--purple)",
  "var(--cyan)",
  "var(--blue)",
  "var(--blue-light)",
  "var(--blue-dark)",
  "var(--green)",
  "var(--orange)",
];

// deterministic color per string, so the same language always gets the same accent
function colorFor(key: string): string {
  let hash = 0;
  for (const ch of key) {
    hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  }
  return PALETTE[hash % PALETTE.length];
}

// each experience category starts at a different point in the palette, and entries within
// a category step forward by 2 instead of 1, so adjacent cards never land on neighboring hues
function categoryColor(categoryStart: number, indexInCategory: number): string {
  return PALETTE[(categoryStart + indexInCategory * 2) % PALETTE.length];
}


// ============================================================
// PUBLIC ASSET PATHS
// ============================================================

// Vite only rewrites base-relative paths it can see statically in index.html — paths built
// here in JS (like the avatar src) need this to still work under vite.config.ts's `base`.
const publicUrl = (path: string) => `${import.meta.env.BASE_URL}${path}`;


// ============================================================
// APP STATE
// ============================================================

const app = document.querySelector<HTMLDivElement>("#app")!;

// open tabs behave like a real editor: order = open order, `active` = focused tab
const initialHash = location.hash.replace("#", "");
const initial: SectionId = SECTIONS.some((s) => s.id === initialHash)
  ? (initialHash as SectionId)
  : "about";

let openTabs: SectionId[] = [initial];
let active: SectionId | null = initial;

let sidebarWidth = parseInt(localStorage.getItem("sidebarWidth") || "", 10) || 260;
// never start wider than half the current window, so a width saved on a bigger screen
// doesn't force a horizontal scrollbar on a smaller one
sidebarWidth = Math.min(sidebarWidth, Math.max(160, Math.floor(window.innerWidth * 0.5)));

// on mobile the explorer is collapsed by default, and opened with the toggle button
let sidebarMobileOpen = false;


// ============================================================
// TAB ACTIONS
// ============================================================

function openSection(id: SectionId) {
  if (!openTabs.includes(id)) {
    openTabs.push(id);
  }
  active = id;
  location.hash = id;
  render();
}

function closeTab(id: SectionId, evt: Event) {
  evt.stopPropagation();

  const idx = openTabs.indexOf(id);
  if (idx === -1) return;

  openTabs.splice(idx, 1);

  if (active === id) {
    active = openTabs[idx] ?? openTabs[idx - 1] ?? null;
    location.hash = active ?? "";
  }

  render();
}

function reorderTab(fromId: SectionId, toId: SectionId) {
  const fromIdx = openTabs.indexOf(fromId);
  const toIdx = openTabs.indexOf(toId);
  if (fromIdx === -1 || toIdx === -1 || fromIdx === toIdx) return;

  openTabs.splice(fromIdx, 1);
  openTabs.splice(toIdx, 0, fromId);
  render();
}


// ============================================================
// SHELL — title bar, tabs, sidebar, status bar
// ============================================================

function renderShell() {
  app.innerHTML = `
    <div class="titlebar">
      <div class="titlebar__dots"><span></span><span></span><span></span></div>
      <div class="titlebar__label">${profile.siteTitle} — portfolio</div>
    </div>

    <div class="shell">
      <div class="main">
        <div class="tabs" role="tablist" aria-label="Open files">
          ${openTabs
            .map((id) => {
              const s = sectionInfo(id);
              return `
                <div
                  class="tab-group"
                  data-selected="${id === active}"
                  data-section="${id}"
                  draggable="true"
                  style="--tab-accent:${s.color}"
                >
                  <button class="tab" role="tab" data-section="${id}" aria-selected="${id === active}">
                    ${s.file}
                  </button>
                  <button class="tab-close" data-close="${id}" aria-label="Close ${s.file}">×</button>
                </div>
              `;
            })
            .join("")}
        </div>

        <div class="content" id="content" role="tabpanel"></div>
      </div>

      <div class="sidebar-resizer" id="resizer"></div>

      <nav class="sidebar" id="sidebar" style="width:${sidebarWidth}px" aria-label="Sections">
        <button class="sidebar-toggle" id="sidebarToggle" aria-expanded="${sidebarMobileOpen}">
          <span>explorer</span>
          <span>${sidebarMobileOpen ? "▾" : "▸"}</span>
        </button>

        <div class="sidebar-body ${sidebarMobileOpen ? "open" : ""}" id="sidebarBody">
          <div class="sidebar__heading">explorer</div>

          ${SECTIONS.map(
            (s) => `
              <button class="file-row" data-section="${s.id}" aria-current="${s.id === active}">
                <span class="file-row__dot" style="color:${s.color}">●</span> ${s.file}
              </button>
            `
          ).join("")}

          <div class="sidebar__heading">links</div>

          <a class="file-row file-row--link" href="https://github.com/${profile.github}" target="_blank" rel="noopener">
            github.com/${profile.github}
          </a>
          <a class="file-row file-row--link" href="${profile.linkedin}" target="_blank" rel="noopener">
            linkedin.com/in/…
          </a>
        </div>
      </nav>
    </div>

    <div class="statusbar">
      <div class="statusbar__group">
        <span class="statusbar__branch">⎇ main</span>
        <span>${profile.location}</span>
      </div>
      <div class="statusbar__group">
        <span>Computer Engineering</span>
        <span>UTF-8</span>
      </div>
    </div>
  `;

  app.querySelectorAll<HTMLButtonElement>("[data-section].file-row, [data-section].tab").forEach((el) => {
    el.addEventListener("click", () => openSection(el.dataset.section as SectionId));
  });

  app.querySelectorAll<HTMLButtonElement>("[data-close]").forEach((el) => {
    el.addEventListener("click", (evt) => closeTab(el.dataset.close as SectionId, evt));
  });

  document.getElementById("sidebarToggle")?.addEventListener("click", () => {
    sidebarMobileOpen = !sidebarMobileOpen;
    render();
  });

  attachTabDrag();
  attachSidebarResize();
}

function attachTabDrag() {
  app.querySelectorAll<HTMLDivElement>(".tab-group").forEach((group) => {
    group.addEventListener("dragstart", (e) => {
      e.dataTransfer?.setData("text/plain", group.dataset.section!);
    });

    group.addEventListener("dragover", (e) => e.preventDefault());

    group.addEventListener("drop", (e) => {
      e.preventDefault();
      const fromId = e.dataTransfer?.getData("text/plain") as SectionId;
      reorderTab(fromId, group.dataset.section as SectionId);
    });
  });
}

function attachSidebarResize() {
  const resizer = document.getElementById("resizer");
  const sidebar = document.getElementById("sidebar");
  if (!resizer || !sidebar) return;

  resizer.addEventListener("pointerdown", (downEvt) => {
    downEvt.preventDefault();
    resizer.classList.add("active");

    // sidebar sits on the right, so its width is the distance from the cursor to the window edge
    const onMove = (moveEvt: PointerEvent) => {
      sidebarWidth = Math.min(480, Math.max(160, window.innerWidth - moveEvt.clientX));
      sidebar.style.width = `${sidebarWidth}px`;
    };

    const onUp = () => {
      resizer.classList.remove("active");
      localStorage.setItem("sidebarWidth", String(sidebarWidth));
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  });
}


// ============================================================
// ABOUT TAB
// ============================================================

function renderAbout(): string {
  const avatarSrc = profile.avatarUrl ? publicUrl(profile.avatarUrl) : "";

  return `
    <div class="section-label" style="color:${sectionInfo("about").color}"># ~/about</div>

    <div class="about__header">
      <img class="avatar" id="avatar-img" src="${avatarSrc}" alt="${profile.name}" />
      <div>
        <h1 class="name">${profile.name}</h1>
        <div class="role-line">${profile.role}</div>
      </div>
    </div>

    <div class="terminal-line">
      <span class="prompt">$</span> whoami<br>
      ${profile.tagline}<span class="caret"></span>
    </div>

    <p class="bio">${profile.bio}</p>

    <div class="tags">
      ${profile.skills.map((s) => `<span class="tag">${s}</span>`).join("")}
    </div>

    <div class="section-label">## current_focus</div>
    <div class="list-block">
      <ul>${profile.currentFocus.map((f) => `<li>${f}</li>`).join("")}</ul>
    </div>

    <div class="section-label">## fun_facts</div>
    <div class="list-block">
      <ul>${profile.funFacts.map((f) => `<li>${f}</li>`).join("")}</ul>
    </div>
  `;
}

// swap a broken/missing avatar image for the placeholder instead of showing a broken-image icon
function wireAvatarFallback() {
  const img = document.getElementById("avatar-img") as HTMLImageElement | null;
  if (!img) return;

  if (!profile.avatarUrl) {
    img.replaceWith(
      Object.assign(document.createElement("div"), {
        className: "avatar",
        innerHTML: "[your<br>photo]",
      })
    );
    return;
  }

  img.addEventListener("error", () => {
    img.replaceWith(
      Object.assign(document.createElement("div"), {
        className: "avatar",
        innerHTML: "[photo not found]",
      })
    );
  });
}


// ============================================================
// EXPERIENCE TAB
// ============================================================

function renderExperience(): string {
  return `
    <div class="section-label" style="color:${sectionInfo("experience").color}"># ~/experience</div>
    <p class="summary">${aboutSummary}</p>

    <div class="section-label">## work_experience</div>
    ${workExperience
      .map(
        (e, i) => `
          <div class="card exp-card" style="--entry-accent:${categoryColor(1, i)}">
            <div class="card__top">
              <div>
                <div class="card__title">${e.role}</div>
                <div class="card__org">${e.org}</div>
              </div>
              <div class="card__meta">${e.meta}</div>
            </div>
            <ul>${e.bullets.map((b) => `<li>${b}</li>`).join("")}</ul>
          </div>
        `
      )
      .join("")}

    <div class="section-label">## education</div>
    ${education
      .map(
        (e, i) => `
          <div class="card exp-card" style="--entry-accent:${categoryColor(0, i)}">
            <div class="card__top">
              <div>
                <div class="card__title">${e.degree}</div>
                <div class="card__org">${e.school}</div>
              </div>
              <div class="card__meta">${e.period}</div>
            </div>
            <div class="card__desc">${e.description}</div>
          </div>
        `
      )
      .join("")}

    <div class="section-label">## licenses_and_certifications</div>
    ${certifications
      .map(
        (c, i) => `
          <div class="card exp-card" style="--entry-accent:${categoryColor(5, i)}">
            <div class="card__top">
              <div>
                <div class="card__title">${c.name}</div>
                <div class="card__org">${c.issuer}</div>
              </div>
            </div>
          </div>
        `
      )
      .join("")}

    <div class="section-label">## volunteering</div>
    ${volunteering
      .map(
        (v, i) => `
          <div class="card exp-card" style="--entry-accent:${categoryColor(6, i)}">
            <div class="card__top">
              <div>
                <div class="card__title">${v.role}</div>
                <div class="card__org">${v.org} · ${v.category}</div>
              </div>
              <div class="card__meta">${v.period}</div>
            </div>
            <ul>${v.bullets.map((b) => `<li>${b}</li>`).join("")}</ul>
          </div>
        `
      )
      .join("")}
  `;
}


// ============================================================
// PROJECTS TAB — live GitHub repos, with a static fallback
// ============================================================

function projectCard(p: ProjectEntry): string {
  const langColor = p.language ? colorFor(p.language) : "var(--text-faint)";
  const meta = p.fork ? "fork" : p.stars ? `★ ${p.stars}` : p.language ?? "";

  return `
    <a class="card" href="${p.url}" target="_blank" rel="noopener" style="display:block">
      <div class="card__top">
        <span class="card__title" style="color:${langColor}">${p.name}</span>
        <span class="card__meta" style="color:${langColor}">${meta}</span>
      </div>
      <div class="card__desc">${p.description || "No description yet."}</div>
    </a>
  `;
}

// GitHub paginates at 100 repos per page; loop until a short page tells us we're done
async function fetchAllRepos(username: string): Promise<any[]> {
  const repos: any[] = [];

  for (let page = 1; page <= 5; page++) {
    const url = `https://api.github.com/users/${username}/repos?sort=updated&per_page=100&page=${page}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("GitHub API request failed");

    const batch = await res.json();
    if (!Array.isArray(batch) || batch.length === 0) break;

    repos.push(...batch);
    if (batch.length < 100) break;
  }

  return repos;
}

async function renderProjects(container: HTMLElement) {
  container.innerHTML = `
    <div class="section-label" style="color:${sectionInfo("projects").color}"># ~/projects</div>
    <div id="projects-list">
      <div class="state-msg">Fetching repos from github.com/${profile.github}…</div>
    </div>
  `;

  const list = container.querySelector("#projects-list")!;

  try {
    const repos = await fetchAllRepos(profile.github);
    if (repos.length === 0) throw new Error("No repos found");

    const projects: ProjectEntry[] = repos.map((r) => ({
      name: r.name,
      description: r.description ?? "",
      url: r.html_url,
      stars: r.stargazers_count,
      language: r.language,
      fork: r.fork,
    }));

    list.innerHTML = `
      <div class="state-msg" style="margin-bottom:12px">${projects.length} repositories</div>
      ${projects.map(projectCard).join("")}
    `;
  } catch {
    list.innerHTML = `
      <div class="state-msg" style="margin-bottom:12px">
        Couldn't reach the GitHub API — showing placeholders. Set profile.github in src/data.ts to your real username.
      </div>
      ${fallbackProjects.map(projectCard).join("")}
    `;
  }
}


// ============================================================
// CONTACT TAB
// ============================================================

function shortLinkedin(url: string): string {
  const match = url.match(/linkedin\.com\/(.+?)\/?$/);
  return match ? `linkedin.com/${match[1]}` : url.replace(/^https?:\/\//, "");
}

function renderContact(): string {
  const resumeRow = profile.resumeUrl
    ? `
      <li>
        <span>resume</span>
        <a href="${publicUrl(profile.resumeUrl)}" target="_blank" rel="noopener">download.pdf</a>
      </li>
    `
    : "";

  return `
    <div class="section-label" style="color:${sectionInfo("contact").color}"># ~/contact.sh</div>
    <div class="terminal-line"><span class="prompt">$</span> cat contact.sh</div>

    <ul class="contact-list">
      <li>
        <span>email</span>
        <a href="mailto:${profile.email}">${profile.email}</a>
      </li>
      <li>
        <span>github</span>
        <a href="https://github.com/${profile.github}" target="_blank" rel="noopener">github.com/${profile.github}</a>
      </li>
      <li>
        <span>linkedin</span>
        <a href="${profile.linkedin}" target="_blank" rel="noopener" title="${profile.linkedin}">
          ${shortLinkedin(profile.linkedin)}
        </a>
      </li>
      ${resumeRow}
    </ul>
  `;
}


// ============================================================
// ROOT RENDER — picks the active tab's content
// ============================================================

function render() {
  renderShell();
  const content = document.querySelector<HTMLDivElement>("#content")!;

  if (!active) {
    content.innerHTML = `<div class="empty-state">No file open — pick one from the explorer →</div>`;
    return;
  }

  if (active === "about") {
    content.innerHTML = renderAbout();
    wireAvatarFallback();
  } else if (active === "experience") {
    content.innerHTML = renderExperience();
  } else if (active === "contact") {
    content.innerHTML = renderContact();
  } else if (active === "projects") {
    renderProjects(content);
  }
}

render();

// re-clamp the sidebar width if the window is resized after load, so a width saved on a
// bigger screen can't force a horizontal scrollbar on a smaller one
window.addEventListener("resize", () => {
  const sidebar = document.getElementById("sidebar");
  if (!sidebar) return;

  const maxAllowed = Math.max(160, Math.min(480, Math.floor(window.innerWidth * 0.5)));
  if (sidebarWidth > maxAllowed) {
    sidebarWidth = maxAllowed;
    sidebar.style.width = `${sidebarWidth}px`;
  }
});
