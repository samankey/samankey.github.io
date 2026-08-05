import { PostList } from "@/components/post-list";
import { getPostsByYear } from "@/lib/posts";
import { site } from "@/lib/site";

export default function HomePage() {
  const groups = getPostsByYear();

  return (
    <div>
      <p className="mb-16 max-w-[34rem] text-[15px] leading-[1.8] text-zinc-500 sm:mb-20 dark:text-zinc-400">
        {site.description}
      </p>

      <PostList groups={groups} />
    </div>
  );
}
