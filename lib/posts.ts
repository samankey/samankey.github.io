import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");
const isProduction = process.env.NODE_ENV === "production";

/** Languages Shiki resolves without a grammar, so they need no registration. */
const PLAIN_LANGUAGES = new Set(["text", "plaintext", "txt", "ansi"]);

const frontmatterSchema = z.object({
  title: z.string().min(1, "비어 있을 수 없습니다"),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD 형식이어야 합니다")
    // The regex admits 2026-02-31, so confirm it round-trips as a real date.
    .refine((value) => new Date(`${value}T00:00:00Z`).toISOString().startsWith(value), {
      message: "존재하지 않는 날짜입니다",
    }),
  summary: z.string().min(1).optional(),
  tags: z.array(z.string().min(1)).default([]),
  /** Readable in dev, dropped from production builds. */
  draft: z.boolean().default(false),
});

export type PostMeta = z.infer<typeof frontmatterSchema> & { slug: string };
export type Post = PostMeta & { content: string };

function readPostFile(fileName: string): Post {
  const slug = fileName.replace(/\.mdx?$/, "");
  const raw = fs.readFileSync(path.join(POSTS_DIR, fileName), "utf8");
  const { data, content } = matter(raw);

  const parsed = frontmatterSchema.safeParse(data);

  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `  · ${issue.path.join(".") || "(최상위)"}: ${issue.message}`)
      .join("\n");
    throw new Error(`content/posts/${fileName} 의 프론트매터가 올바르지 않습니다:\n${issues}`);
  }

  return { slug, ...parsed.data, content };
}

function loadPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const posts = fs
    .readdirSync(POSTS_DIR)
    .filter((file) => /\.mdx?$/.test(file))
    .map(readPostFile)
    .filter((post) => !post.draft || !isProduction)
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  reportBrokenLinks(posts);

  return posts;
}

// Reading and parsing every file on each request is wasteful once the content is
// frozen, but caching in dev would hide edits until a restart.
let cached: Post[] | null = null;

export function getAllPosts(): Post[] {
  if (cached) return cached;

  const posts = loadPosts();
  if (isProduction) cached = posts;

  return posts;
}

export function getPost(slug: string): Post | null {
  return getAllPosts().find((post) => post.slug === slug) ?? null;
}

/** Posts bucketed by year, newest year first. */
export function getPostsByYear(posts: Post[] = getAllPosts()): { year: string; posts: Post[] }[] {
  const buckets = new Map<string, Post[]>();

  for (const post of posts) {
    const year = post.date.slice(0, 4);
    const bucket = buckets.get(year);
    if (bucket) bucket.push(post);
    else buckets.set(year, [post]);
  }

  return [...buckets.entries()].map(([year, posts]) => ({ year, posts }));
}

/** Every tag in use, most-used first, ties broken alphabetically. */
export function getAllTags(): { tag: string; count: number }[] {
  const counts = new Map<string, number>();

  for (const post of getAllPosts()) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function getPostsByTag(tag: string): Post[] {
  return getAllPosts().filter((post) => post.tags.includes(tag));
}

/** `2026-06-18` → `2026.06.18` — formatted from the string so it is timezone-proof. */
export function formatDate(date: string): string {
  return date.slice(0, 10).replaceAll("-", ".");
}

/* ------------------------------------------------------------------ *
 * Code languages                                                     *
 * ------------------------------------------------------------------ */

/**
 * The set of languages the posts actually fence with, so the Shiki highlighter
 * loads exactly those grammars instead of the whole bundle. Unknown ids throw
 * here rather than surfacing as an opaque Shiki error mid-build.
 */
export function getUsedCodeLanguages(known: (lang: string) => boolean): string[] {
  const languages = new Set<string>();

  for (const post of getAllPosts()) {
    for (const [, lang] of post.content.matchAll(/^[ \t]*```+([a-zA-Z0-9#+._-]+)/gm)) {
      const id = lang.toLowerCase();
      if (PLAIN_LANGUAGES.has(id)) continue;

      if (!known(id)) {
        throw new Error(
          `content/posts/${post.slug}.mdx 에서 Shiki가 모르는 코드 언어 \`${id}\` 를 사용했습니다.`,
        );
      }

      languages.add(id);
    }
  }

  return [...languages].sort();
}

/* ------------------------------------------------------------------ *
 * Internal links                                                     *
 * ------------------------------------------------------------------ */

/** Strips fenced and inline code so code samples cannot look like links. */
function stripCode(content: string): string {
  return content.replaceAll(/```[\s\S]*?```/g, "").replaceAll(/`[^`\n]*`/g, "");
}

function extractInternalLinks(content: string): string[] {
  const prose = stripCode(content);
  const links = [
    // [text](/path)
    ...prose.matchAll(/\]\((\/[^)\s]*)\)/g),
    // href="/path" in embedded JSX
    ...prose.matchAll(/href=["'](\/[^"']*)["']/g),
  ];

  return links.map(([, href]) => href.replace(/[?#].*$/, ""));
}

/**
 * A mistyped `/blog/...` link would otherwise ship silently and 404. Warns while
 * drafting so a link can be written before its target exists, and fails the
 * production build so it cannot reach the site.
 */
function reportBrokenLinks(posts: Post[]): void {
  const routes = new Set(["/", "/about", "/feed.xml"]);

  for (const post of posts) {
    routes.add(`/blog/${post.slug}`);
    for (const tag of post.tags) {
      routes.add(`/blog/tag/${tag}`);
      routes.add(`/blog/tag/${encodeURIComponent(tag)}`);
    }
  }

  const broken: string[] = [];

  for (const post of posts) {
    for (const href of extractInternalLinks(post.content)) {
      const normalized = href.length > 1 ? href.replace(/\/$/, "") : href;
      if (!routes.has(normalized) && !routes.has(decodeURIComponent(normalized))) {
        broken.push(`content/posts/${post.slug}.mdx → ${href}`);
      }
    }
  }

  if (broken.length === 0) return;

  const message = `존재하지 않는 내부 링크:\n${broken.map((line) => `  · ${line}`).join("\n")}`;

  if (isProduction) throw new Error(message);
  console.warn(`\n⚠ ${message}\n`);
}
