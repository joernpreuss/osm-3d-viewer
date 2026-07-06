import { execSync } from "node:child_process";

import { defineConfig } from "vite";

/** Bump by hand for a new version line; the build number counts on its own. */
const VERSION_BASE = "v0.1";

/** Version, commit, and build time, stamped into the page head. */
function buildInfo(): string {
  // Deploy workflow run number; counts deploys, never resets.
  const build = process.env.BUILD_NUMBER ?? "dev";
  let sha = "unknown";
  try {
    sha = execSync("git rev-parse --short HEAD", {
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
  } catch {
    // not a git checkout (e.g. a source tarball) — keep "unknown"
  }
  return `${VERSION_BASE}.${build} ${sha} ${new Date().toISOString()}`;
}

// Relative base so the build works both at the domain root and under a
// subpath (e.g. GitHub Pages project sites).
export default defineConfig({
  base: "./",
  plugins: [
    {
      name: "build-info-meta",
      transformIndexHtml() {
        return [
          {
            tag: "meta",
            attrs: { name: "build", content: buildInfo() },
            injectTo: "head",
          },
        ];
      },
    },
  ],
  server: {
    proxy: {
      "/api": "http://localhost:8000",
    },
  },
});
