import { getAllPosts } from "@/lib/posts";
import { site } from "@/lib/site";

/** Escapes the five XML predefined entities. */
function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

/** RFC 822, which is what RSS 2.0 requires for pubDate. */
function toRfc822(date: string): string {
  return new Date(`${date}T00:00:00Z`).toUTCString();
}

export const dynamic = "force-static";

export function GET() {
  const posts = getAllPosts();

  // Summary-only feed: the body stays on the site rather than being rendered
  // twice. Swap in compiled HTML inside <content:encoded> if that changes.
  const items = posts
    .map((post) => {
      const url = `${site.url}/blog/${post.slug}`;
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${toRfc822(post.date)}</pubDate>
${post.summary ? `      <description>${escapeXml(post.summary)}</description>\n` : ""}    </item>`;
    })
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(site.title)}</title>
    <link>${escapeXml(site.url)}</link>
    <description>${escapeXml(site.description)}</description>
    <language>ko</language>
    <atom:link href="${escapeXml(`${site.url}/feed.xml`)}" rel="self" type="application/rss+xml" />
${posts[0] ? `    <lastBuildDate>${toRfc822(posts[0].date)}</lastBuildDate>\n` : ""}${items}
  </channel>
</rss>
`;

  return new Response(body, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=3600",
    },
  });
}
