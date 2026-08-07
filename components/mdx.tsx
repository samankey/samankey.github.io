import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeShikiFromHighlighter from "@shikijs/rehype/core";
import { bundledLanguages, createHighlighter, type Highlighter } from "shiki";
import {
  transformerMetaHighlight,
  transformerNotationHighlight,
} from "@shikijs/transformers";
import type { ShikiTransformer } from "shiki";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "@/components/code-block";
import { getUsedCodeLanguages } from "@/lib/posts";

/** Marks the anchor that rehype-autolink-headings appends to each heading. */
const HEADING_ANCHOR_CLASS = "heading-anchor";

const autolinkOptions = {
  behavior: "append",
  properties: { className: [HEADING_ANCHOR_CLASS], "aria-label": "이 섹션 링크" },
  content: { type: "text", value: "#" },
} as const;

/**
 * `defaultColor: false` makes Shiki emit both themes as CSS variables
 * (`--shiki-light` / `--shiki-dark`) instead of baking one in; globals.css
 * decides which one applies.
 */
/**
 * Shiki has no built-in notion of a filename, so lift it off the fence meta
 * (```ts filename=lib/posts.ts) onto the `pre` for CodeBlock to render.
 */
function transformerFilename(): ShikiTransformer {
  return {
    name: "filename",
    pre(node) {
      const raw = this.options.meta?.__raw ?? "";
      const match = raw.match(/(?:^|\s)filename=(?:"([^"]+)"|'([^']+)'|(\S+))/);
      const filename = match?.[1] ?? match?.[2] ?? match?.[3];

      if (filename) node.properties["data-filename"] = filename;
    },
  };
}

const shikiOptions = {
  themes: {
    light: "github-light",
    dark: "github-dark",
  },
  defaultColor: false,
  transformers: [
    transformerFilename(),
    // `// [!code highlight]` on a line, and ```ts {2,5-7} on the fence.
    transformerNotationHighlight({ matchAlgorithm: "v3" }),
    transformerMetaHighlight(),
  ],
} as const;

/**
 * `@shikijs/rehype` already shares one highlighter process-wide via
 * `getSingletonHighlighter`, so this is not about avoiding repeat construction.
 * It is about `options.langs || Object.keys(bundledLanguages)`: left to its
 * default the plugin registers every grammar in the bundle — 364 of them,
 * measured at ~2s and ~170MB of resident memory. Passing a highlighter built
 * from just the languages the posts fence with costs ~31ms and 11 grammars.
 */
let highlighter: Promise<Highlighter> | null = null;

function getHighlighter(): Promise<Highlighter> {
  highlighter ??= createHighlighter({
    themes: Object.values(shikiOptions.themes),
    langs: getUsedCodeLanguages((lang) => lang in bundledLanguages),
  });

  return highlighter;
}

function Anchor({ href = "", className: incoming, ...props }: ComponentPropsWithoutRef<"a">) {
  // The autolinked heading anchor is decoration, not prose — it opts out of the
  // underline treatment and only surfaces when its heading is hovered.
  if (incoming?.includes(HEADING_ANCHOR_CLASS)) {
    return (
      <a
        href={href}
        className="absolute top-0 -left-5 font-mono text-zinc-300 no-underline opacity-0 transition-opacity duration-200 group-hover:opacity-100 focus-visible:opacity-100 dark:text-zinc-600"
        {...props}
      />
    );
  }

  const className =
    "underline decoration-zinc-300 decoration-1 underline-offset-[3px] transition-colors duration-200 hover:decoration-zinc-900 dark:decoration-zinc-600 dark:hover:decoration-zinc-100";

  if (href.startsWith("/")) {
    return <Link href={href} className={className} {...props} />;
  }

  return (
    <a
      href={href}
      target={href.startsWith("#") ? undefined : "_blank"}
      rel={href.startsWith("#") ? undefined : "noreferrer"}
      className={className}
      {...props}
    />
  );
}

/**
 * Plain <img>, not next/image: the assets are local and already sized for the
 * column, next/image cannot optimize animated GIFs anyway, and staying off it
 * keeps the door open for `output: "export"`. Pass width/height so the reserved
 * box is right and lazy-loaded images below the fold don't shift the page.
 */
function PostImage({ alt = "", ...props }: ComponentPropsWithoutRef<"img">) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt}
      loading="lazy"
      decoding="async"
      className="my-6 h-auto w-full rounded-md border border-zinc-200 dark:border-zinc-800"
      {...props}
    />
  );
}

const components = {
  a: Anchor,
  pre: CodeBlock,
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2
      className="group relative mt-12 mb-4 text-[17px] font-medium tracking-tight text-zinc-900 dark:text-zinc-100"
      {...props}
    />
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <h3
      className="group relative mt-10 mb-3 text-[15px] font-medium text-zinc-900 dark:text-zinc-100"
      {...props}
    />
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p className="my-5 text-[15px] leading-[1.8]" {...props} />
  ),
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul className="my-5 list-disc space-y-2 pl-5 text-[15px] leading-[1.8] marker:text-zinc-300 dark:marker:text-zinc-600" {...props} />
  ),
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol className="my-5 list-decimal space-y-2 pl-5 text-[15px] leading-[1.8] marker:text-zinc-400 dark:marker:text-zinc-500" {...props} />
  ),
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className="my-6 border-l border-zinc-200 pl-4 text-[15px] leading-[1.8] text-zinc-500 dark:border-zinc-700 dark:text-zinc-400"
      {...props}
    />
  ),
  // `img` covers markdown `![alt](src)`. `Img` is the same component under a
  // capitalised name because MDX only routes markdown-generated nodes through
  // this map — a literal lowercase <img> in an MDX file renders as a bare
  // element and silently skips it. Use <Img> when width/height are needed.
  img: PostImage,
  Img: PostImage,
  hr: () => <hr className="my-12 border-zinc-200 dark:border-zinc-800" />,
  strong: (props: ComponentPropsWithoutRef<"strong">) => (
    <strong className="font-medium text-zinc-900 dark:text-zinc-100" {...props} />
  ),
  table: (props: ComponentPropsWithoutRef<"table">) => (
    <div className="my-7 overflow-x-auto">
      <table className="w-full border-collapse text-left text-[14px]" {...props} />
    </div>
  ),
  th: (props: ComponentPropsWithoutRef<"th">) => (
    <th
      className="border-b border-zinc-300 py-2 pr-4 font-medium text-zinc-900 dark:border-zinc-700 dark:text-zinc-100"
      {...props}
    />
  ),
  td: (props: ComponentPropsWithoutRef<"td">) => (
    <td className="border-b border-zinc-100 py-2 pr-4 dark:border-zinc-800" {...props} />
  ),
};

export async function Mdx({ source }: { source: string }) {
  const shiki = await getHighlighter();

  return (
    <MDXRemote
      source={source}
      components={components}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [
            rehypeSlug,
            [rehypeAutolinkHeadings, autolinkOptions],
            [rehypeShikiFromHighlighter, shiki, shikiOptions],
          ],
        },
      }}
    />
  );
}
