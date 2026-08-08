import { notFound } from "next/navigation";
import { ogContentType, ogSize, renderOgCard } from "@/lib/og";
import { getAllTags, getPostsByTag } from "@/lib/posts";

/** Static export: this route is a build-time artifact, not a request handler. */
export const dynamic = "force-static";

/** The per-tag alt lives in `generateMetadata` in page.tsx; see the post route. */
export const alt = "태그 미리보기 이미지";
export const size = ogSize;
export const contentType = ogContentType;

type ImageProps = { params: Promise<{ tag: string }> };

export function generateStaticParams() {
  return getAllTags().map(({ tag }) => ({ tag }));
}

export default async function Image({ params }: ImageProps) {
  const { tag } = await params;
  const label = decodeURIComponent(tag);
  const posts = getPostsByTag(label);

  if (posts.length === 0) notFound();

  return renderOgCard({ title: `#${label}`, meta: `글 ${posts.length}개` });
}
