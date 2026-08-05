import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();

  return [
    {
      url: `${site.url}/`,
      lastModified: posts[0]?.date,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${site.url}/about`,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    ...posts.map((post) => ({
      url: `${site.url}/blog/${post.slug}`,
      lastModified: post.date,
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
  ];
}
