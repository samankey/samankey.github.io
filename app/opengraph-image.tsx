import { ogContentType, ogSize, renderOgCard } from "@/lib/og";
import { site } from "@/lib/site";

export const alt = site.description;
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return renderOgCard({
    title: site.description,
    meta: site.url.replace(/^https?:\/\//, ""),
  });
}
