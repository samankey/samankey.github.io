import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/** Static export: this route is a build-time artifact, not a request handler. */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
