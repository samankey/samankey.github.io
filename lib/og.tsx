import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

/**
 * Satori has no woff2 support and its bundled font covers Latin only, so Korean
 * titles would render as blank boxes without an explicit font. This reads the
 * woff subset at build time; it never reaches the client bundle.
 */
async function loadFont() {
  return readFile(path.join(process.cwd(), "app/fonts/Pretendard-Regular.subset.woff"));
}

/**
 * The same restraint as the site itself: white ground, one typeface, hierarchy
 * carried by size and grey rather than colour or ornament.
 */
export async function renderOgCard({ title, meta }: { title: string; meta: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#ffffff",
          padding: "76px 80px",
          fontFamily: "Pretendard",
        }}
      >
        <div style={{ display: "flex", fontSize: 24, color: "#a1a1aa" }}>{site.name}</div>

        <div
          style={{
            display: "flex",
            fontSize: 60,
            lineHeight: 1.3,
            letterSpacing: "-0.02em",
            color: "#18181b",
            // Satori has no ellipsis support; cap the box instead.
            maxHeight: 312,
            overflow: "hidden",
          }}
        >
          {title}
        </div>

        <div style={{ display: "flex", fontSize: 24, color: "#a1a1aa" }}>{meta}</div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        {
          name: "Pretendard",
          data: await loadFont(),
          weight: 400,
          style: "normal",
        },
      ],
    },
  );
}
