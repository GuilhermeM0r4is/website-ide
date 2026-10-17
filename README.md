# guilherme-morais.dev

A personal portfolio site styled after a code editor — file explorer, draggable tabs, line numbers, a status bar — built with plain TypeScript and no UI framework.

**Live:** https://GuilhermeM0r4is.github.io/website-ide/

## Features

- **Editor-style navigation.** Sections (`about.md`, `experience.ts`, `projects/`, `contact.sh`) open as tabs when clicked from the sidebar, just like files in an IDE. Tabs can be closed, reopened, and dragged into a different order.
- **Resizable sidebar.** Drag the handle between the content and the explorer to resize it; the width is remembered between visits.
- **Live GitHub projects.** The Projects tab fetches all public repos for a given GitHub username at runtime — no manual project list to maintain — and falls back to static placeholders if the API is unreachable.
- **Color-coded by language.** Each project's name and language tag share one color, consistently assigned per language across the whole list.
- **Dark, Zed-inspired theme.** A neutral gray base with a purple/cyan/blue/green/orange accent palette, defined entirely as CSS variables.

## Tech stack

Vite + vanilla TypeScript. No frontend framework — the UI is built with direct DOM rendering. Deployed as a static site to GitHub Pages via GitHub Actions.

## Getting started

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`. Edits to any file hot-reload instantly.

```bash
npm run build    # type-checks and builds to dist/
npm run preview  # serves the production build locally
```

## Customizing

Everything you'd want to personalize lives in **`src/data.ts`**: name, bio, skills, current focus, fun facts, GitHub username, LinkedIn, email, and the work experience / education / certifications / volunteering entries.

**Photo:** drop an image in `public/` (e.g. `avatar.jpg`) and set `avatarUrl: "avatar.jpg"` in `src/data.ts` — no leading slash, the app prefixes it with the site's base path automatically.

**Résumé:** same idea — drop a PDF in `public/` and set `resumeUrl` to its filename.

**Colors/fonts:** all defined as CSS variables at the top of `src/style.css` (`:root { ... }`).

## Deploying

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub Pages automatically. Make sure **Settings → Pages → Source** is set to **GitHub Actions**, and that `vite.config.ts`'s `base` matches your repo name (`/your-repo-name/`), or is `/` if you're using a custom domain.

## Project structure

```
index.html            page shell + SEO/social preview meta tags
src/data.ts            your content — the file you'll actually edit
src/main.ts             rendering, tab logic, GitHub fetch
src/style.css            theme (CSS variables) + layout
.github/workflows/       GitHub Pages deploy workflow
```
