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

/**
 * An optional `YYYY-MM-DD-` prefix keeps content/posts sorted chronologically in
 * any file listing. It is stripped from the slug so the date never reaches the
 * URL — otherwise a post could not be redated without breaking its permalink.
 */
const DATE_PREFIX = /^(\d{4}-\d{2}-\d{2})-/;

export type PostMeta = z.infer<typeof frontmatterSchema> & {
  slug: string;
  /** Kept so diagnostics can name the real file rather than rebuild its name. */
  fileName: string;
};
export type Post = PostMeta & { content: string };

function readPostFile(fileName: string): Post {
  const base = fileName.replace(/\.mdx?$/, "");
  const prefix = base.match(DATE_PREFIX)?.[1];
  const slug = base.replace(DATE_PREFIX, "");
  const raw = fs.readFileSync(path.join(POSTS_DIR, fileName), "utf8");
  const { data, content } = matter(raw);

  const parsed = frontmatterSchema.safeParse(data);

  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `  · ${issue.path.join(".") || "(최상위)"}: ${issue.message}`)
      .join("\n");
    throw new Error(`content/posts/${fileName} 의 프론트매터가 올바르지 않습니다:\n${issues}`);
  }

  if (slug === "") {
    throw new Error(
      `content/posts/${fileName} 은 날짜 접두사만 있고 slug가 없습니다. ${prefix}-제목.mdx 형태로 바꾸세요.`,
    );
  }

  // The prefix is only a label, so frontmatter stays the single source of truth —
  // but a label that contradicts it would go unnoticed, since the filename shows
  // up only in a file listing and the frontmatter date is what the site renders.
  if (prefix && prefix !== parsed.data.date) {
    throw new Error(
      `content/posts/${fileName} 의 파일명 날짜(${prefix})가 frontmatter date(${parsed.data.date})와 다릅니다.\n` +
        `  · 파일명을 ${parsed.data.date}-${slug}.mdx 로 바꾸거나, frontmatter를 고치세요.`,
    );
  }

  return { slug, fileName, ...parsed.data, content };
}

/**
 * Stripping the date prefix means two files dated differently can collapse onto
 * one slug, which would silently leave one of them unreachable.
 */
function assertUniqueSlugs(posts: Post[]): void {
  const seen = new Map<string, string>();

  for (const post of posts) {
    const previous = seen.get(post.slug);

    if (previous) {
      throw new Error(
        `slug \`${post.slug}\` 가 중복됩니다: content/posts/${previous} 와 content/posts/${post.fileName}`,
      );
    }

    seen.set(post.slug, post.fileName);
  }
}

function loadPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const all = fs
    .readdirSync(POSTS_DIR)
    .filter((file) => /\.mdx?$/.test(file))
    .map(readPostFile);

  // Checked across every file, drafts included: a draft colliding with a
  // published post is a mistake worth surfacing before the draft goes live.
  assertUniqueSlugs(all);

  const posts = all
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

/** Neighbours in reading order. Posts are sorted newest first, so older is +1. */
export function getAdjacentPosts(slug: string): { older: Post | null; newer: Post | null } {
  const posts = getAllPosts();
  const index = posts.findIndex((post) => post.slug === slug);

  if (index === -1) return { older: null, newer: null };

  return {
    older: posts[index + 1] ?? null,
    newer: posts[index - 1] ?? null,
  };
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
          `content/posts/${post.fileName} 에서 Shiki가 모르는 코드 언어 \`${id}\` 를 사용했습니다.`,
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
        broken.push(`content/posts/${post.fileName} → ${href}`);
      }
    }
  }

  if (broken.length === 0) return;

  const message = `존재하지 않는 내부 링크:\n${broken.map((line) => `  · ${line}`).join("\n")}`;

  if (isProduction) throw new Error(message);
  console.warn(`\n⚠ ${message}\n`);
}
