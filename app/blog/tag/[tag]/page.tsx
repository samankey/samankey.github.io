import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PostList } from "@/components/post-list";
import { ogSize } from "@/lib/og";
import { getAllTags, getPostsByTag, getPostsByYear } from "@/lib/posts";
import { site } from "@/lib/site";

type PageProps = { params: Promise<{ tag: string }> };

export function generateStaticParams() {
  // Raw values — Next encodes them when building the paths.
  return getAllTags().map(({ tag }) => ({ tag }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tag } = await params;
  const label = decodeURIComponent(tag);
  const posts = getPostsByTag(label);

  if (posts.length === 0) return {};

  const title = `#${label}`;
  const url = `/blog/tag/${encodeURIComponent(label)}`;

  return {
    title,
    description: `${label} 태그가 붙은 글 ${posts.length}개`,
    alternates: { canonical: url },
    openGraph: {
      url,
      title: `${title} — ${site.name}`,
      // Declaring openGraph here would otherwise drop the parent's image, and
      // naming the file directly is what gets it a .png URL. See page.tsx for
      // a post, which has the same two reasons.
      images: [
        {
          url: `${url}/opengraph-image.png`,
          ...ogSize,
          alt: `#${label} — 글 ${posts.length}개`,
        },
      ],
    },
  };
}

export default async function TagPage({ params }: PageProps) {
  const { tag } = await params;
  const label = decodeURIComponent(tag);
  const posts = getPostsByTag(label);

  if (posts.length === 0) notFound();

  return (
    <div>
      <header className="mb-16 sm:mb-20">
        <h1 className="font-mono text-[15px] text-zinc-900 dark:text-zinc-100">#{label}</h1>
        <p className="mt-2 text-[14px] text-zinc-500 dark:text-zinc-400">글 {posts.length}개</p>
      </header>

      <PostList groups={getPostsByYear(posts)} />

      <div className="mt-20 border-t border-zinc-100 pt-8 dark:border-zinc-900">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-[14px] text-zinc-500 transition-colors duration-200 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          <span className="transition-transform duration-200 group-hover:-translate-x-0.5">←</span>
          전체 글
        </Link>
      </div>
    </div>
  );
}
