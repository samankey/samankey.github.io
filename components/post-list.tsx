import Link from "next/link";
import { formatDate, type Post } from "@/lib/posts";

export function PostList({
  groups,
}: {
  groups: { year: string; posts: Post[] }[];
}) {
  if (groups.length === 0) {
    return (
      <p className="text-[15px] text-zinc-500 dark:text-zinc-400">
        아직 발행된 글이 없습니다.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-14 sm:gap-16">
      {groups.map(({ year, posts }) => (
        <section key={year}>
          <h2 className="mb-4 font-mono text-[11px] tracking-[0.14em] text-zinc-400 tabular-nums dark:text-zinc-600">
            {year}
          </h2>

          <ul className="flex flex-col">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex items-baseline gap-4 py-2.5 sm:gap-6"
                >
                  <time
                    dateTime={post.date}
                    className="w-[5.5rem] shrink-0 font-mono text-[12.5px] text-zinc-400 tabular-nums transition-colors duration-200 group-hover:text-zinc-600 dark:text-zinc-600 dark:group-hover:text-zinc-400"
                  >
                    {formatDate(post.date)}
                  </time>

                  <span className="text-[15px] text-zinc-700 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-zinc-950 dark:text-zinc-300 dark:group-hover:text-zinc-50">
                    {post.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
