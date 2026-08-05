import { notFound } from "next/navigation";
import { ogContentType, ogSize, renderOgCard } from "@/lib/og";
import { formatDate, getAllPosts, getPost } from "@/lib/posts";

type ImageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

/** `alt` cannot be a static export here — it has to name the specific post. */
export async function generateImageMetadata({ params }: ImageProps) {
  const { slug } = await params;
  const post = getPost(slug);

  return [
    {
      id: "default",
      alt: post ? `${post.title} — ${formatDate(post.date)}` : "포스트",
      size: ogSize,
      contentType: ogContentType,
    },
  ];
}

export default async function Image({ params }: ImageProps) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) notFound();

  return renderOgCard({ title: post.title, meta: formatDate(post.date) });
}
