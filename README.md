# Portfolio

A dark, editor-inspired portfolio site. Plain TypeScript, no UI framework, built with [Vite](https://vite.dev).

## 1. Run it locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`. Edits to any file hot-reload instantly.

## 2. Make it yours

Everything you need to personalize is in **`src/data.ts`**:

- `profile` — your name, role, bio, skills, GitHub username, LinkedIn, email
- `experience` — your roles/education, as a list
- `fallbackProjects` — shown only if the live GitHub fetch fails

The **Projects** tab fetches your public repos live from the GitHub API using
`profile.github` — no manual project list to maintain. It falls back to
`fallbackProjects` if the API call fails (e.g. offline, rate-limited).

**To add your photo:** drop an image at `public/avatar.jpg`, then set
`avatarUrl: "/avatar.jpg"` in `src/data.ts`.

**To add your résumé:** drop a PDF at `public/resume.pdf`, then set
`resumeUrl: "/resume.pdf"` in `src/data.ts`.

**To change colors/fonts:** everything is a CSS variable at the top of
`src/style.css` (`:root { ... }`) — change the values there and the whole
site updates.

## 3. Deploy to GitHub Pages

1. Push this project to a new GitHub repo (e.g. `your-username/portfolio`).
2. In **`vite.config.ts`**, set `base: "/your-repo-name/"` to match your repo's
   name exactly (skip this step / set it to `"/"` if deploying to a
   `your-username.github.io` repo instead).
3. In your repo on GitHub: **Settings → Pages → Build and deployment → Source**,
   select **GitHub Actions**.
4. Push to `main`. The included workflow at
   `.github/workflows/deploy.yml` builds and deploys automatically —
   check the **Actions** tab for progress. Your site will be live at
   `https://your-username.github.io/your-repo-name/`.

From then on, every push to `main` redeploys the site automatically.

## 4. Project structure

```
index.html          page shell + SEO/LinkedIn preview meta tags
src/data.ts          <- your content lives here
src/main.ts          rendering + tab routing + GitHub fetch logic
src/style.css         theme (CSS variables) + layout
.github/workflows/    GitHub Pages deploy workflow
```
