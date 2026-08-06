import Link from "next/link";

export function TagList({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null;

  return (
    <ul className="flex flex-wrap items-center gap-x-3 gap-y-1">
      {tags.map((tag) => (
        <li key={tag}>
          <Link
            href={`/blog/tag/${encodeURIComponent(tag)}`}
            className="font-mono text-[12.5px] text-zinc-400 transition-colors duration-200 hover:text-zinc-900 dark:text-zinc-600 dark:hover:text-zinc-100"
          >
            #{tag}
          </Link>
        </li>
      ))}
    </ul>
  );
}
