import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Mdx } from "@/components/mdx";
import { formatDate, getAllPosts, getPost } from "@/lib/posts";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) return {};

  return {
    title: post.title,
    description: post.summary,
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) notFound();

  return (
    <article>
      <header className="mb-12">
        <h1 className="text-[22px] leading-snug font-medium tracking-tight text-balance text-zinc-900 dark:text-zinc-100">
          {post.title}
        </h1>
        <time
          dateTime={post.date}
          className="mt-3 block font-mono text-[12.5px] text-zinc-400 tabular-nums dark:text-zinc-600"
        >
          {formatDate(post.date)}
        </time>
      </header>

      <div className="post-body text-zinc-700 dark:text-zinc-300">
        <Mdx source={post.content} />
      </div>

      <div className="mt-20 border-t border-zinc-100 pt-8 dark:border-zinc-900">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-[14px] text-zinc-500 transition-colors duration-200 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          <span className="transition-transform duration-200 group-hover:-translate-x-0.5">←</span>
          목록으로
        </Link>
      </div>
    </article>
  );
}
