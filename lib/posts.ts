import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export type PostMeta = {
  slug: string;
  title: string;
  /** ISO date, `YYYY-MM-DD`. */
  date: string;
  summary?: string;
};

export type Post = PostMeta & { content: string };

function readPostFile(fileName: string): Post {
  const slug = fileName.replace(/\.mdx?$/, "");
  const raw = fs.readFileSync(path.join(POSTS_DIR, fileName), "utf8");
  const { data, content } = matter(raw);

  if (typeof data.title !== "string" || typeof data.date !== "string") {
    throw new Error(
      `content/posts/${fileName}: frontmatter must include a string \`title\` and \`date\`.`,
    );
  }

  return {
    slug,
    title: data.title,
    date: data.date,
    summary: typeof data.summary === "string" ? data.summary : undefined,
    content,
  };
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => /\.mdx?$/.test(file))
    .map(readPostFile)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): Post | null {
  return getAllPosts().find((post) => post.slug === slug) ?? null;
}

/** Posts bucketed by year, newest year first. */
export function getPostsByYear(): { year: string; posts: Post[] }[] {
  const buckets = new Map<string, Post[]>();

  for (const post of getAllPosts()) {
    const year = post.date.slice(0, 4);
    const bucket = buckets.get(year);
    if (bucket) bucket.push(post);
    else buckets.set(year, [post]);
  }

  return [...buckets.entries()].map(([year, posts]) => ({ year, posts }));
}

/** `2026-06-18` → `2026.06.18` — formatted from the string so it is timezone-proof. */
export function formatDate(date: string): string {
  return date.slice(0, 10).replaceAll("-", ".");
}
