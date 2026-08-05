import localFont from "next/font/local";

/**
 * Geist has no Hangul glyphs, so Korean text would otherwise fall through to
 * whatever the OS provides (Apple SD Gothic Neo vs. Malgun Gothic) and the page
 * would look meaningfully different per platform. Pretendard covers Hangul and
 * sits behind Geist in the stack, so Latin still renders in Geist and only the
 * characters Geist lacks reach Pretendard.
 *
 * These are the KS X 1001 subsets (2,350 precomposed syllables) — enough for
 * ordinary prose at ~262 KB per weight. Files come from the `pretendard`
 * package; see README for how to refresh them. Licensed under OFL-1.1,
 * see Pretendard-LICENSE.txt.
 */
export const pretendard = localFont({
  src: [
    {
      path: "./Pretendard-Regular.subset.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./Pretendard-Medium.subset.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-pretendard",
  display: "swap",
  // Metric-compatible fallback so swapping in Pretendard does not shift layout.
  fallback: ["Apple SD Gothic Neo", "Malgun Gothic", "sans-serif"],
});

/** Read at build time by the OG image routes — Satori cannot parse woff2. */
export const OG_FONT_PATH = "app/fonts/Pretendard-Regular.subset.woff";
