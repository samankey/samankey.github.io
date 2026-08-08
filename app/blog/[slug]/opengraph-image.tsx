import { notFound } from "next/navigation";
import { ogContentType, ogSize, renderOgCard } from "@/lib/og";
import { formatDate, getAllPosts, getPost } from "@/lib/posts";

/** Static export: this route is a build-time artifact, not a request handler. */
export const dynamic = "force-static";

/**
 * `generateImageMetadata` would let `alt` name the specific post, but it makes
 * the route depend on params for a segment nothing can supply, and
 * `output: export` rejects that. The per-post alt lives in `generateMetadata`
 * in page.tsx instead; this is the fallback nothing should reach.
 */
export const alt = "포스트 미리보기 이미지";
export const size = ogSize;
export const contentType = ogContentType;

type ImageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export default async function Image({ params }: ImageProps) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) notFound();

  return renderOgCard({ title: post.title, meta: formatDate(post.date) });
}
