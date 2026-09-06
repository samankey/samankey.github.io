import { PostList } from "@/components/post-list";
import { getPostsByYear } from "@/lib/posts";

/**
 * 홈은 글 목록으로 바로 들어간다. `site.description` 은 about/resume 과 겹치는
 * 소개라 화면에서는 빼고, 메타데이터·RSS·OG 이미지에서만 계속 쓴다.
 */
export default function HomePage() {
  return <PostList groups={getPostsByYear()} />;
}
