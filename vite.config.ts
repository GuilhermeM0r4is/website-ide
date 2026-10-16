import { defineConfig } from "vite";

// GitHub Pages project sites are served from /<repo>/, so base must match the repo name.
export default defineConfig({
  base: "/website-ide/",
});
