import { ogContentType, ogSize, renderOgCard } from "@/lib/og";
import { site } from "@/lib/site";

/** Static export: this route is a build-time artifact, not a request handler. */
export const dynamic = "force-static";

export const alt = `About — ${site.name}`;
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  // The card already prints site.name along the top, so the footer takes the
  // host instead — the same pairing the site-wide card uses.
  return renderOgCard({ title: "About", meta: site.url.replace(/^https?:\/\//, "") });
}
