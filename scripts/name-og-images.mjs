/**
 * Gives the exported Open Graph images a `.png` extension.
 *
 * Next's `opengraph-image` file convention writes each image to a file with no
 * extension. On Vercel that is fine — the route carries its own Content-Type.
 * A static host has nothing to go on but the name, so GitHub Pages serves these
 * as `application/octet-stream` and crawlers refuse them, which leaves every
 * shared link without a preview. See vercel/next.js#82177.
 *
 * Post pages name their own image in `generateMetadata`, so those tags already
 * end in `.png`. The site-wide image is emitted by the file convention, which
 * wins over anything `layout.tsx` declares, so its tag has to be rewritten here.
 *
 * Usage: node scripts/name-og-images.mjs <export-dir>
 */
import { readdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

const NAME = "opengraph-image";

/** Files whose text can carry an image URL: pages, RSC payloads, feed, sitemap. */
const REWRITABLE = new Set([".html", ".txt", ".xml"]);

/**
 * Only a name that ends the URL — `…/opengraph-image` followed by a quote or a
 * query string. Chunk paths like `/_next/…/opengraph-image/route-abc.js` share
 * the prefix and must not be touched, and a name already ending in `.png` is
 * followed by a dot, so both fall outside the lookahead.
 */
const REFERENCE = /opengraph-image(?=["'?])/g;

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

const root = process.argv[2];

if (!root) {
  console.error("사용법: node scripts/name-og-images.mjs <export-dir>");
  process.exit(1);
}

let renamed = 0;
let rewritten = 0;

for await (const file of walk(root)) {
  if (path.basename(file) === NAME) {
    await rename(file, `${file}.png`);
    renamed += 1;
    continue;
  }

  if (!REWRITABLE.has(path.extname(file))) continue;

  const before = await readFile(file, "utf8");
  const after = before.replace(REFERENCE, `${NAME}.png`);
  if (after === before) continue;

  await writeFile(file, after);
  rewritten += 1;
}

// A silent zero would mean the metadata points at .png files that do not exist,
// which only shows up later as missing previews. Fail the build instead.
if (renamed === 0) {
  console.error(`${root} 안에서 확장자 없는 ${NAME} 파일을 찾지 못했습니다.`);
  process.exit(1);
}

console.log(`OG 이미지 ${renamed}개에 .png 확장자를 붙이고, 참조 ${rewritten}개를 고쳤습니다.`);
