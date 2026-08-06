import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Mdx } from "@/components/mdx";
import { PostNav } from "@/components/post-nav";
import { TagList } from "@/components/tag-list";
import { formatDate, getAdjacentPosts, getAllPosts, getPost } from "@/lib/posts";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) return {};

  const url = `/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.summary,
      publishedTime: post.date,
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) notFound();

  return (
    <article>
      <header className="mb-12">
        <h1 className="text-[22px] leading-snug font-medium tracking-tight text-balance break-keep text-zinc-900 dark:text-zinc-100">
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

      {post.tags.length > 0 && (
        <div className="mt-16">
          <TagList tags={post.tags} />
        </div>
      )}

      <div className="mt-10">
        <PostNav {...getAdjacentPosts(post.slug)} />
      </div>
    </article>
  );
}
