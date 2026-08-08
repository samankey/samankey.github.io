/**
 * Absolute origin, no trailing slash. Used for canonical URLs, OG tags, the
 * feed and the sitemap — set NEXT_PUBLIC_SITE_URL in the deploy environment.
 */
const url = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const site = {
  name: "samankey",
  title: "samankey",
  description: "글쓰기, 프론트엔드, 그리고 만드는 일에 대한 기록.",
  url,
  locale: "ko_KR",
  email: "samankeycc@gmail.com",
  github: "https://github.com/samankey",
} as const;
