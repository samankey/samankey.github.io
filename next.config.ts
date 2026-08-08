import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * GitHub Pages serves files, not a Node server, so every route has to be a
   * file on disk. Nothing here needs a request: there is no middleware, no
   * server action, and no route that reads cookies, headers or search params.
   */
  output: "export",

  /**
   * `next build` and `next dev` share `.next/`, and a build rewrites it. Running
   * a verification build while a dev server is up deletes the files that server
   * is actively writing, and it then fails with
   * `ENOENT … .next/static/development/_buildManifest.js.tmp.*` on every refresh
   * until it is restarted.
   *
   * `pnpm build:verify` sets this so those builds land somewhere else and leave
   * a running dev server alone. Deploys use the default.
   */
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
