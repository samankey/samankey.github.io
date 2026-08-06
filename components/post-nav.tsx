import Link from "next/link";
import { formatDate, type Post } from "@/lib/posts";

type Direction = "older" | "newer";

const labels: Record<Direction, string> = { older: "이전", newer: "다음" };

function NavCell({ post, direction }: { post: Post | null; direction: Direction }) {
  const alignEnd = direction === "newer";

  // Keep the empty side occupied so the remaining link stays on its own edge.
  if (!post) return <div aria-hidden="true" />;

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group flex flex-col gap-1 ${alignEnd ? "items-end text-right" : "items-start"}`}
    >
      <span className="font-mono text-[11px] tracking-[0.14em] text-zinc-400 dark:text-zinc-600">
        {labels[direction]}
      </span>
      <time
        dateTime={post.date}
        className="font-mono text-[12px] text-zinc-400 tabular-nums dark:text-zinc-600"
      >
        {formatDate(post.date)}
      </time>
      <span
        className={`text-[14px] leading-snug text-balance break-keep text-zinc-600 transition-all duration-200 group-hover:text-zinc-950 dark:text-zinc-400 dark:group-hover:text-zinc-50 ${
          alignEnd ? "group-hover:translate-x-0.5" : "group-hover:-translate-x-0.5"
        }`}
      >
        {post.title}
      </span>
    </Link>
  );
}

export function PostNav({ older, newer }: { older: Post | null; newer: Post | null }) {
  if (!older && !newer) return null;

  return (
    <nav
      aria-label="이전 및 다음 글"
      className="grid grid-cols-2 gap-6 border-t border-zinc-100 pt-8 dark:border-zinc-900"
    >
      <NavCell post={older} direction="older" />
      <NavCell post={newer} direction="newer" />
    </nav>
  );
}
